from pydantic import BaseModel, Field
from typing import List
from enum import Enum

class CategoriaEnum(str, Enum):
    politica = "Política"
    economia = "Economía"
    seguridad = "Seguridad"
    sociedad = "Sociedad"
    internacional = "Internacional"
    otro = "Otro"

class TonoEnum(str, Enum):
    positivo = "Positivo"
    neutral = "Neutral"
    negativo = "Negativo"

class AnalisisNoticia(BaseModel):
    categoria: CategoriaEnum = Field(
        description="Categoría principal de la noticia según su contenido."
    )
    tono_titular: TonoEnum = Field(
        description="Clasificación del tono general expresado específicamente en el titular."
    )
    subjetividad_score: int = Field(
        ge=1, le=10, 
        description="Puntuación del 1 al 10 que evalúa la presencia de adjetivos calificativos y juicios de valor en el texto (1 = totalmente objetivo, 10 = altamente subjetivo)."
    )
    resumen_puntos: List[str] = Field(
        description="Resumen estructurado en un máximo de 3 puntos clave (viñetas) con los datos duros del texto.",
        min_items=1,
        max_items=3
    )