import trafilatura
from bs4 import BeautifulSoup
from datetime import datetime

def extract_article_content(url: str, medio_id: str, sesgo: str) -> dict:
    try:
        downloaded = trafilatura.fetch_url(url)
        if not downloaded:
            return None

        # Extracción del cuerpo limpio
        text_body = trafilatura.extract(
            downloaded,
            include_comments=False,
            include_tables=False,
            no_fallback=False
        )

        # Si el texto es demasiado corto o falló la extracción, descartar
        if not text_body or len(text_body.split()) < 80:
            return None

        # Extracción de metadatos vía OpenGraph / HTML
        soup = BeautifulSoup(downloaded, "html.parser")

        # Titular
        og_title = soup.find("meta", property="og:title")
        title = og_title["content"] if og_title else (soup.find("title").get_text() if soup.find("title") else "")

        # Imagen principal
        og_image = soup.find("meta", property="og:image")
        image_url = og_image["content"] if og_image else None

        # Autor (búsqueda por tags comunes)
        author = None
        author_meta = soup.find("meta", attrs={"name": "author"}) or soup.find("meta", property="article:author")
        if author_meta:
            author = author_meta.get("content")

        return {
            "medio_id": medio_id,
            "sesgo_politico": sesgo,
            "url": url,
            "titulo": title.strip(),
            "cuerpo": text_body.strip(),
            "autor": author.strip() if author else "Redacción",
            "imagen_url": image_url,
            "fecha_extraccion": datetime.utcnow().isoformat()
        }

    except Exception as e:
        print(f"[-] Error extrayendo contenido de {url}: {e}")
        return None