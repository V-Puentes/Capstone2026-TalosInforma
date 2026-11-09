from datetime import datetime, timezone
import requests
import trafilatura
from bs4 import BeautifulSoup
from collector import HEADERS


def _cuerpo_bs4(soup):
    contenedor = soup.find("article") or soup
    parrafos = [p.get_text(" ", strip=True) for p in contenedor.find_all("p")]
    return "\n".join(p for p in parrafos if len(p.split()) > 5)


def _meta(soup, nombre):
    tag = soup.find("meta", property=nombre) or soup.find("meta", attrs={"name": nombre})
    return tag["content"].strip() if tag and tag.get("content") else None


def extract_article_content(url, medio_id, sesgo):
    try:
        html = requests.get(url, headers=HEADERS, timeout=15).text
    except requests.RequestException as e:
        print(f"[-] No se pudo descargar {url}: {e}")
        return None
    soup = BeautifulSoup(html, "html.parser")
    cuerpo = _cuerpo_bs4(soup)
    if len(cuerpo.split()) < 80:
        cuerpo = trafilatura.extract(html, include_comments=False, include_tables=False) or ""
    if len(cuerpo.split()) < 80:
        return None
    titulo = _meta(soup, "og:title") or (soup.title.get_text(strip=True) if soup.title else "")
    return {
        "url": url,
        "medio_id": str(medio_id),
        "sesgo_politico": sesgo,
        "titulo": titulo,
        "cuerpo": cuerpo,
        "autor": _meta(soup, "author"),
        "imagen_url": _meta(soup, "og:image"),
        "fecha_extraccion": datetime.now(timezone.utc).isoformat(),
    }
