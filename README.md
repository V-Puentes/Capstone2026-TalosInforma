# Capstone2026-TalosInforma
Proyecto de Capstone 2026 de V. Puentes Aránguiz y C. Sotelo Clavería 

# Talos: Plataforma de Verificación y Análisis de Sesgo en Noticias

**Proyecto CAPSTONE 2026 - Ingeniería en Informática - Duoc UC**

---

## Descripción del Proyecto

**Talos** es una plataforma web analítica (hub de contingencia nacional) que centraliza, clasifica y compara el sesgo editorial de noticias de la prensa nacional chilena. Su objetivo es permitir a los usuarios contrastar coberturas de distintos espectros editoriales y formar sus propios juicios críticos.


La arquitectura del sistema implementa un pipeline de ingesta automatizada (web scraping) que recolecta noticias de 10 medios nacionales, las agrupa semánticamente por hecho noticioso mediante algoritmos de clustering, y utiliza un modelo de lenguaje (LLM) con validación estructurada para evaluar la subjetividad y el tono de cada cobertura. Todo esto se visualiza en un frontend interactivo con un **comparador editorial (Bias Bar)**.

**El sistema no opera como una IA generativa tradicional (no redacta noticias nuevas ni genera opiniones libres)**, sino exclusivamente como un motor de análisis, clasificación y síntesis comparativa, promoviendo el pensamiento crítico y la formación de juicios informados por parte del usuario.

### Problemática que resuelve

- Crisis de confianza en los medios de comunicación y erosión del "ecosistema" informativo digital
- Dificultad para identificar sesgos editoriales a simple vista frente a la misma noticia
- Sobrecarga informativa y polarización en redes sociales.
- Falta de alfabetización mediática en la población, especialmente en grupos etarios vulnerables (adultos mayores, niños y adolescentes).

### Usuarios objetivo

- Público general interesado en consumir noticias de forma crítica.
- Educadores e instituciones que enseñen comprensión lectora, reconocimiento de sesgos y análisis crítico de textos
- Periodistas e investigadores que busquen herramientas que provean métricas estructuradas sobre el comportamiento de medios chilenos.

---

## Tecnologías Utilizadas

### Backend & API
- **Python 3.11+** con **FastAPI** (API REST)
- **SQLAlchemy** (ORM)
- **PostgreSQL** (Base de datos relacional)

### Pipeline de Datos & Inteligencia Artificial
- **BeautifulSoup / Trafilatura** (Web scraping)
- **Scikit-learn (TF-IDF) / NLTK** (Clustering semántico)
- **Gemini 3.8 Flash** (vía Google AI Studio) (Clasificación temática, tono y subjetividad)
- **Pydantic** (Validación de esquemas JSON)
- **Tenacity** (Control de reintentos y esperas para la API)

### Frontend
- **React 18+** con **Next.js**
- **Tailwind CSS** (Estilizado)
- **Recharts** (Gráficos, visualizaciones y mapa comparativo)

### Infraestructura
- **Docker** y **Docker Compose** (Contenerización)
- **GitHub** (Control de versiones y tablero Kanban)
- **Vercel / Render** (Plataformas de despliegue cloud)

---

## Instrucciones de Ejecución

### Prerrequisitos

- Docker y Docker Compose instalados
- Python 3.11+
- Node.js 18+
- Git

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/Capstone2026-TalosInforma.git
   cd Capstone2026-TalosInforma

2. **Configurar variables de entorno**
- Crea un archivo .env en la raíz del proyecto con las siguientes variables:

### Base de Datos
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tu_password
POSTGRES_DB=talos_db
DATABASE_URL=postgresql://postgres:tu_password@db:5432/talos_db

### LLM
GEMINI_API_KEY=tu_api_key_de_google_ai_studio


3. **Levantar la infraestructura con Docker Compose**
    ```bash
    docker-compose up --build


### Este comando levantará todos los servicios

- Base de datos PostgreSQL (puerto 5432)

- API FastAPI (puerto 8000)

- Frontend Next.js (puerto 3000)


4. **Acceder a la plataforma**

- Frontend: http://localhost:3000

- Documentación API (Swagger): http://localhost:8000/docs

5. **Ejecutar el scrapper manualmente**
    ```bash
    # Ejecutar el módulo de ingesta dentro del contenedor del backend
    docker-compose exec scraper python main.py --run

---

## Roles y Responsabilidades

| Integrante | Rol | Responsabilidades |
|---|---|---|
| Valentina Puentes | Arquitectura & Backend | Diseño del modelo relacional (PostgreSQL), API REST (FastAPI), integración y validación del motor NLP (Gemini + Pydantic), contenerización (Docker). |
| Cristóbal Sotelo | Datos & Frontend | Pipeline de web scraping, algoritmo de clustering semántico (TF-IDF), maquetación y desarrollo del frontend interactivo (Next.js + Recharts). |

---

## Metodología de Trabajo

El proyecto se gestiona mediante el marco ágil Kanban utilizando GitHub Projects, estructurado en cinco estados: Backlog, Análisis/Diseño, En Progreso, Pruebas/Validación y Terminado. Se aplica un límite estricto de trabajo en progreso (WIP Limit) de 2 tareas simultáneas por estado activo para garantizar el flujo continuo y asegurar que todo componente esté completamente probado antes de avanzar.

---

## Arquitectura de la Solución

La plataforma se basa en una **arquitectura de microservicios**, diseñada para ser escalable y modular. Cada componente es independiente y se comunica a través de APIs REST.

- **PIPELINE DE INGESTA (ETL y Clustering):**
    > Extrae noticias de los medios, aplica procesamiento de lenguaje natural clásico (NLTK/TF-IDF) para agrupar coberturas del mismo hecho noticioso y guarda los eventos brutos en PostgreSQL.

- **MOTOR NLP (IA, LLM):** 
    > Consume los eventos en lotes, consulta la API de Gemini bajo esquemas estrictos de Pydantic para obtener la subjetividad, tono y resúmenes estructurados, y persiste el análisis en la base de datos.

- **BACKEND (FastAPI):** 
    > Expone los datos procesados y estadísticos a través de servicios REST documentados en Swagger.

- **FRONTEND (Next.js):** 
    > Consume la API y renderiza la interfaz responsiva, el feed de contingencia, los gráficos y el comparador editorial (Bias Bar) para el usuario final.

---

