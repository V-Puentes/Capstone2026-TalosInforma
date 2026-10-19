import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, ForeignKey, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class Medio(Base):
    __tablename__ = "medios"
    id = Column(String(50), primary_key=True) 
    nombre = Column(String(100), nullable=False)
    url_base = Column(String(255), nullable=False)
    sesgo_politico = Column(String(20), nullable=False)
    noticias = relationship("Noticia", back_populates="medio")

class Evento(Base):
    __tablename__ = "eventos"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    titulo_neutro = Column(Text, nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    noticias = relationship("Noticia", back_populates="evento", cascade="all, delete-orphan")

class Noticia(Base):
    __tablename__ = "noticias"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    evento_id = Column(UUID(as_uuid=True), ForeignKey("eventos.id"), nullable=False)
    medio_id = Column(String(50), ForeignKey("medios.id"), nullable=False)
    titulo_original = Column(Text, nullable=False)
    cuerpo = Column(Text, nullable=False)
    autor = Column(String(150), nullable=True)
    url_noticia = Column(String(500), unique=True, nullable=False)
    imagen_url = Column(String(500), nullable=True)
    fecha_publicacion = Column(DateTime, default=datetime.utcnow)

    medio = relationship("Medio", back_populates="noticias")
    evento = relationship("Evento", back_populates="noticias")
    analisis = relationship("AnalisisNoticia", uselist=False, back_populates="noticia", cascade="all, delete-orphan")

class AnalisisNoticia(Base):
    __tablename__ = "analisis_noticias"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    noticia_id = Column(UUID(as_uuid=True), ForeignKey("noticias.id"), unique=True, nullable=False)
    categoria = Column(String(50), nullable=False)
    tono_titular = Column(String(50), nullable=False)
    subjetividad_score = Column(Integer, nullable=False)
    resumen_puntos = Column(JSON, nullable=False)

    noticia = relationship("Noticia", back_populates="analisis")

class Reporte(Base):
    __tablename__ = "reportes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    noticia_id = Column(UUID(as_uuid=True), ForeignKey("noticias.id"), nullable=False)
    motivo = Column(Text, nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow)

class UsuarioAdmin(Base):
    __tablename__ = "usuarios_admin"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)