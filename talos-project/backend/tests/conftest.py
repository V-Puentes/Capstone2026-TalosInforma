import os
import sys

os.environ["DATABASE_URL"] = os.getenv(
    "TEST_DATABASE_URL", "postgresql://talos_user:talos_pass@localhost:5432/talos_test")
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.models import Medio, Evento, Noticia, AnalisisNoticia, UsuarioAdmin
from app.routes.admin import hash_password


@pytest.fixture(scope="session")
def datos():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    db = SessionLocal()
    db.add_all([Medio(id="1", nombre="Medio D", url_base="https://d.cl", sesgo_politico="Right"),
                Medio(id="4", nombre="Medio C", url_base="https://c.cl", sesgo_politico="Center")])
    ev = Evento(titulo_neutro="Hecho de prueba")
    db.add(ev)
    db.flush()
    for mid, url in [("1", "https://d.cl/a"), ("4", "https://c.cl/a")]:
        n = Noticia(evento_id=ev.id, medio_id=mid, titulo_original="Titular",
                    cuerpo="Texto", url_noticia=url)
        db.add(n)
        db.flush()
        db.add(AnalisisNoticia(noticia_id=n.id, categoria="Política", tono_titular="Neutral",
                               subjetividad_score=3, resumen_puntos=["Dato duro"]))
    db.add(UsuarioAdmin(email="admin@talos.cl", password_hash=hash_password("clave-prueba")))
    db.commit()
    ids = {"evento": str(ev.id), "noticia": str(n.id)}
    db.close()
    return ids


@pytest.fixture
def client():
    return TestClient(app)
