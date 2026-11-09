import os
from dotenv import load_dotenv
from google import genai
from google.genai.errors import ServerError, APIError
from tenacity import retry, retry_if_exception_type, stop_after_attempt, wait_exponential
from prompts import build_article_prompt
from schemas import AnalisisNoticia

load_dotenv()

MODELO = "gemini-3.5-flash"
_client = None


def get_client():
    global _client
    if _client is None:
        key = os.environ.get("GEMINI_API_KEY")
        if not key:
            raise ValueError("Falta GEMINI_API_KEY en pipeline/.env")
        _client = genai.Client(api_key=key)
    return _client


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=2, min=2, max=10),
    retry=retry_if_exception_type((ServerError, APIError)),
)
def analyze_article(article: dict) -> dict:
    resp = get_client().models.generate_content(
        model=MODELO,
        contents=build_article_prompt(article)
    )
    texto = resp.text.strip()
    texto = texto.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    return AnalisisNoticia.model_validate_json(texto).model_dump()
