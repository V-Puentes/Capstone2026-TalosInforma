import uuid
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from preprocessor import prepare_for_clustering

def cluster_articles(articles: list, similarity_threshold: float = 0.45) -> list:
    if not articles:
        return []

    # Preparar el texto de todas las noticias
    texts = [prepare_for_clustering(art) for art in articles]

    # Texto a vectores
    vectorizer = TfidfVectorizer(ngram_range=(1, 2))
    tfidf_matrix = vectorizer.fit_transform(texts)

    # Calcular la similitud entre todos contra todos
    similarity_matrix = cosine_similarity(tfidf_matrix)

    events = []
    processed_indices = set()

    # Agrupacion
    for i in range(len(articles)):
        if i in processed_indices:
            continue

        # Nuevo evento
        event_id = str(uuid.uuid4())
        current_event = {
            "evento_id": event_id,
            "noticias": [articles[i]]
        }
        processed_indices.add(i)

        # Buscar noticias similares a la actual
        for j in range(i + 1, len(articles)):
            if j not in processed_indices and similarity_matrix[i][j] >= similarity_threshold:
                current_event["noticias"].append(articles[j])
                processed_indices.add(j)

        events.append(current_event)

    return events