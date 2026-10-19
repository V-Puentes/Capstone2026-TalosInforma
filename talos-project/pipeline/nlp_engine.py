import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv
from tenacity import retry, stop_after_attempt, wait_fixed
from schemas import AnalisisNoticia
from prompts import SYSTEM_PROMPT, build_user_prompt

load_dotenv()

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise ValueError("Falta la variable GEMINI_API_KEY en el archivo .env")

client = genai.Client(api_key=api_key)

@retry(stop=stop_after_attempt(3), wait=wait_fixed(2))
def analyze_event_with_ai(articles: list) -> dict:
    prompt = build_user_prompt(articles)
    
    full_prompt = (
        f"{SYSTEM_PROMPT}\n\n"
        f"{prompt}\n\n"
        "IMPORTANTE: Devuelve ÚNICA Y EXCLUSIVAMENTE un JSON válido que cumpla con este esquema:\n"
        f"{json.dumps(AnalisisNoticia.model_json_schema(), indent=2, ensure_ascii=False)}\n"
        "No incluyas texto antes ni después del JSON. Inicia con { y termina con }."
    )

    try:
        # Invocación con filtros de seguridad desactivados (vital para procesar noticias reales)
        response = client.models.generate_content(
            model='gemini-3.8-flash',
            contents=full_prompt,
            config=types.GenerateContentConfig(
                temperature=0.0,               safety_settings=[
                    types.SafetySetting(
                        category=types.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                        threshold=types.HarmBlockThreshold.BLOCK_NONE,
                    ),
                    types.SafetySetting(
                        category=types.HarmCategory.HARM_CATEGORY_HARASSMENT,
                        threshold=types.HarmBlockThreshold.BLOCK_NONE,
                    ),
                    types.SafetySetting(
                        category=types.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                        threshold=types.HarmBlockThreshold.BLOCK_NONE,
                    ),
                    types.SafetySetting(
                        category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                        threshold=types.HarmBlockThreshold.BLOCK_NONE,
                    ),
                ]
            )
        )
        
        response_text = response.text.strip()
        
        if response_text.startswith("```json"):
            response_text = response_text[7:-3].strip()
        elif response_text.startswith("```"):
            response_text = response_text[3:-3].strip()
            
        parsed_data = AnalisisNoticia.model_validate_json(response_text)
        return parsed_data.model_dump()
        
    except Exception as e:
        print(f"\n[-] Error detectado: {e}")
        raise e