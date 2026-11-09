import time
from main_scraper import run_scraper
from main_clustering import run_clustering
from main_nlp import run_nlp


def run_pipeline():
    inicio = time.time()
    print("=== [1/3] Extracción de Noticias ===")
    run_scraper(limit_per_source=15)

    print("\n=== [2/3] Agrupamiento y Clustering ===")
    run_clustering()

    print("\n=== [3/3] Análisis NLP con Gemini ===")
    run_nlp()

    print(f"\n[✓] Pipeline completado con éxito en {time.time() - inicio:.1f} segundos.")


if __name__ == "__main__":
    run_pipeline()
