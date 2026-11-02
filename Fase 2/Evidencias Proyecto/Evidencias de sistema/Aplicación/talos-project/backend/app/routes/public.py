from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import SessionLocal
from app.models import Evento, Noticia, AnalisisNoticia, Medio

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/events/feed")
def get_events_feed(db: Session = Depends(get_db)):
    eventos = db.query(Evento).all()
    feed = []
    
    for evento in eventos:
        noticias = db.query(Noticia).filter(Noticia.evento_id == evento.id).all()
        if not noticias:
            continue
            
        # Cálculo de distribución de sesgo según la cobertura de medios
        left_count = 0
        center_count = 0
        right_count = 0
        
        for noti in noticias:
            medio = db.query(Medio).filter(Medio.id == noti.medio_id).first()
            if medio:
                if medio.sesgo_politico == "Left": left_count += 1
                elif medio.sesgo_politico == "Center": center_count += 1
                elif medio.sesgo_politico == "Right": right_count += 1
        
        total = left_count + center_count + right_count or 1
        
        # Extracción de la primera imagen válida en el clúster
        imagen_representativa = next((n.imagen_url for n in noticias if n.imagen_url), "/images/placeholder.jpg")
        
        # Obtención del análisis NLP asociado al evento
        analisis = db.query(AnalisisNoticia).join(Noticia).filter(Noticia.evento_id == evento.id).first()
        
        feed.append({
            "id": evento.id,
            "titulo_neutro": evento.titulo_neutro,
            "categoria": analisis.categoria if analisis else "Nacional",
            "fecha": "Reciente",
            "n_articulos": len(noticias),
            "imagen_url": imagen_representativa,
            "bias": {
                "left": round((left_count / total) * 100),
                "center": round((center_count / total) * 100),
                "right": round((right_count / total) * 100)
            },
            "subjetividad_promedio": analisis.subjetividad_score * 10 if analisis else 50
        })
        
    return feed