-- Talos · Consultas de referencia (equivalentes a la lógica de la API REST)

-- 1. Feed de eventos con distribución de sesgo (GET /events/feed)
SELECT e.id,
       e.titulo_neutro,
       COUNT(n.id)                                                        AS n_articulos,
       ROUND(100.0 * COUNT(*) FILTER (WHERE m.sesgo_politico = 'Left')   / COUNT(*)) AS pct_left,
       ROUND(100.0 * COUNT(*) FILTER (WHERE m.sesgo_politico = 'Center') / COUNT(*)) AS pct_center,
       ROUND(100.0 * COUNT(*) FILTER (WHERE m.sesgo_politico = 'Right')  / COUNT(*)) AS pct_right,
       ROUND(AVG(a.subjetividad_score), 1)                                AS subjetividad_promedio
FROM eventos e
JOIN noticias n          ON n.evento_id = e.id
JOIN medios m            ON m.id = n.medio_id
LEFT JOIN analisis_noticias a ON a.noticia_id = n.id
GROUP BY e.id, e.titulo_neutro
ORDER BY MAX(n.fecha_publicacion) DESC;

-- 2. Estadísticas por medio: cobertura, subjetividad y tono predominante
SELECT m.nombre,
       m.sesgo_politico,
       COUNT(n.id)                          AS noticias,
       ROUND(AVG(a.subjetividad_score), 1)  AS subjetividad_promedio,
       MODE() WITHIN GROUP (ORDER BY a.tono_titular) AS tono_predominante
FROM medios m
LEFT JOIN noticias n          ON n.medio_id = m.id
LEFT JOIN analisis_noticias a ON a.noticia_id = n.id
GROUP BY m.nombre, m.sesgo_politico
ORDER BY noticias DESC, m.nombre;

-- 3. Noticias de un evento con su análisis (vista comparativa)
-- Reemplazar :evento_id por el UUID del evento
SELECT m.nombre, m.sesgo_politico, n.titulo_original, a.tono_titular,
       a.subjetividad_score, a.resumen_puntos
FROM noticias n
JOIN medios m ON m.id = n.medio_id
LEFT JOIN analisis_noticias a ON a.noticia_id = n.id
WHERE n.evento_id = :'evento_id'
ORDER BY m.sesgo_politico;
