# Capstone2026-TalosInforma
Proyecto de Capstone 2026 de V. Puentes Aránguiz y C. Sotelo Clavería 

# Talos: Plataforma de Verificación y Análisis de Sesgo en Noticias

**Proyecto CAPSTONE 2026 - Ingeniería en Informática - Duoc UC**

---

## Descripción del Proyecto

**Talos** es una plataforma analítica (hub de contingencia nacional) que permite a los usuarios contrastar titulares y noticias de distintos medios de comunicación, identificando sesgos editoriales y verificando la veracidad de la información.

La plataforma utiliza un modelo de lenguaje (LLM) ajustado con un corpus de noticias chilenas, complementado con un sistema de recuperación de información (RAG) que contrasta afirmaciones con evidencia histórica y contemporánea. Todo esto se presenta en un **mapa de sesgo** que permite visualizar de forma intuitiva la inclinación política de cada medio y noticia.

**El sistema no opera como una IA generativa tradicional**, sino exclusivamente como un motor de análisis y clasificación, promoviendo el pensamiento crítico y la formación de juicios informados por parte del usuario.

### Problemática que resuelve

- Crisis de confianza en los medios de comunicación debido a la proliferación de fake news y contenido generado por IA.
- Sobrecarga informativa y polarización en redes sociales.
- Falta de alfabetización mediática en la población, especialmente en grupos etarios vulnerables (adultos mayores, niños y adolescentes).

### Usuarios objetivo

- Público general interesado en consumir noticias de forma crítica.
- Educadores y estudiantes que deseen desarrollar habilidades de análisis de medios.
- Periodistas e investigadores que busquen herramientas de apoyo al fact-checking.

---

## Tecnologías Utilizadas

### Backend
- **Python 3.11+** con **FastAPI** (API REST)
- **Scrapy / BeautifulSoup** (Web scraping)
- **LangChain** (Orquestación de LLM y RAG)
- **FAISS / Pinecone** (Base de datos vectorial)
- **PostgreSQL** (Base de datos relacional)
- **Redis** (Caché)

### Frontend
- **React 18+** con **Next.js**
- **Tailwind CSS** (Estilizado)
- **Chart.js / D3.js** (Visualizaciones y mapa de sesgo)

### Infraestructura
- **Docker** y **Docker Compose** (Contenerización y despliegue)
- **GitHub** (Control de versiones y evidencias)

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
- Crear un archivo env en la raíz del proyecto con las siguientes variables:

### Base de Datos
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tu_password
POSTGRES_DB=talos_db

### LLM
OPENAI_API_KEY=tu_api_key
### o ruta al modelo local
LLM_MODEL_PATH=./models/llama-3.gguf

### Redis
REDIS_URL=redis://redis:6379

3. **Levantar la infraestructura con Docker Compose**
    ```bash
    docker-compose up --build


### Este comando levantará todos los servicios

- Base de datos PostgreSQL (puerto 5432)

- API FastAPI (puerto 8000)

- Frontend Next.js (puerto 3000)

- Redis (puerto 6379)

4. **Acceder a la plataforma**

- Frontend: http://localhost:3000

- Documentación API (Swagger): http://localhost:8000/docs

5. **Ejecutar el scrapper manualmente**
    ```bash
    docker-compose exec scraper python main.py --run

---

## Roles y Responsabilidades

| Integrante | Rol | Responsabilidades |
|---|---|---|
| Valentina Puentes | Backend & IA | Desarrollo de API, integración de LLM, sistema RAG, scraping y base de datos |
| Cristóbal Sotelo | Frontend & QA | Desarrollo de interfaz de usuario, dashboard visual, pruebas de integración y documentación |

---

## Metodología de Trabajo

El proyecto se desarrolla bajo la metodología ágil Kanban, con un enfoque en el flujo continuo y la priorización de tareas. Esta elección se fundamenta en la necesidad de mantener flexibilidad frente a la experimentación técnica que requiere la configuración de Modelos de Lenguaje (LLMs) y la extracción de datos no estructurados mediante web scraping.

---

## Arquitectura de la Solución

La plataforma se basa en una **arquitectura de microservicios**, diseñada para ser escalable y modular. Cada componente es independiente y se comunica a través de APIs REST.

FRONTEND (React / Next.js): Dashboard + Mapa de sesgo + Visualizaciones
---> API GATEWAY (FastAPI): Autenticación, Enrutamiento, Validaciones
     ---> SERVICIO DE SCRAPING (Python + Scrapy): Extrae noticias de 5+ medios nacionales
          ---> POSTGRESQL: Noticias, usuarios, historial de análisis
     ---> SERVICIO LLM + RAG (LangChain + FAISS + LLM): Análisis de sesgo, veracidad y recuperación de evidencia
          ---> BASE DE DATOS VECTORIAL (FAISS / Pinecone): Embeddings y evidencia histórica
     ---> SERVICIO DE CACHE (Redis): Respuestas frecuentes en memoria

---

