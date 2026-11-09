export type Orientacion = "Left" | "Center" | "Right";

export interface Bias {
  left: number;
  center: number;
  right: number;
}

export interface EventoFeed {
  id: string;
  titulo_neutro: string;
  categoria: string | null;
  fecha: string;
  n_articulos: number;
  n_medios: number;
  imagen_url: string | null;
  imagen_medio: string | null;
  destacado: string | null;
  bias: Bias;
  subjetividad_promedio: number | null;
}

export interface Analisis {
  categoria: string;
  tono_titular: string;
  subjetividad_score: number;
  resumen_puntos: string[];
}

export interface NoticiaDetalle {
  id: string;
  medio_id: string;
  medio_nombre: string;
  sesgo_politico: Orientacion;
  titulo_original: string;
  autor: string | null;
  url_noticia: string;
  imagen_url: string | null;
  analisis: Analisis | null;
}

export interface EventoDetalle {
  id: string;
  titulo_neutro: string;
  fecha: string;
  bias: Bias;
  noticias: NoticiaDetalle[];
}

export interface EstadisticaMedio {
  medio_id: string;
  nombre: string;
  sesgo_politico: Orientacion;
  n_noticias: number;
  subjetividad_promedio: number | null;
  tonos: Record<string, number>;
}

export interface ReporteAdmin {
  id: string;
  noticia_id: string;
  titulo: string;
  url: string;
  motivo: string;
  fecha: string;
}
