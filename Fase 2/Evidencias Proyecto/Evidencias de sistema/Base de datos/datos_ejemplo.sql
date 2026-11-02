-- Talos · Datos de ejemplo reales: 3 eventos procesados por el motor NLP (Gemini)
-- Origen: talos-project/pipeline/processed_events.json (octubre 2026)
-- Ejecutar después de schema.sql
BEGIN;
INSERT INTO eventos (id, titulo_neutro) VALUES ('f16a7a35-8ac5-48f3-976c-ba823e2bf5b1', 'Se registran incidentes en marcha por el 18-O: Acceso cerrado en cuatro estaciones de metro') ON CONFLICT DO NOTHING;
WITH ins AS (INSERT INTO noticias (evento_id, medio_id, titulo_original, cuerpo, autor, url_noticia, imagen_url) VALUES ('f16a7a35-8ac5-48f3-976c-ba823e2bf5b1', '2', 'Se registran incidentes en marcha por el 18-O: Acceso cerrado en cuatro estaciones de metro', 'Desde el mediodía de este domingo se está realizando en el centro de Santiago una marcha en conmemoración del séptimo aniversario del estallido social.
Los manifestantes avanzan desde Plaza Baquedano por la Alameda hacia el poniente y, según información preliminar, ya se registran algunos enfrentamientos entre encapuchados y carabineros.
De hecho, Metro de Santiago informó que, debido a los disturbios en el exterior, se mantienen cerradas las estaciones Santa Lucía y Universidad Católica. De igual manera, los accesos por la línea 1 de las estaciones de Baquedano y U. de Chile también se encuentran cerrados, pero sus combinaciones disponibles.
Cabe destacar que no existían autorizaciones por parte de la autoridad regional para ninguna manifestación.
Carabineros mantiene cerrada la Alameda a la altura de Santa Lucía, sector donde los manifestantes intentan avanzar hacia La Moneda.
En ese contexto, personal de Control de Orden Público se encuentra usando elementos de dispersión como el carro lanzaaguas.', 'El Mercurio S.A.P.', 'https://www.emol.com/noticias/Nacional/2026/10/18/1214476/estallido-social-incidentes.html', 'https://static.emol.cl/emol50/Fotos/2026/10/18/file_20261018130433.jpg') ON CONFLICT (url_noticia) DO NOTHING RETURNING id)
INSERT INTO analisis_noticias (noticia_id, categoria, tono_titular, subjetividad_score, resumen_puntos) SELECT id, 'Seguridad', 'Negativo', 2, '["Marcha no autorizada por la conmemoración del 18-O en la Alameda derivó en enfrentamientos entre encapuchados y Carabineros.", "Metro de Santiago cerró las estaciones Santa Lucía y Universidad Católica, y clausuró accesos por Línea 1 en Baquedano y U. de Chile.", "Personal de Control de Orden Público de Carabineros cortó el tránsito en la Alameda y utilizó elementos de dispersión para frenar el avance hacia La Moneda."]'::json FROM ins;
INSERT INTO eventos (id, titulo_neutro) VALUES ('7d889edb-a4ae-41e1-ae7b-5d1980c48ce3', '"Con evidentes lesiones": PDI detiene a sujeto por presunto parricidio de su madre en Pudahuel') ON CONFLICT DO NOTHING;
WITH ins AS (INSERT INTO noticias (evento_id, medio_id, titulo_original, cuerpo, autor, url_noticia, imagen_url) VALUES ('7d889edb-a4ae-41e1-ae7b-5d1980c48ce3', '4', '"Con evidentes lesiones": PDI detiene a sujeto por presunto parricidio de su madre en Pudahuel', 'Un trágico crimen familiar quedó al descubierto durante las últimas horas en el sector de Ciudad de Los Valles, en la comuna de Pudahuel. Un hombre de 42 años fue detenido, acusado de asesinar a su propia madre, una adulta mayor de 72 años.
El subprefecto José Cáceres, jefe de la Brigada de Homicidios Metropolitana, entregó los detalles de las primeras diligencias tras la concurrencia de los detectives al domicilio. "El día de ayer, en horas de la noche, a solicitud del Ministerio Público, personal de la PDI (...) concurre al sitio del suceso en la comuna de Pudahuel por el hallazgo de un cadáver de sexo femenino de la tercera edad", señaló el jefe policial.
Para lograr la pronta captura del presunto autor, el trabajo investigativo en las inmediaciones fue clave. "Se realiza el trabajo científico-técnico en el sitio del suceso, se empadrona, se levanta cámaras, logrando posicionar al imputado, quien corresponde a su hijo", explicó el subprefecto Cáceres.', '24horas', 'https://www.24horas.cl/actualidad/nacional/con-evidentes-lesiones-pdi-detiene-a-sujeto-por-presunto-parricidio', 'https://www.24horas.cl/24horas/site/artic/20261018/imag/foto_0000001320261018110349/PDI.webp') ON CONFLICT (url_noticia) DO NOTHING RETURNING id)
INSERT INTO analisis_noticias (noticia_id, categoria, tono_titular, subjetividad_score, resumen_puntos) SELECT id, 'Seguridad', 'Negativo', 3, '["La PDI detuvo a un hombre de 42 años acusado del presunto parricidio de su madre de 72 años en el sector Ciudad de Los Valles, Pudahuel.", "El hallazgo del cadáver de la víctima con evidentes lesiones ocurrió durante la noche tras una solicitud del Ministerio Público.", "La Brigada de Homicidios Metropolitana posicionó al sospechoso en el sitio del suceso mediante trabajo científico-técnico, empadronamiento y revisión de cámaras."]'::json FROM ins;
INSERT INTO eventos (id, titulo_neutro) VALUES ('ddbf237d-dbc2-4f28-a02b-52b9e2390079', 'Gobierno confirma suspensión de clases en 10 comunas de la RM este martes 20 de octubre') ON CONFLICT DO NOTHING;
WITH ins AS (INSERT INTO noticias (evento_id, medio_id, titulo_original, cuerpo, autor, url_noticia, imagen_url) VALUES ('ddbf237d-dbc2-4f28-a02b-52b9e2390079', '4', 'Gobierno confirma suspensión de clases en 10 comunas de la RM este martes 20 de octubre', 'El biministro Claudio Alvarado anunció la suspensión de clases para este martes 20 de octubre en 10 comunas de la Región Metropolitana situadas en la franja precordillerana y el sector oriente.
La autoridad precisó el alcance territorial de la restricción. La medida rige para todos los establecimientos de educación parvularia, básica y media de las zonas que se encuentren en Alerta Roja.
“Se tomó la decisión de suspender las clases en 10 comunas de la RM que a esta hora ya tienen Alerta Roja por eventualidad de remociones en masa”, sostuvo el biministro.
Comunas sin clases este martes 20 de octubre
Se trata de 10 comunas de sectores precordilleranos de la región:
-
San José de Maipo
-
Puente Alto
-
Pirque
-
La Florida
-
Peñalolén
-
La Reina
-
Las Condes
-
Lo Barnechea
-
Vitacura
-
Colina
Respecto al resto de las comunas del Gran Santiago que no están bajo la medida inmediata, la autoridad ministerial informó que la situación meteorológica se mantiene en monitoreo constante. El reporte sobre eventuales extensiones de la suspensión se entregará durante la jornada de este lunes.', '24horas', 'https://www.24horas.cl/actualidad/nacional/gobierno-confirma-suspension-de-clases-en-10-comunas-rm', 'https://www.24horas.cl/24horas/site/artic/20261018/imag/foto_0000000620261018212548/pexels-owayn-11618563.webp') ON CONFLICT (url_noticia) DO NOTHING RETURNING id)
INSERT INTO analisis_noticias (noticia_id, categoria, tono_titular, subjetividad_score, resumen_puntos) SELECT id, 'Sociedad', 'Neutral', 1, '["El Gobierno suspendió las clases para el martes 20 de octubre en 10 comunas de la franja precordillerana y sector oriente de la Región Metropolitana.", "La medida aplica a educación parvularia, básica y media en zonas con Alerta Roja ante el riesgo de remociones en masa.", "Las comunas afectadas son San José de Maipo, Puente Alto, Pirque, La Florida, Peñalolén, La Reina, Las Condes, Lo Barnechea, Vitacura y Colina."]'::json FROM ins;
COMMIT;
