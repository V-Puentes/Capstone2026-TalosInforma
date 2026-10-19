import sys
import os
import json

# Aseguramos que Python reconozca la carpeta app como módulo
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import Evento, Medio, Noticia, AnalisisNoticia

def run_loader():
    print("[*] Iniciando carga de datos a PostgreSQL...")
    db = SessionLocal()
    try:
        # 1. Cargar medios desde el sources.json del pipeline
        sources_path = os.path.join("..", "pipeline", "sources.json")
        with open(sources_path, "r", encoding="utf-8") as f:
            sources = json.load(f)
            
        for s in sources:
            if not db.query(Medio).filter(Medio.id == s["id"]).first():
                nuevo_medio = Medio(
                    id=s["id"],
                    nombre=s["nombre"],
                    url_base=s["url_seccion"],
                    sesgo_politico=s["sesgo"]
                )
                db.add(nuevo_medio)
        db.commit()
        print("[+] Medios sincronizados correctamente.")

        # 2. Cargar Eventos, Noticias y el Análisis NLP
        events_path = os.path.join("..", "pipeline", "processed_events.json")
        with open(events_path, "r", encoding="utf-8") as f:
            events = json.load(f)

        for event_data in events:
            analisis = event_data.get("analisis", {})
            
            # Asignar un título neutro basado en la categoría detectada por la IA
            titulo_evento = f"Cobertura: {analisis.get('categoria', 'Noticia Nacional')}"
            
            nuevo_evento = Evento(titulo_neutro=titulo_evento)
            db.add(nuevo_evento)
            db.flush() # Genera el ID del evento inmediatamente

            for noti_data in event_data.get("noticias", []):
                # Evitar insertar noticias duplicadas
                if db.query(Noticia).filter(Noticia.url_noticia == noti_data["url"]).first():
                    continue

                nueva_noticia = Noticia(
                    evento_id=nuevo_evento.id,
                    medio_id=noti_data["medio_id"],
                    titulo_original=noti_data["titulo"],
                    cuerpo=noti_data.get("cuerpo", "Sin contenido"),
                    autor=noti_data.get("autor", "Redacción"),
                    url_noticia=noti_data["url"],
                    imagen_url=noti_data.get("imagen_url")
                )
                db.add(nueva_noticia)
                db.flush()

                # Vincular el análisis estructurado de Gemini a la noticia
                if analisis:
                    nuevo_analisis = AnalisisNoticia(
                        noticia_id=nueva_noticia.id,
                        categoria=analisis.get("categoria", "Otro"),
                        tono_titular=analisis.get("tono_titular", "Neutral"),
                        subjetividad_score=analisis.get("subjetividad_score", 5),
                        resumen_puntos=analisis.get("resumen_puntos", [])
                    )
                    db.add(nuevo_analisis)

        db.commit()
        print(f"[✓] Carga finalizada con éxito. {len(events)} eventos procesados y guardados en la BD.")
    
    except Exception as e:
        print(f"[-] Error durante la carga: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_loader()