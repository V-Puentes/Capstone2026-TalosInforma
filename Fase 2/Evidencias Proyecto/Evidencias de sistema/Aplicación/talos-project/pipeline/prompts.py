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