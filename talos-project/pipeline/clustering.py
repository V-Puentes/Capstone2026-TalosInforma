import os
import uuid
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from preprocessor import prepare_for_clustering

# Umbral calibrado con una muestra revisada a mano (ver diagnostico_clustering.py):
# en los datos reales, las coberturas de un mismo hecho publicadas por medios distintos
# quedaron entre 0,13 y 0,36 de similitud, y los pares sin relación por debajo de 0,10.
# Con el umbral original de 0,45 ningún par de medios distintos alcanzaba a agruparse.
UMBRAL = float(os.getenv("UMBRAL_CLUSTERING", "0.15"))


def _raiz(padres, i):
    while padres[i] != i:
        padres[i] = padres[padres[i]]
        i = padres[i]
    return i


def cluster_articles(articles: list, similarity_threshold: float = UMBRAL) -> list:
    """Agrupa noticias del mismo hecho: TF-IDF (titular con doble peso y lead) y similitud de coseno.
    Dos noticias quedan en el mismo evento si su similitud supera el umbral, directamente o a través
    de otra noticia del grupo (componentes conexas)."""
    if not articles:
        return []

    texts = [prepare_for_clustering(art) for art in articles]
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True)
    similarity = cosine_similarity(vectorizer.fit_transform(texts))

    padres = list(range(len(articles)))
    for i in range(len(articles)):
        for j in range(i + 1, len(articles)):
            if similarity[i][j] >= similarity_threshold:
                padres[_raiz(padres, j)] = _raiz(padres, i)

    grupos = {}
    for i, art in enumerate(articles):
        grupos.setdefault(_raiz(padres, i), []).append(art)

    return [{"evento_id": str(uuid.uuid4()), "noticias": noticias} for noticias in grupos.values()]
