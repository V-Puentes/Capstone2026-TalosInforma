import json
from clustering import cluster_articles


def run_clustering():
    articulos = json.load(open("raw_news.json", encoding="utf-8"))
    eventos = cluster_articles(articulos)
    json.dump(eventos, open("clustered_news.json", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print(f"[✓] {len(eventos)} eventos agrupados")


if __name__ == "__main__":
    run_clustering()
