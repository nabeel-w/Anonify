from flask import Blueprint, current_app, jsonify, request, send_file, after_this_request, make_response
from flask_socketio import emit, join_room
from . import socketio
import datetime
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os
import json
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from io import StringIO

main_bp = Blueprint('main', __name__)


client_tasks = {}


def allowed_file(filename):
    ALLOWED_EXTS = ['pdf']
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTS

def wrap_text(text, font, font_size, max_width, canvas):
    """Wrap text to fit within max_width"""
    lines = []
    words = text.split(' ')
    current_line = ""
    for word in words:
        test_line = f"{current_line} {word}".strip()
        text_width = canvas.stringWidth(test_line, font, font_size)
        if text_width < max_width:
            current_line = test_line
        else:
            lines.append(current_line)
            current_line = word
    if current_line:
        lines.append(current_line)
    return lines

def create_pdf(texts, pdf_path):
    # Create a PDF file
    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter
    margin = 40
    max_width = width - 2 * margin  # Maximum width for the text

    # Set font and size
    c.setFont("Times-Roman", 12)

    y_position = height - margin  # Start position (top of the page)

    for text in texts:
        # Split the text by newline characters
        paragraphs = text.split('\n')

        y_position -= 14

        for paragraph in paragraphs:
            # Wrap text
            wrapped_lines = wrap_text(paragraph, "Times-Roman", 12, max_width, c)

            for line in wrapped_lines:
                # Add wrapped line to PDF
                c.drawString(margin, y_position, line)
                y_position -= 14  # Move down for the next line

                # Check if we need to create a new page
                if y_position < margin:
                    c.showPage()
                    c.setFont("Times-Roman", 12)
                    y_position = height - margin
                

    # Save the PDF file
    c.save()

def convert_pdf_to_txt(path):
    rsrcmgr = PDFResourceManager()
    retstr = StringIO()
    laparams = LAParams()
    device = TextConverter(rsrcmgr, retstr, laparams=laparams)
    with open(path, 'rb') as fp:
        interpreter = PDFPageInterpreter(rsrcmgr, device)
        for page in PDFPage.get_pages(fp, check_extractable=True):
            interpreter.process_page(page)

    text = retstr.getvalue()
    device.close()
    retstr.close()
    return text

def extract_text_entities(pdf_path, spacy_model, sid, redaction_level="HIGH"):
    nlp = spacy_model
    redaction_levels = {
        "HIGH": [
            "B-EMAIL", "B-ID_NUM", "B-NAME_STUDENT", "B-PHONE_NUM",
            "B-STREET_ADDRESS", "B-URL_PERSONAL", "B-USERNAME",
            "I-NAME_STUDENT", "I-PHONE_NUM",
            "I-STREET_ADDRESS", "I-URL_PERSONAL"
        ],
        "MED": [
            "B-EMAIL", "B-NAME_STUDENT", "B-PHONE_NUM",
            "B-STREET_ADDRESS", "B-USERNAME",
            "I-NAME_STUDENT", "I-PHONE_NUM",
            "I-STREET_ADDRESS"
        ],
        "LOW": [
            "B-EMAIL", "B-NAME_STUDENT", "B-PHONE_NUM",
            "I-NAME_STUDENT", "I-PHONE_NUM"
        ]
    }

    # Extract the entire text from the PDF
    full_text = convert_pdf_to_txt(pdf_path)
    pages = []
    page_texts = full_text.split('\x0c')
    total_pages = len(page_texts)

    for page_num, text in enumerate(page_texts):
        # Emit progress to the client
        progress = (page_num / total_pages) * 100
        if sid:
            socketio.emit('progress', {'progress': progress}, room=sid)

        if text.strip():  # Skip empty pages
            # Process the text with spaCy
            doc = nlp(text)

            # Create a list of (start, end, entity_text) tuples
            entities_to_redact = []
            for ent in doc.ents:
                if ent.label_ in redaction_levels[redaction_level]:
                    entities_to_redact.append((ent.start_char, ent.end_char, ent.text))

            # Sort entities by start position in reverse to avoid issues with overlapping redactions
            entities_to_redact.sort(key=lambda x: x[0], reverse=True)
            pages.append((text, entities_to_redact))

    return pages

def redact_text(pages):
    redacted_pages = []
    for page_text, entities_to_redact in pages:
        redacted_text=page_text
        for start, end, text in entities_to_redact:
            redact_string="X"*len(text)
            redacted_text = redacted_text[:start] + redact_string + redacted_text[end:]
        
        redacted_pages.append(redacted_text)
    
    return redacted_pages

@main_bp.route('/v2/analyze', methods=['POST'])
def v2_analyze_test():
    uploaded_file = request.files['file']
    redaction_level= request.form.get('level')
    sid = request.form.get('sid')
    upload_path=current_app.config['UPLOAD_PATH']
    if uploaded_file and allowed_file(uploaded_file.filename):
        destination = os.path.join(upload_path,uploaded_file.filename)
        uploaded_file.save(destination)

        @after_this_request
        def delete_files(response):
            try:
                os.remove(destination)
            except Exception as error:
                current_app.logger.error(f"Error deleting file: {error}")
            return response 

        if redaction_level in ['HIGH', 'MED', 'LOW']:
            pages=extract_text_entities(destination, current_app.config['SPACY_MODEL'], sid, redaction_level)
            return jsonify(pages), 200
        else:
            return jsonify({"error":"Invalid Redaction Level Input"}), 400
    else:
        return jsonify({"error": "Invalid file or no file uploaded"}), 400

@main_bp.route('/v2/redact', methods=['POST'])
def v2_redact_text():
    pages_with_entities=json.loads(request.form.get('pages'))
    save_path=current_app.config['SAVE_PATH']
    now = datetime.datetime.now()
    timestamp = now.strftime("%Y%m%d_%H%M%S")
    prefix="[REDACTED]"
    extension="pdf"
    file_name=f"{prefix}_{timestamp}.{extension}"
    redacted_text=redact_text(pages_with_entities)
    save_file=os.path.join(save_path, file_name)
    create_pdf(redacted_text, save_file)
    
    return send_file(save_file, as_attachment=True, download_name=file_name, mimetype='application/octet-stream'), 200


@socketio.on('connect')
def handle_connect():
    print('Client connected:', request.sid)

@socketio.on('disconnect')
def handle_disconnect():
    [client_tasks.pop(key) for key in list(client_tasks) if client_tasks[key] == request.sid]
    print('Client disconnected:', request.sid)

@socketio.on('register_task')
def handle_register_task(data):
    task_id = data.get('task_id')
    if task_id:
        client_tasks[task_id] = request.sid  # Map task ID to the client's session ID
        join_room(request.sid)  # Add the client to their own room
        emit('registered', {'status': 'Task registered successfully'})