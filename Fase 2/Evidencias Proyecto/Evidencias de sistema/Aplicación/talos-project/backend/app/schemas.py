from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class BiasDistribution(BaseModel):
    Left: float
    Center: float
    Right: float

class EventFeedItem(BaseModel):
    id: UUID
    titulo: str
    fecha: datetime
    total_fuentes: int
    distribucion_sesgo: BiasDistribution

class AnalisisItem(BaseModel):
    categoria: str
    tono_titular: str
    subjetividad_score: int
    resumen_puntos: List[str]

class NoticiaDetail(BaseModel):
    id: UUID
    medio_id: str
    medio_nombre: str
    sesgo_politico: str
    titulo_original: str
    autor: Optional[str]
    url_noticia: str
    imagen_url: Optional[str]
    analisis: Optional[AnalisisItem]

class EventDetail(BaseModel):
    id: UUID
    titulo_neutro: str
    fecha_creacion: datetime
    distribucion_sesgo: BiasDistribution
    noticias: List[NoticiaDetail]

class ReportCreate(BaseModel):
    noticia_id: UUID
    motivo: str