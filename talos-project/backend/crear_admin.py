import sys
from dotenv import load_dotenv

load_dotenv()

from app.database import SessionLocal, Base, engine
from app.models import UsuarioAdmin
from app.routes.admin import hash_password

if len(sys.argv) != 3:
    print("Uso: python crear_admin.py <correo> <contraseña>")
    sys.exit(1)

correo, clave = sys.argv[1], sys.argv[2]
Base.metadata.create_all(bind=engine)
db = SessionLocal()
try:
    u = db.query(UsuarioAdmin).filter(UsuarioAdmin.email == correo).first()
    if u:
        u.password_hash = hash_password(clave)
        print(f"Contraseña actualizada para {correo}")
    else:
        db.add(UsuarioAdmin(email=correo, password_hash=hash_password(clave)))
        print(f"Administrador {correo} creado")
    db.commit()
finally:
    db.close()
