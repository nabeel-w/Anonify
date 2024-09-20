from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS

socketio = SocketIO(cors_allowed_origins="*", logger=True, engineio_logger=True)

def create_app():
    app = Flask(__name__)

    # Load configurations
    app.config.from_object('app.config.Config')
    CORS(app, expose_headers=['Content-Disposition'])
    socketio.init_app(app)
    

    # Register blueprints
    from app.routes import main_bp
    app.register_blueprint(main_bp)

    return app
