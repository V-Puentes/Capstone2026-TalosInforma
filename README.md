# Talos: Plataforma de Análisis Comparativo de Sesgo Editorial

Proyecto APT de la asignatura Capstone (PTY4614), Ingeniería en Informática, Duoc UC. Sección 004D, Grupo 7. Docente: Claudia Reinoso H.

**Aplicación en línea:** [falta url de frontend]

**Documentación de la API (Swagger):** [falta url backend]/docs

**Tablero Kanban:** [falta url a tablero github projects]

## Descripción
 
Cada medio de comunicación cubre los hechos desde su propia línea editorial, y los lectores rara vez comparan coberturas. 
**Talos** es un hub de contingencia nacional que recolecta noticias de diez medios chilenos, agrupa las coberturas de un mismo hecho y muestra cómo se reparten entre medios de izquierda, centro y derecha, junto con el tono del titular, un puntaje de subjetividad y un resumen con los datos duros de cada noticia. Su objetivo es que el público general compare coberturas y forme su propio juicio.

El sistema se encarga de *contrastar* coberturas; la plataforma no califica si un hecho es verdadero ni recomienda medios. La orientación editorial de cada medio no la calcula el modelo de lenguaje: esta es asignada por el equipo y registrada en `sources.json`, respaldada por la literatura (Figueroa-Bustos, 2025; Elejalde et al., 2018) y por la Ley 19.132, como se justifica en la sección 4.2 del informe final 2.6.

Talos no opera como una IA generativa tradicional: no redacta noticias ni genera opiniones. El modelo de lenguaje se usa solo para clasificar, medir y resumir, y así promover el pensamiento crítico del usuario.

### Problemática que resuelve

- Crisis de confianza en los medios de comunicación y deterioro del ecosistema informativo digital.
- Dificultad para identificar a simple vista los sesgos editoriales frente a un mismo hecho.
- Sobrecarga informativa y polarización en redes sociales.
- Baja alfabetización mediática, sobre todo en grupos vulnerables como adultos mayores y adolescentes.

### Usuarios objetivo

- Público general que quiere informarse de forma crítica.
- Docentes e instituciones educativas que enseñan comprensión lectora y reconocimiento de sesgos.
- Periodistas e investigadores que necesitan métricas estructuradas sobre la cobertura de los medios chilenos.

## Tecnologías

| Componente | Tecnologías |
|---|---|
| Pipeline de datos | Python, Requests, BeautifulSoup4 y Trafilatura (extracción), NLTK (preprocesamiento), scikit-learn (TF-IDF y similitud de coseno) |
| Motor NLP | API de Gemini 3.8 Flash (SDK `google-genai`) con temperatura 0, validación con Pydantic y reintentos con Tenacity |
| Base de datos | PostgreSQL 15 con modelos ORM de SQLAlchemy |
| API | FastAPI con documentación Swagger y autenticación JWT para administración |
| Frontend | Next.js, React, Tailwind CSS y Recharts |
| Infraestructura | Docker y Docker Compose; backend en Render y frontend en Vercel |
| Pruebas | Pytest y Locust |

## Arquitectura

La solución sigue una arquitectura desacoplada por componentes. El pipeline recolecta las noticias de los diez medios, las limpia, las agrupa por hecho y las envía al motor NLP, que devuelve un análisis validado por cada noticia. Los componentes del pipeline se comunican mediante archivos JSON con esquemas fijos; el script `loader.py` carga el resultado en PostgreSQL omitiendo los duplicados, la API REST en FastAPI expone los eventos, los análisis y las estadísticas, y el frontend en Next.js los consume por HTTP.

```text
                        10 medios nacionales chilenos
          (sources.json: 3 de izquierda, 4 de centro y 3 de derecha)
                                      │
                     HTML público, respetando robots.txt
                                      │
                                      ▼
    ┌───────────────── PIPELINE: talos-project/pipeline ─────────────────┐
    │ collector.py      Obtiene las URL de cada medio                    │
    │ extractor.py      BeautifulSoup4, con Trafilatura de respaldo;     │
    │                   descarta textos de menos de 80 palabras          │
    │                   ──▶ raw_news.json                                │
    │ preprocessor.py   Limpieza y stopwords con NLTK                    │
    │ clustering.py     TF-IDF y similitud de coseno ≥ 0,45              │
    │                   ──▶ clustered_news.json                          │
    │ nlp_engine.py     Gemini 3.8 Flash, temperatura 0, salida          │
    │                   validada con Pydantic y reintentos con Tenacity  │
    │                   ──▶ processed_events.json                        │
    └────────────────────────────────────────────────────────────────────┘
                                      │
             loader.py: valida y carga, omitiendo URL duplicadas
                                      │
                                      ▼
           ┌──────────── BASE DE DATOS: PostgreSQL 15 ────────────┐
           │ medios, eventos, noticias,                           │
           │ analisis_noticias, reportes y usuarios_admin         │
           │ (tablas generadas desde los modelos ORM)             │
           └──────────────────────────────────────────────────────┘
                                      │
                               SQLAlchemy (ORM)
                                      │
                                      ▼
           ┌────────────────── API REST: FastAPI ─────────────────┐
           │ GET  /events/feed      GET  /events/{id}             │
           │ GET  /stats/medios     POST /reports                 │
           │ POST /admin/login (JWT)    /docs (Swagger)           │
           └──────────────────────────────────────────────────────┘
                                      │
                                 HTTP y JSON
                                      │
                                      ▼
           ┌───── FRONTEND: Next.js, Tailwind CSS y Recharts ─────┐
           │ Feed filtrable con BiasBar                           │
           │ Vista comparativa por orientación editorial          │
           │ Estadísticas por medio                               │
           └──────────────────────────────────────────────────────┘
                                      │
                                      ▼
                          Usuario (público general)

      En local: Docker Compose levanta db, backend, frontend y pipeline.
        En la nube: API y base de datos en Render, frontend en Vercel.
```

La versión gráfica de este diagrama, el modelo entidad-relación, los diagramas UML y los requisitos no funcionales están en el [Documento de Diseño de Software](Fase%202/Evidencias%20Proyecto/Evidencias%20de%20documentaci%C3%B3n/Documento_Diseno_Software_Talos.docx) y en la carpeta [Evidencias de documentación](Fase%202/Evidencias%20Proyecto/Evidencias%20de%20documentaci%C3%B3n).

## Cómo ejecutar en local

Requisitos: Git, Docker y Docker Compose. Para ejecutar el motor NLP se necesita además una clave de la API de Gemini, que se obtiene gratis en Google AI Studio.

1. Clonar el repositorio y entrar a la carpeta del proyecto:

   ```bash
   git clone https://github.com/V-Puentes/Capstone2026-TalosInforma.git
   cd Capstone2026-TalosInforma/talos-project
   ```

2. Crear los archivos de entorno a partir de los ejemplos (ninguno de ellos se sube al repositorio):

   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp pipeline/.env.example pipeline/.env
   ```

   En `pipeline/.env` se escribe la clave `GEMINI_API_KEY` y en `backend/.env` un valor propio para `SECRET_KEY`.

3. Levantar la base de datos, la API y el frontend:

   ```bash
   docker compose up --build -d
   ```

4. Ejecutar el pipeline (recolección, clustering y análisis NLP) y cargar los resultados en la base de datos:

   ```bash
   docker compose run --rm pipeline
   docker compose exec backend python loader.py
   ```

5. Abrir la aplicación en `http://localhost:3000` y la documentación de la API en `http://localhost:8000/docs`.

6. Ejecutar las pruebas:

   ```bash
   docker compose exec backend pytest tests -v
   docker compose run --rm pipeline pytest -v
   ```

El manual técnico, en `Fase 2/Evidencias Proyecto/Evidencias de documentación`, detalla las variables de entorno, el despliegue en Render y Vercel y la solución de problemas frecuentes.

## Integrantes y roles

| Integrante | Rol | Responsabilidades |
|---|---|---|
| Valentina Puentes Aránguiz | Datos, backend y motor NLP | Modelo de datos en PostgreSQL, API REST en FastAPI, motor NLP con Gemini y contenerización con Docker |
| Cristóbal Sotelo Clavería | Pipeline y frontend | Scrapers de los diez medios, preprocesamiento y clustering, frontend en Next.js y despliegue en Vercel |

Ambos integrantes comparten la arquitectura, los diagramas UML, las pruebas unitarias, de integración y de rendimiento, los informes y la revisión cruzada del código mediante pull requests.

## Metodología

El proyecto se gestiona con Kanban en un tablero de GitHub Projects con cinco columnas (Backlog, Análisis/Diseño, En Progreso, Pruebas/Validación y Terminado) y un límite WIP de dos tareas por estado activo. El trabajo se organizó en siete etapas que siguen el ciclo crear, implementar y probar, y el avance se controla con siete hitos (H1 a H7) registrados en la Carta Gantt. Una tarea solo pasa a Terminado cuando sus pruebas se ejecutaron y el otro integrante revisó su código.

## Estructura del repositorio

```text
Capstone2026-TalosInforma/
├── Fase 1/
│   ├── Evidencias Grupales/        Guía 1.5 (definición del proyecto) y formativa 1.4
│   └── Evidencias Individuales/    Autoevaluaciones 1.1 y 1.3 y diarios 1.2 de cada integrante
├── Fase 2/
│   ├── Evidencias Grupales/        Informe de avance 2.4 e informe final 2.6
│   ├── Evidencias Individuales/    Diarios 2.1 y autoevaluaciones 2.2 de cada integrante
│   └── Evidencias Proyecto/        Presentación, Carta Gantt, documentación y evidencias del sistema
├── talos-project/
│   ├── pipeline/                   Scrapers, clustering y motor NLP
│   ├── backend/                    API FastAPI, modelos ORM y loader.py
│   ├── frontend/                   Aplicación Next.js
│   └── docker-compose.yml
└── README.md
```

## Referencias

Elejalde, E., Ferres, L., & Herder, E. (2018). On the nature of real and perceived bias in the mainstream media. *PLOS ONE, 13*(3), e0193765. https://doi.org/10.1371/journal.pone.0193765

Figueroa-Bustos, A. (2025). Agenda temática, uso de fuentes y calidad en los medios alternativos El Ciudadano y El Líbero. *Cuadernos.info*, (61), 229–250. https://doi.org/10.7764/cdi.61.87916

Ley N.º 19.132. (1992, 8 de abril). Crea Empresa Televisión Nacional de Chile. Biblioteca del Congreso Nacional de Chile. https://www.bcn.cl/leychile/navegar?idLey=19132
