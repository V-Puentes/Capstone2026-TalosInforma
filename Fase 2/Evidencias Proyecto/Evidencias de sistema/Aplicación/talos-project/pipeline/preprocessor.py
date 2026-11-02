import re
import string
import nltk
from nltk.corpus import stopwords

try:
    stop_words = set(stopwords.words('spanish'))
except LookupError:
    nltk.download('stopwords')
    stop_words = set(stopwords.words('spanish'))

def clean_text(text: str) -> str:
    if not text:
        return ""
    text = text.lower()
    text = text.translate(str.maketrans('', '', string.punctuation + '¿¡“”‘’'))
    text = re.sub(r'\d+', '', text)
    words = text.split()
    cleaned_words = [word for word in words if word not in stop_words]
    return " ".join(cleaned_words)

def prepare_for_clustering(article: dict) -> str:
    title = article.get("titulo", "")
    body = article.get("cuerpo", "")
    # Tomamos el titular y los primeros 300 caracteres (lead)
    lead = body[:300] if body else ""
    # Repetimos el título para darle más peso algorítmico
    combined_text = f"{title} {title} {lead}"
    return clean_text(combined_text)