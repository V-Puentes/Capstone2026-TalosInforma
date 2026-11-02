import json
import time
import random
from collector import load_sources, get_article_urls
from extractor import extract_article_content

def run_scraper(limit_per_source: int = 15):
    sources = load_sources("sources.json")
    extracted_articles = []

    print("[*] Iniciando proceso de extracción de noticias...")

    for source in sources:
        print(f"[+] Procesando medio: {source['nombre']}")
        urls = get_article_urls(source)
        print(f"    Encontradas {len(urls)} URLs. Extrayendo hasta {limit_per_source} artículos...")

        count = 0
        for url in urls:
            if count >= limit_per_source:
                break

            article_data = extract_article_content(url, source["id"], source["sesgo"])
            if article_data:
                extracted_articles.append(article_data)
                count += 1
                print(f"    [OK] Extraído: {article_data['titulo'][:50]}...")
            
            # Rate Limiting: Pausa aleatoria entre 1.5 y 3 segundos
            time.sleep(random.uniform(1.5, 3.0))

    output_path = "raw_news.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(extracted_articles, f, ensure_ascii=False, indent=2)

    print(f"[✓] Proceso finalizado. {len(extracted_articles)} noticias guardadas en {output_path}")

if __name__ == "__main__":
    run_scraper(limit_per_source=15)