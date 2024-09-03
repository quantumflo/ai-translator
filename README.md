
# AI Translator

## Overview
AI Translator is a web-based translation tool that leverages cutting-edge AI models to provide real-time language translation. The application features a modern, responsive front-end built using Web Components, while the backend is powered by Flask and FastAPI frameworks. The AI capabilities are enabled through Hugging Face's Transformers API and an SLM (Small Language Model) model.

## Tools and Technologies

### Frontend
- **Web Components**: The UI of the AI Translator is designed using Web Components, allowing for encapsulated, reusable custom elements. This approach ensures a modern, modular frontend architecture.

### Backend
- **Flask**: A lightweight WSGI web application framework that handles routing and basic server-side functionality for the AI Translator.
- **FastAPI**: This framework powers the API endpoints, enabling high-performance asynchronous handling of translation requests.

### AI/ML
- **Hugging Face**: The application integrates Hugging Face's Transformers API, which provides access to state-of-the-art pre-trained models for natural language processing tasks, including translation.

## Installation

### Prerequisites
- Python 3.x

### Steps
1. Clone the repository.
   ```bash
   git clone https://github.com/yourusername/ai-translator.git
   cd ai-translator
   ```

2. Install backend dependencies.
   ```bash
   cd server
   pip install -r requirements.txt
   ```

3. Start the Flask and FastAPI servers.
   NOTE: Start either flask or FastAPI server
   ```bash
   python translator.py  # Flask server
   uvicorn main:translator --reload  # FastAPI server
   ```

5. Serve the frontend using a local server.
   ```bash
   cd client
   python -m http.server 3000
   ```

6. Open the application in your web browser.
   ```
   http://localhost:3000
   ```

## Usage
1. Enter text in the input box and select the target language from the dropdown.
2. Click the "Translate" button to get the translation.
3. The translated text will appear below the input box.

