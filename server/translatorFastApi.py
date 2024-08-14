from fastapi import FastAPI, Request, HTTPException
from transformers import MBartForConditionalGeneration, MBart50TokenizerFast
from fastapi.middleware.cors import CORSMiddleware
import json
import langid
import logging
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this based on your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize logging
logging.basicConfig(level=logging.INFO)

model_name = "facebook/mbart-large-50-many-to-many-mmt"
model = MBartForConditionalGeneration.from_pretrained(model_name)
tokenizer = MBart50TokenizerFast.from_pretrained(model_name)

class TranslationRequest(BaseModel):
    src_lang: str
    tgt_lang: str
    text: str

class LanguageDetectionRequest(BaseModel):
    text: str

@app.post("/translate")
def translate(request: TranslationRequest):
    try:
        src_lang = request.src_lang
        tgt_lang = request.tgt_lang
        text = request.text

        if src_lang not in tokenizer.lang_code_to_id or tgt_lang not in tokenizer.lang_code_to_id:
            raise HTTPException(status_code=400, detail="Invalid source or target language code.")

        tokenizer.src_lang = src_lang
        encoded_text = tokenizer(text, return_tensors='pt')
        generated_tokens = model.generate(**encoded_text, forced_bos_token_id=tokenizer.lang_code_to_id[tgt_lang])
        raw_translated_text = tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)[0]

        return {"translated_text": raw_translated_text}
    
    except Exception as e:
        logging.error("Error during translation: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/detect_language")
def detect_language_api(request: LanguageDetectionRequest):
    try:
        text = request.text

        # Detect language
        language_code, confidence = langid.classify(text)
        return {"detected_language": language_code, "confidence": confidence}
    
    except Exception as e:
        logging.error("Error during language detection: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000, log_level="info")
