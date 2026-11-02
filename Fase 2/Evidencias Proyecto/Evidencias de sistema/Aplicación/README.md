# Evidencia de sistema · Aplicación

Código fuente de **Talos**, organizado por componente de la arquitectura desacoplada.

| Carpeta | Componente | Responsable |
|---|---|---|
| `talos-project/pipeline/` | Scraping (`sources.json`, `collector.py`, `extractor.py`), preprocesamiento NLTK, clustering TF-IDF y motor NLP con Gemini (`nlp_engine.py`, `prompts.py`, `schemas.py`) | Cristóbal Sotelo (ETL y clustering) · Valentina Puentes (motor NLP) |
| `talos-project/backend/` | API REST en FastAPI, modelos SQLAlchemy y script de carga `loader.py` | Valentina Puentes |
| `talos-project/frontend/` | Interfaz web en Next.js, React y Tailwind CSS | Cristóbal Sotelo |
| `talos-project/docker-compose.yml` | Servicio PostgreSQL 15 (Alpine) | Valentina Puentes |
| `prototipo/` | Prototipo navegable del frontend (`talos-demo.html`, `Talos.jsx`) | Cristóbal Sotelo |

## Ejecución local

```bash
cd talos-project
docker compose up -d db                       # PostgreSQL en localhost:5432

# Pipeline (requiere GEMINI_API_KEY en pipeline/.env)
cd pipeline && pip install -r requirements.txt
python main_scraper.py && python main_clustering.py && python main_nlp.py

# Backend
cd ../backend && pip install -r requirements.txt
python loader.py && uvicorn app.main:app --reload   # Swagger en http://localhost:8000/docs

# Frontend
cd ../frontend && npm install && npm run dev        # http://localhost:3000
```

El modelo de datos y sus scripts SQL están en `../Base de datos/`.

## Estado actual (semana 13)

| Componente | Implementado | Pendiente |
|---|---|---|
| Pipeline | Scraping de 10 medios, preprocesamiento NLTK, clustering TF-IDF y motor NLP con Gemini (probado con 3 eventos reales) | Procesar todos los eventos y programar la ejecución diaria |
| Backend | Modelos SQLAlchemy (tablas creadas con `create_all`), `loader.py` y `GET /events/feed` | Endpoints de detalle, estadísticas por medio, reportes y login de administración (JWT) |
| Frontend | Feed con filtros y hechos destacados, BiasBar, vista de detalle y estadísticas con Recharts | Reemplazar los datos de demostración del detalle y de las estadísticas por datos de la API |
| Pruebas | `pipeline/test_scrapers.py` | Pruebas de esquema, de clustering y de integración de la API |
| Docker y despliegue | PostgreSQL 15 en `docker-compose.yml` | Dockerfiles de backend, pipeline y frontend, y despliegue en Render y Vercel |

**Datos simulados:** `backend/balance_data.py` genera coberturas simuladas solo para probar visualmente la BiasBar. Además, el detalle por orientación y el gráfico "Subjetividad por Medio" del frontend usan datos de demostración. Ninguno de ellos es un resultado del análisis real.
