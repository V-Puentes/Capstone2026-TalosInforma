import json
import os
from pathlib import Path
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()

from app.database import SessionLocal, Base, engine
from app.models import Medio, Evento, Noticia, AnalisisNoticia

AQUI = Path(__file__).resolve().parent
PIPELINE_DIR = Path(os.getenv("PIPELINE_DIR", AQUI.parent / "pipeline"))
if not PIPELINE_DIR.is_absolute():
    PIPELINE_DIR = (AQUI / PIPELINE_DIR).resolve()

PRIORIDAD = {"Center": 0, "Left": 1, "Right": 1}


def titulo_evento(noticias):
    return sorted(noticias, key=lambda n: PRIORIDAD.get(n.get("sesgo_politico"), 2))[0]["titulo"]


def cargar_medios(db):
    fuentes = json.load(open(PIPELINE_DIR / "sources.json", encoding="utf-8"))
    for s in fuentes:
        url = urlparse(s["url_seccion"])
        db.merge(Medio(id=str(s["id"]), nombre=s["nombre"],
                       url_base=f"{url.scheme}://{url.netloc}", sesgo_politico=s["sesgo"]))
    db.commit()
    print(f"[medios] {len(fuentes)} medios sincronizados")


def cargar_eventos(db):
    eventos = json.load(open(PIPELINE_DIR / "processed_events.json", encoding="utf-8"))
    nuevos_eventos = nuevas_noticias = ampliados = 0
    for event_data in eventos:
        grupo, vistas = [], set()
        for n in event_data.get("noticias", []):
            if n["url"] not in vistas:
                grupo.append(n)
                vistas.add(n["url"])
        existentes = {n["url"]: db.query(Noticia).filter(Noticia.url_noticia == n["url"]).first()
                      for n in grupo}
        nuevas = [n for n in grupo if existentes[n["url"]] is None]
        if not nuevas:
            continue
        previa = next((x for x in existentes.values() if x is not None), None)
        if previa:
            evento_id = previa.evento_id
            ampliados += 1
        else:
            evento = Evento(titulo_neutro=titulo_evento(nuevas))
            db.add(evento)
            db.flush()
            evento_id = evento.id
            nuevos_eventos += 1
        for n in nuevas:
            noticia = Noticia(evento_id=evento_id, medio_id=str(n["medio_id"]),
                              titulo_original=n["titulo"], cuerpo=n.get("cuerpo", ""),
                              autor=n.get("autor"), url_noticia=n["url"],
                              imagen_url=n.get("imagen_url"))
            db.add(noticia)
            db.flush()
            a = n.get("analisis")
            if a:
                db.add(AnalisisNoticia(noticia_id=noticia.id, **a))
            nuevas_noticias += 1
    db.commit()
    print(f"[eventos] {nuevos_eventos} nuevos, {ampliados} ampliados, {nuevas_noticias} noticias nuevas")


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        cargar_medios(db)
        cargar_eventos(db)
    finally:
        db.close()
