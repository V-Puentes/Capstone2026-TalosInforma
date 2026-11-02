import json
from nlp_engine import analyze_event_with_ai

def run_nlp_pipeline():
    try:
        with open("clustered_news.json", "r", encoding="utf-8") as f:
            events = json.load(f)
    except FileNotFoundError:
        print("[-] Archivo clustered_news.json no encontrado.")
        return
        
    print(f"[*] Iniciando análisis NLP. Procesando primeros 3 eventos de prueba...")
    
    processed_events = []
    
    for idx, event in enumerate(events[:3]):
        print(f"[+] Analizando evento {idx + 1} (ID: {event['evento_id']})...")
        try:
            analysis = analyze_event_with_ai(event["noticias"])
            event["analisis"] = analysis
            processed_events.append(event)
            print("    [OK] Análisis completado con éxito.")
        except Exception as e:
            print(f"    [-] Falló el análisis: {e}")
            
    with open("processed_events.json", "w", encoding="utf-8") as f:
        json.dump(processed_events, f, ensure_ascii=False, indent=2)
        
    print("[✓] Proceso NLP finalizado. Revisa processed_events.json")

if __name__ == "__main__":
    run_nlp_pipeline()