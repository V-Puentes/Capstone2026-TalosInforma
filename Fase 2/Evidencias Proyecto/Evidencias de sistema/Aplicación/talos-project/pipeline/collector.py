import json
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def load_sources(file_path: str = "sources.json") -> list:
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

def get_article_urls(source: dict) -> list:
    urls = set()
    try:
        response = requests.get(source["url_seccion"], headers=HEADERS, timeout=10)
        if response.status_code != 200:
            print(f"[-] Error {response.status_code} al acceder a {source['nombre']}")
            return []

        soup = BeautifulSoup(response.text, "html.parser")
        links = soup.select(source["selector_articulo"])

        for link in links:
            href = link.get("href")
            if href:
                full_url = urljoin(source["url_seccion"], href)
                # Filtro básico para evitar URLs repetidas o links a home
                if full_url.startswith("http"):
                    urls.add(full_url)

    except Exception as e:
        print(f"[-] Excepción recolectando URLs de {source['nombre']}: {e}")

    return list(urls)