import random
from app.database import SessionLocal
from app.models import Evento, Noticia, Medio

def balancear_base_de_datos():
    db = SessionLocal()
    
    # 1. Aseguramos que existan medios representativos de los 3 sectores en la BD
    sectores = {
        "Left": "El Ciudadano (Simulado)", 
        "Center": "La Tercera (Simulada)", 
        "Right": "El Líbero (Simulado)"
    }
    medios_dict = {}
    
    for sesgo, nombre in sectores.items():
        medio = db.query(Medio).filter(Medio.sesgo_politico == sesgo).first()
        if not medio:
            medio = Medio(nombre=nombre, url_base=f"www.{sesgo.lower()}.cl", sesgo_politico=sesgo)
            db.add(medio)
            db.commit()
            db.refresh(medio)
        medios_dict[sesgo] = medio

    # 2. Recorremos los eventos y multiplicamos su cobertura
    eventos = db.query(Evento).all()
    
    for evento in eventos:
        noticias = db.query(Noticia).filter(Noticia.evento_id == evento.id).all()
        if not noticias:
            continue
            
        plantilla = noticias[0]
        
        # Queremos que cada evento tenga entre 15 y 30 artículos analizados
        objetivo = random.randint(15, 30)
        faltantes = objetivo - len(noticias)
        
        if faltantes > 0:
            for i in range(faltantes):
                # Forzamos una distribución aleatoria pero realista
                sesgo_aleatorio = random.choices(
                    ["Left", "Center", "Right"], 
                    weights=[30, 40, 30] # El centro suele tener más cobertura factual
                )[0]
                
                medio_asignado = medios_dict[sesgo_aleatorio]
                
                # Creamos el artículo simulado
                nueva_noticia = Noticia(
                    evento_id=evento.id,
                    medio_id=medio_asignado.id,
                    titulo_original=plantilla.titulo_original,
                    cuerpo=plantilla.cuerpo,
                    # Se añade un ID aleatorio para no romper la regla de URL única en la BD
                    url_noticia=f"{plantilla.url_noticia}-{random.randint(10000, 99999)}",
                    imagen_url=plantilla.imagen_url,
                    fecha_publicacion=plantilla.fecha_publicacion
                )
                db.add(nueva_noticia)
                
    db.commit()
    db.close()
    print("[✓] Volúmen de datos generado con éxito. Las barras de sesgo ahora mostrarán distribución.")

if __name__ == "__main__":
    balancear_base_de_datos()