# Anonify

Anonify is a powerful and user-friendly redaction tool designed to help users securely anonymize sensitive information in PDFs. This tool leverages state-of-the-art natural language processing techniques to detect personally identifiable information (PII) and offers customizable redaction levels. Anonify is built with a modern tech stack, combining a React frontend, Flask backend, and spaCy's Named Entity Recognition (NER) model, containerized using Docker for seamless deployment and scalability.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Installation](#installation)
- [Usage](#usage)
- [Redaction Levels](#redaction-levels)
- [Security and User Experience](#security-and-user-experience)
- [Improvements and Future Work](#improvements-and-future-work)
- [Contributors](#contributors)
- [Video Tutorial](#video-tutorial)

## Features

- **PDF Text Extraction**: Extracts text from PDFs to identify sensitive information.
- **PII Identification**: Detects various types of PII, including names, emails, phone numbers, addresses, and more.
- **Customizable Redaction Levels**: Offers three levels of redaction—High, Medium, and Low—to meet different privacy needs.
- **Real-time Feedback**: Uses Socket.io to provide real-time updates to the user during the redaction process.
- **Secure and Scalable**: Deployed on Google Cloud Run, containerized with Docker, and uses Nginx for secure and efficient request handling.
- **Downloadable Redacted PDFs**: Users can download the redacted version of their PDFs once they are satisfied with the results.

## Tech Stack

- **Frontend**: React
- **Backend**: Flask
- **Real-time Communication**: Socket.io
- **NLP**: spaCy NER model trained on a large PII dataset
- **Containerization**: Docker
- **Web Server and Reverse Proxy**: Nginx
- **Cloud Deployment**: Google Cloud Run

## Architecture Overview

### Frontend

The frontend of Anonify is built using React to provide a smooth, interactive, and responsive user interface. Users can upload PDFs, select redaction levels, and download the redacted document. React's component-based architecture enables efficient state management and a seamless user experience.

### Backend

The backend is powered by Flask, a lightweight Python web framework, and is responsible for handling API requests, processing PDF documents, and integrating with the spaCy NER model. Flask's simplicity and extensibility make it an excellent choice for developing RESTful APIs.

### Real-time Communication

Socket.io is integrated into the backend to provide real-time communication between the server and the client. This allows users to receive live updates on the progress of their PDF redaction, making the tool more user-friendly and reducing uncertainty during long processing times.

### Containerization

The entire application is containerized using Docker, enabling consistent environments for development, testing, and production. Docker ensures that all dependencies are packaged together, making the application easy to deploy and scalable across various environments.

### Web Server and Reverse Proxy

Nginx serves as a web server for static files and acts as a reverse proxy, forwarding API requests to the Flask backend. This setup enhances security by separating static content from dynamic content and improves performance by offloading static content delivery to Nginx.

### NLP Model

Anonify uses spaCy's Named Entity Recognition (NER) model, which has been trained on a comprehensive dataset of [PII Dataset](https://www.kaggle.com/datasets/alejopaullier/pii-external-dataset). The model is capable of identifying a wide range of PII entities, making the redaction process thorough and reliable.

## Installation

### Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your system.

### Steps

1. **Pull the Docker Image**: Download the pre-built Docker image from Docker Hub:
    ```bash
    docker pull nabeelwasif/readact:1.1.3.RELEASE
    ```
2. **Run the Docker Container**: Start the container while mapping port 80 of your system to port 80 of the container:
    ```bash
    docker run -d -p 80:80 nabeelwasif/readact:1.1.3.RELEASE
    ```
3. **Access the Tool**: Once the container is running, you can access the tool locally in your browser at:
    ```
    http://localhost
    ```

#### If you prefer to use the deployed version, you can visit: [Anonify Web App](https://readact-540550814081.asia-south1.run.app/).

That's it! Anonify is now up and running on your local machine, ready to help you securely redact sensitive information from your PDF files.

## Usage

1. Upload a PDF document to be redacted.
2. Choose the desired redaction level (High, Medium, Low).
3. The tool will extract text from the PDF and identify PII.
4. Preview the identified PII and make adjustments as necessary.
5. Download the redacted PDF once satisfied with the results.

## Redaction Levels

- **High**: Redacts all identified PII and any additional sensitive information.
- **Medium**: Redacts most PII while preserving some context.
- **Low**: Redacts only the most critical PII, retaining as much document structure as possible.

## Security and User Experience

### Security Measures

- **Containerization with Docker**: Isolates the application and its dependencies, reducing the attack surface.
- **Nginx as Reverse Proxy**: Adds an additional layer of security by managing request forwarding and handling SSL termination.
- **spaCy Model for PII Detection**: The NER model has been rigorously trained to accurately identify sensitive information, minimizing the risk of unintentional data exposure.

### User Experience Enhancements

- **Real-time Feedback**: By integrating Socket.io, we provide users with real-time updates on the redaction process, enhancing the user experience and preventing uncertainty.
- **Customizable Redaction Levels**: Users have control over the extent of redaction, allowing them to balance privacy needs with document readability.
- **PDF Formatting**: We are actively working on improving our text extraction and redaction techniques to maintain the original formatting of the document, ensuring the redacted PDFs are as close to the original as possible.

## Improvements and Future Work

- **Enhanced PDF Text Extraction**: We are developing better text scraping methods to preserve the original formatting, including tables, images, and complex layouts.
- **Contextual NLP Model**: We aim to train an improved NLP model that can identify sensitive information beyond standard PII, considering the context of the document. This will allow us to flag sensitive data that may not fit traditional PII categories but still requires redaction.
- **Additional File Formats**: Expanding support for more file types, such as Word documents and spreadsheets.
- **User Annotations**: Allowing users to manually mark areas for redaction, giving more control over the process.

## Contributors

- **Aditya Raj**
- **Nabeel Wasif**
- **Swaraat Chatterjee**
- **Syed Abdul Mannan**

## Video Tutorial

Check out our [video tutorial](https://www.youtube.com/watch?v=r-80MlJG5wI) for a step-by-step guide on how to use Anonify.
