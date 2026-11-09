import json
import random
import time
from datetime import datetime, timedelta, timezone
from collector import load_sources, get_article_urls, permitido
from extractor import extract_article_content

VENTANA_HORAS = 48


def cargar_historial(path="raw_news.json"):
    try:
        previas = json.load(open(path, encoding="utf-8"))
    except FileNotFoundError:
        return []
    limite = datetime.now(timezone.utc) - timedelta(hours=VENTANA_HORAS)
    salida = []
    for a in previas:
        if "fecha_extraccion" in a:
            try:
                dt = datetime.fromisoformat(a["fecha_extraccion"])
                if dt.tzinfo is None:
                    dt = dt.replace(tzinfo=timezone.utc)
                if dt >= limite:
                    salida.append(a)
            except ValueError:
                continue
    return salida


def run_scraper(limit_per_source=15):
    previas = cargar_historial()
    vistas = {a["url"] for a in previas}
    nuevas, errores = [], []
    for source in load_sources("sources.json"):
        try:
            count = 0
            for url in get_article_urls(source):
                if count >= limit_per_source:
                    break
                if url in vistas or not permitido(url):
                    continue
                art = extract_article_content(url, source["id"], source["sesgo"])
                if art:
                    nuevas.append(art)
                    vistas.add(url)
                    count += 1
                time.sleep(random.uniform(1.5, 3.0))
            print(f"[OK] {source['nombre']}: {count} noticias nuevas")
        except Exception as e:
            errores.append(source["nombre"])
            print(f"[-] {source['nombre']}: {e}")
    json.dump(previas + nuevas, open("raw_news.json", "w", encoding="utf-8"),
              ensure_ascii=False, indent=2)
    print(f"[✓] {len(nuevas)} nuevas, {len(previas)} del historial, "
          f"medios con error: {errores or 'ninguno'}")


if __name__ == "__main__":
    run_scraper()
