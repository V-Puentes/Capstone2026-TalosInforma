"""Muestra los pares de noticias de medios distintos más parecidos y cuántos eventos
con varios medios se forman con cada umbral. Sirve para calibrar UMBRAL_CLUSTERING."""
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from preprocessor import prepare_for_clustering
from clustering import cluster_articles

articulos = json.load(open("raw_news.json", encoding="utf-8"))
textos = [prepare_for_clustering(a) for a in articulos]
sim = cosine_similarity(TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True).fit_transform(textos))

pares = sorted(
    ((sim[i][j], i, j) for i in range(len(articulos)) for j in range(i + 1, len(articulos))
     if articulos[i]["medio_id"] != articulos[j]["medio_id"]),
    reverse=True,
)
print("Pares de medios distintos más parecidos (revisar a mano si son el mismo hecho):")
for s, i, j in pares[:20]:
    print(f"  {s:.2f}  {articulos[i]['titulo'][:55]!r}  <->  {articulos[j]['titulo'][:55]!r}")

print("\nEventos con más de un medio según el umbral:")
for u in (0.10, 0.12, 0.15, 0.20, 0.30, 0.45):
    ev = cluster_articles(articulos, u)
    multi = [e for e in ev if len({n["medio_id"] for n in e["noticias"]}) > 1]
    mayor = max(len(e["noticias"]) for e in ev)
    print(f"  umbral {u:.2f}: {len(ev)} eventos, {len(multi)} con varios medios, evento más grande = {mayor} noticias")
