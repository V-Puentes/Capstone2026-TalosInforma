import os
import json
from collector import load_sources, get_article_urls
from extractor import extract_article_content

def test_sources_file_exists():
    assert os.path.exists("sources.json"), "El archivo sources.json no existe"

def test_sources_structure():
    sources = load_sources("sources.json")
    assert len(sources) >= 3, "Deben existir al menos 3 fuentes configuradas"
    for s in sources:
        assert "id" in s
        assert "nombre" in s
        assert "url_seccion" in s
        assert "sesgo" in s
        assert s["sesgo"] in ["Left", "Center", "Right"]

def test_extractor_structure():
    sources = load_sources("sources.json")
    # Tomar la primera fuente para la prueba
    test_source = sources[0]
    
    # Obtener URLs reales usando el selector configurado
    urls = get_article_urls(test_source)
    assert len(urls) > 0, f"No se pudieron extraer URLs de {test_source['nombre']}"
    
    # Probar la extracción en la primera URL válida
    test_url = urls[0]
    result = extract_article_content(test_url, test_source["id"], test_source["sesgo"])
    
    if result is not None:
        assert "titulo" in result
        assert "cuerpo" in result
        assert "medio_id" in result
        assert result["medio_id"] == test_source["id"]