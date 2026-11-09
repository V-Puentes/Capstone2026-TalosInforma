import json
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "es-CL,es;q=0.9,en;q=0.8",
    "Referer": "https://www.google.com/"
}

def load_sources(file_path: str = "sources.json") -> list:
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

def get_article_urls(source: dict) -> list:
    urls = set()
    url = source.get("url_seccion") or source.get("url")
    selector = source.get("selector_articulo") or source.get("selector")

    if not url or not selector:
        print(f"[-] Configuración incompleta para {source.get('nombre', 'fuente desconocida')}")
        return []

    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code != 200:
            print(f"[-] Error {response.status_code} al acceder a {source['nombre']}")
            return []

        soup = BeautifulSoup(response.text, "html.parser")
        links = soup.select(selector)

        for link in links:
            href = link.get("href")
            if href:
                full_url = urljoin(url, href)
                if full_url.startswith("http"):
                    urls.add(full_url)

    except Exception as e:
        print(f"[-] Excepción recolectando URLs de {source.get('nombre', '')}: {e}")

    return list(urls)

from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser

_robots = {}


def permitido(url):
    base = "{0.scheme}://{0.netloc}".format(urlparse(url))
    if base not in _robots:
        rp = RobotFileParser(base + "/robots.txt")
        try:
            rp.read()
        except Exception:
            rp = None
        _robots[base] = rp
    return _robots[base] is None or _robots[base].can_fetch("*", url)
