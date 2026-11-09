from collections import Counter
from datetime import datetime, timedelta, timezone
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models import Evento, Noticia, AnalisisNoticia, Medio, Reporte
from app import schemas

router = APIRouter()


def _bias(noticias):
    c = Counter(n.medio.sesgo_politico for n in noticias)
    total = sum(c.values()) or 1
    return schemas.Bias(left=round(100 * c["Left"] / total),
                        center=round(100 * c["Center"] / total),
                        right=round(100 * c["Right"] / total))


def _eventos(db):
    return (db.query(Evento)
              .options(joinedload(Evento.noticias).joinedload(Noticia.medio),
                       joinedload(Evento.noticias).joinedload(Noticia.analisis))
              .order_by(Evento.fecha_creacion.desc()))


@router.get("/events/feed", response_model=list[schemas.EventoFeed])
def feed(categoria: str | None = None,
         dias: int = Query(7, ge=1, le=60),
         limite: int = Query(30, ge=1, le=100),
         pagina: int = Query(1, ge=1),
         db: Session = Depends(get_db)):
    desde = datetime.now(timezone.utc) - timedelta(days=dias)
    salida = []
    for ev in _eventos(db).filter(Evento.fecha_creacion >= desde).all():
        if not ev.noticias:
            continue
        analisis = [n.analisis for n in ev.noticias if n.analisis]
        cat = Counter(a.categoria for a in analisis).most_common(1)
        cat = cat[0][0] if cat else None
        if categoria and cat != categoria:
            continue
        con_imagen = next((n for n in ev.noticias if n.imagen_url), None)
        salida.append(schemas.EventoFeed(
            id=ev.id, titulo_neutro=ev.titulo_neutro, categoria=cat,
            fecha=ev.fecha_creacion, n_articulos=len(ev.noticias),
            n_medios=len({n.medio_id for n in ev.noticias}),
            imagen_url=con_imagen.imagen_url if con_imagen else None,
            imagen_medio=con_imagen.medio.nombre if con_imagen else None,
            destacado=analisis[0].resumen_puntos[0] if analisis and analisis[0].resumen_puntos else None,
            bias=_bias(ev.noticias),
            subjetividad_promedio=(sum(a.subjetividad_score for a in analisis) / len(analisis)) if analisis else None,
        ))
    return salida[(pagina - 1) * limite: pagina * limite]


@router.get("/events/{evento_id}", response_model=schemas.EventoDetalle)
def detalle(evento_id: UUID, db: Session = Depends(get_db)):
    ev = _eventos(db).filter(Evento.id == evento_id).first()
    if not ev:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Evento no encontrado")
    return schemas.EventoDetalle(
        id=ev.id, titulo_neutro=ev.titulo_neutro, fecha=ev.fecha_creacion, bias=_bias(ev.noticias),
        noticias=[schemas.NoticiaDetalle(
            id=n.id, medio_id=n.medio_id, medio_nombre=n.medio.nombre,
            sesgo_politico=n.medio.sesgo_politico, titulo_original=n.titulo_original,
            autor=n.autor, url_noticia=n.url_noticia, imagen_url=n.imagen_url,
            analisis=schemas.Analisis.model_validate(n.analisis) if n.analisis else None)
            for n in ev.noticias])


@router.get("/stats/medios", response_model=list[schemas.EstadisticaMedio])
def estadisticas(db: Session = Depends(get_db)):
    base = (db.query(Medio.id, Medio.nombre, Medio.sesgo_politico,
                     func.count(Noticia.id), func.avg(AnalisisNoticia.subjetividad_score))
              .outerjoin(Noticia, Noticia.medio_id == Medio.id)
              .outerjoin(AnalisisNoticia, AnalisisNoticia.noticia_id == Noticia.id)
              .group_by(Medio.id, Medio.nombre, Medio.sesgo_politico).all())
    tonos = (db.query(Noticia.medio_id, AnalisisNoticia.tono_titular, func.count())
               .join(AnalisisNoticia, AnalisisNoticia.noticia_id == Noticia.id)
               .group_by(Noticia.medio_id, AnalisisNoticia.tono_titular).all())
    por_medio = {}
    for medio_id, tono, n in tonos:
        por_medio.setdefault(medio_id, {})[tono] = n
    return [schemas.EstadisticaMedio(medio_id=i, nombre=nom, sesgo_politico=s, n_noticias=n,
                                     subjetividad_promedio=float(p) if p is not None else None,
                                     tonos=por_medio.get(i, {}))
            for i, nom, s, n, p in base]


@router.post("/reports", status_code=status.HTTP_201_CREATED)
def crear_reporte(datos: schemas.ReporteCrear, db: Session = Depends(get_db)):
    if not db.get(Noticia, datos.noticia_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Noticia no encontrada")
    rep = Reporte(noticia_id=datos.noticia_id, motivo=datos.motivo)
    db.add(rep)
    db.commit()
    return {"id": str(rep.id)}
