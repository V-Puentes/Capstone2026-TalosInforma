from datetime import datetime
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict


class Bias(BaseModel):
    left: int
    center: int
    right: int


class EventoFeed(BaseModel):
    id: UUID
    titulo_neutro: str
    categoria: Optional[str]
    fecha: datetime
    n_articulos: int
    n_medios: int
    imagen_url: Optional[str]
    imagen_medio: Optional[str]
    destacado: Optional[str]
    bias: Bias
    subjetividad_promedio: Optional[float]


class Analisis(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    categoria: str
    tono_titular: str
    subjetividad_score: int
    resumen_puntos: List[str]


class NoticiaDetalle(BaseModel):
    id: UUID
    medio_id: str
    medio_nombre: str
    sesgo_politico: str
    titulo_original: str
    autor: Optional[str]
    url_noticia: str
    imagen_url: Optional[str]
    analisis: Optional[Analisis]


class EventoDetalle(BaseModel):
    id: UUID
    titulo_neutro: str
    fecha: datetime
    bias: Bias
    noticias: List[NoticiaDetalle]


class EstadisticaMedio(BaseModel):
    medio_id: str
    nombre: str
    sesgo_politico: str
    n_noticias: int
    subjetividad_promedio: Optional[float]
    tonos: dict


class ReporteCrear(BaseModel):
    noticia_id: UUID
    motivo: str


class LoginEntrada(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
