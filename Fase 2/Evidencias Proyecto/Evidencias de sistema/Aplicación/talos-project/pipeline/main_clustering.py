import json
from clustering import cluster_articles

def run_clustering():
    input_path = "raw_news.json"
    output_path = "clustered_news.json"

    try:
        with open(input_path, "r", encoding="utf-8") as f:
            articles = json.load(f)
    except FileNotFoundError:
        print(f"[-] Archivo {input_path} no encontrado. Ejecuta el scraper primero.")
        return

    print(f"[*] Iniciando clustering de {len(articles)} noticias...")
    
    events = cluster_articles(articles, similarity_threshold=0.45)
    
    # Calcular y mostrar distribución
    for event in events:
        sesgos = [n.get("sesgo_politico", "Unknown") for n in event["noticias"]]
        event["distribucion_sesgo"] = {
            "Left": sesgos.count("Left"),
            "Center": sesgos.count("Center"),
            "Right": sesgos.count("Right")
        }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(events, f, ensure_ascii=False, indent=2)

    print(f"[✓] Se identificaron {len(events)} hechos noticiosos distintos.")
    print(f"[✓] Resultados guardados en {output_path}")

if __name__ == "__main__":
    run_clustering()