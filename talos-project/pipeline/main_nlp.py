import json
import os
import time
from nlp_engine import analyze_article


def es_url_valida(url, cuerpo):
    # Descartar portadas de sección y textos con menos de 80 palabras
    if not url or any(s in url.rstrip("/") for s in ["/actualidad", "/opinion", "/categoria", "/seccion"]):
        return False
    if len(cuerpo.split()) < 80:
        return False
    return True


def run_nlp():
    previos = {}
    if os.path.exists("processed_events.json"):
        for e in json.load(open("processed_events.json", encoding="utf-8")):
            for n in e.get("noticias", []):
                if n.get("analisis"):
                    previos[n["url"]] = n["analisis"]

    eventos = json.load(open("clustered_news.json", encoding="utf-8"))
    todas = [n for e in eventos for n in e.get("noticias", [])]
    total = len(todas)
    
    nuevos = fallidos = ignorados = 0
    contador = 0
    inicio = time.time()
    
    print(f"[+] Procesando NLP para {total} noticias...")
    
    for e in eventos:
        for n in e["noticias"]:
            contador += 1
            url = n.get("url", "")
            cuerpo = n.get("cuerpo", "")
            
            if url in previos:
                n["analisis"] = previos[url]
                continue
                
            if not es_url_valida(url, cuerpo):
                ignorados += 1
                continue
                
            titulo_corte = n.get("titulo", "Sin título")[:50]
            print(f"[{contador}/{total}] Analizando: {titulo_corte}...")
            
            try:
                n["analisis"] = analyze_article(n)
                nuevos += 1
            except Exception as err:
                fallidos += 1
                print(f"[-] Error en {url}: {err}")
                
            time.sleep(6)
            
    json.dump(eventos, open("processed_events.json", "w", encoding="utf-8"),
              ensure_ascii=False, indent=2)
    
    print(f"\n[✓] [NLP] {nuevos} analizadas, {ignorados} omitidas (portadas/cortos), {fallidos} fallidas.")
    if nuevos:
        print(f"    Tiempo promedio: {(time.time() - inicio) / nuevos:.1f} s/noticia")


if __name__ == "__main__":
    run_nlp()
