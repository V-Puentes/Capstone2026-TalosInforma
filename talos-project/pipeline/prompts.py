SYSTEM_PROMPT = """Eres un analista de medios experto e imparcial. 
Tu objetivo es analizar un grupo de noticias chilenas que hablan sobre el mismo evento y extraer información estructurada y objetiva.
NO debes generar opiniones, redactar artículos nuevos ni alucinar información. 
Debes limitarte estrictamente a extraer y clasificar según el esquema JSON solicitado."""

def build_user_prompt(articles: list) -> str:
    prompt = "Analiza el siguiente conjunto de artículos sobre un mismo evento noticioso:\n\n"
    for idx, art in enumerate(articles, 1):
        prompt += f"--- Artículo {idx} ---\n"
        prompt += f"Titular: {art.get('titulo', 'N/A')}\n"
        prompt += f"Cuerpo (extracto): {art.get('cuerpo', '')[:1000]}...\n\n"
    
    return prompt

def build_article_prompt(article):
    cuerpo = (article.get("cuerpo") or "")[:1500]
    return f"""Eres un analista de medios. Analiza la siguiente noticia de un medio chileno.

Debes responder ÚNICAMENTE con un objeto JSON válido con este formato:
{{
  "categoria": "<Política|Economía|Seguridad|Internacional|Sociedad|Otro>",
  "tono_titular": "<Positivo|Neutral|Negativo>",
  "subjetividad_score": <entero del 1 al 10>,
  "resumen_puntos": ["punto 1", "punto 2", "punto 3"]
}}

Reglas:
- categoria: elige exactamente una de las 6 permitidas.
- tono_titular: clasifica la carga del titular.
- subjetividad_score: 1 (objetivo/datos duros) a 10 (altamente subjetivo/opinión).
- resumen_puntos: entre 1 y 3 frases breves con datos verificables.

Titular: {article.get("titulo", "")}
Texto: {cuerpo}
"""
