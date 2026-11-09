import os
from datetime import datetime, timedelta, timezone
import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import UsuarioAdmin, Reporte, Noticia
from app import schemas

router = APIRouter(prefix="/admin", tags=["admin"])
SECRET_KEY = os.getenv("SECRET_KEY", "solo-desarrollo")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
EXPIRA = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "120"))
oauth2 = OAuth2PasswordBearer(tokenUrl="/admin/login")


def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()


@router.post("/login", response_model=schemas.Token)
def login(datos: schemas.LoginEntrada, db: Session = Depends(get_db)):
    u = db.query(UsuarioAdmin).filter(UsuarioAdmin.email == datos.email).first()
    if not u or not bcrypt.checkpw(datos.password.encode(), u.password_hash.encode()):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Credenciales inválidas")
    exp = datetime.now(timezone.utc) + timedelta(minutes=EXPIRA)
    token = jwt.encode({"sub": u.email, "exp": exp}, SECRET_KEY, algorithm=ALGORITHM)
    return schemas.Token(access_token=token)


def admin_actual(token: str = Depends(oauth2)):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])["sub"]
    except JWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token inválido")


@router.get("/reports")
def listar_reportes(_: str = Depends(admin_actual), db: Session = Depends(get_db)):
    filas = (db.query(Reporte, Noticia.titulo_original, Noticia.url_noticia)
               .join(Noticia, Noticia.id == Reporte.noticia_id)
               .order_by(Reporte.fecha.desc()).all())
    return [{"id": str(r.id), "noticia_id": str(r.noticia_id), "titulo": titulo, "url": url,
             "motivo": r.motivo, "fecha": r.fecha}
            for r, titulo, url in filas]