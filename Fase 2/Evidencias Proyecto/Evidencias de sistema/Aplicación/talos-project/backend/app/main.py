from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import public
from app.database import Base, engine

# Asegurar la creación de tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Talos API - Observatorio de Sesgo Editorial")

# Habilitar CORS para permitir peticiones desde el Frontend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(public.router)