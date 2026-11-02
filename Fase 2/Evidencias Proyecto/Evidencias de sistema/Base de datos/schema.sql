-- =====================================================================
-- Talos · Modelo relacional (PostgreSQL 15)
-- Equivalente SQL de talos-project/backend/app/models.py (SQLAlchemy)
-- Grupo 7 · Capstone PTY4614 · Duoc UC San Joaquín
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()

-- Medios de comunicación y su orientación editorial
CREATE TABLE IF NOT EXISTS medios (
    id              VARCHAR(50)  PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    url_base        VARCHAR(255) NOT NULL,
    sesgo_politico  VARCHAR(20)  NOT NULL
        CHECK (sesgo_politico IN ('Left', 'Center', 'Right'))
);

-- Hecho noticioso que agrupa coberturas de distintos medios (clustering)
CREATE TABLE IF NOT EXISTS eventos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo_neutro   TEXT NOT NULL,
    fecha_creacion  TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'utc')
);

-- Noticia extraída por el pipeline de scraping
CREATE TABLE IF NOT EXISTS noticias (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evento_id          UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
    medio_id           VARCHAR(50) NOT NULL REFERENCES medios(id),
    titulo_original    TEXT NOT NULL,
    cuerpo             TEXT NOT NULL,
    autor              VARCHAR(150),
    url_noticia        VARCHAR(500) NOT NULL UNIQUE,
    imagen_url         VARCHAR(500),
    fecha_publicacion  TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'utc')
);

-- Resultado del motor NLP (relación 1:1 con noticias)
CREATE TABLE IF NOT EXISTS analisis_noticias (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    noticia_id          UUID NOT NULL UNIQUE REFERENCES noticias(id) ON DELETE CASCADE,
    categoria           VARCHAR(50) NOT NULL,
    tono_titular        VARCHAR(50) NOT NULL,
    subjetividad_score  INTEGER NOT NULL CHECK (subjetividad_score BETWEEN 1 AND 10),
    resumen_puntos      JSON NOT NULL
);

-- Reportes de usuarios sobre una noticia
CREATE TABLE IF NOT EXISTS reportes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    noticia_id  UUID NOT NULL REFERENCES noticias(id),
    motivo      TEXT NOT NULL,
    fecha       TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'utc')
);

-- Usuarios administradores (contraseña almacenada como hash)
CREATE TABLE IF NOT EXISTS usuarios_admin (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email          VARCHAR(100) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL
);

-- Índices de apoyo a las consultas de la API (/events/feed)
CREATE INDEX IF NOT EXISTS idx_noticias_evento  ON noticias (evento_id);
CREATE INDEX IF NOT EXISTS idx_noticias_medio   ON noticias (medio_id);
CREATE INDEX IF NOT EXISTS idx_reportes_noticia ON reportes (noticia_id);

-- Carga inicial de medios (desde pipeline/sources.json)
INSERT INTO medios (id, nombre, url_base, sesgo_politico) VALUES ('1', 'El Libero', 'https://ellibero.cl/', 'Right') ON CONFLICT (id) DO NOTHING;
INSERT INTO medios (id, nombre, url_base, sesgo_politico) VALUES ('2', 'Emol', 'https://www.emol.com/nacional/', 'Right') ON CONFLICT (id) DO NOTHING;
INSERT INTO medios (id, nombre, url_base, sesgo_politico) VALUES ('3', 'Ex-Ante', 'https://www.ex-ante.cl/', 'Right') ON CONFLICT (id) DO NOTHING;
INSERT INTO medios (id, nombre, url_base, sesgo_politico) VALUES ('4', 'TVN', 'https://www.24horas.cl/actualidad/nacional', 'Center') ON CONFLICT (id) DO NOTHING;
INSERT INTO medios (id, nombre, url_base, sesgo_politico) VALUES ('5', 'CNN', 'https://www.cnnchile.com/pais/', 'Center') ON CONFLICT (id) DO NOTHING;
INSERT INTO medios (id, nombre, url_base, sesgo_politico) VALUES ('6', 'Publimetro', 'https://www.publimetro.cl/noticias/', 'Center') ON CONFLICT (id) DO NOTHING;
INSERT INTO medios (id, nombre, url_base, sesgo_politico) VALUES ('7', 'Radio Cooperativa', 'https://www.cooperativa.cl/noticias/pais/', 'Center') ON CONFLICT (id) DO NOTHING;
INSERT INTO medios (id, nombre, url_base, sesgo_politico) VALUES ('8', 'El Ciudadano', 'https://www.elciudadano.com/chile/', 'Left') ON CONFLICT (id) DO NOTHING;
INSERT INTO medios (id, nombre, url_base, sesgo_politico) VALUES ('9', 'El Siglo', 'https://elsiglo.cl/nacional/', 'Left') ON CONFLICT (id) DO NOTHING;
INSERT INTO medios (id, nombre, url_base, sesgo_politico) VALUES ('10', 'Interferencia', 'https://interferencia.cl/', 'Left') ON CONFLICT (id) DO NOTHING;
