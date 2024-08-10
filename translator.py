from flask import Flask, request, jsonify
from transformers import MBartForConditionalGeneration, MBart50TokenizerFast
from flask_cors import CORS
import json
import langid
import logging

app = Flask(__name__)
CORS(app)

# Initialize logging
logging.basicConfig(level=logging.INFO)

model_name = "facebook/mbart-large-50-many-to-many-mmt"
model = MBartForConditionalGeneration.from_pretrained(model_name)
tokenizer = MBart50TokenizerFast.from_pretrained(model_name)

@app.route('/translate', methods=['POST'])
def translate():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid input. No data provided.'}), 400

        src_lang = data.get('src_lang')
        tgt_lang = data.get('tgt_lang')
        text = data.get('text')

        if not src_lang or not tgt_lang or not text:
            return jsonify({'error': 'Please provide source language, target language, and text.'}), 400

        if src_lang not in tokenizer.lang_code_to_id or tgt_lang not in tokenizer.lang_code_to_id:
            return jsonify({'error': 'Invalid source or target language code.'}), 400

        tokenizer.src_lang = src_lang
        encoded_text = tokenizer(text, return_tensors='pt')
        generated_tokens = model.generate(**encoded_text, forced_bos_token_id=tokenizer.lang_code_to_id[tgt_lang])
        raw_translated_text = tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)[0]
        return app.response_class(
            response=json.dumps({'translated_text': raw_translated_text}, ensure_ascii=False),
            status=200,
            mimetype='application/json'
        )
    except Exception as e:
        logging.error("Error during translation: %s", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/detect_language', methods=['POST'])
def detect_language_api():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid input. No data provided.'}), 400

        text = data.get('text')
        if not text:
            return jsonify({'error': 'Please provide text for language detection.'}), 400

        # Detect language
        language_code, confidence = langid.classify(text)
        return jsonify({'detected_language': language_code, 'confidence': confidence})
    except Exception as e:
        logging.error("Error during language detection: %s", str(e))
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
