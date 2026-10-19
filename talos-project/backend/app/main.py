from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import public

# Crea las tablas automáticamente en la BD al iniciar
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Talos API - Observatorio de Sesgo Editorial",
    version="1.0.0",
    description="API REST para el análisis de cobertura y sesgo en prensa chilena."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción limitaremos esto a la URL de Vercel/Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(public.router)

@app.get("/")
def root():
    return {"status": "online", "system": "Talos Backend API"}