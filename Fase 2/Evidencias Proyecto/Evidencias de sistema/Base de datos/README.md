# Evidencia de sistema · Base de datos

Modelo relacional de **Talos** en PostgreSQL 15. Es el equivalente SQL de los modelos ORM en
`../Aplicación/talos-project/backend/app/models.py` (SQLAlchemy).

| Archivo | Contenido |
|---|---|
| `Modelo_Entidad_Relacion.png` | Diagrama Entidad-Relación con las 6 tablas y sus cardinalidades |
| `schema.sql` | Creación de tablas, claves, restricciones, índices y carga inicial de los 10 medios (desde `sources.json`) |
| `datos_ejemplo.sql` | Datos reales: 3 eventos analizados por el motor NLP (`processed_events.json`, octubre 2026) |
| `consultas.sql` | Consultas de referencia: feed con distribución de sesgo, estadísticas por medio y vista comparativa de un evento |

## Tablas

| Tabla | Propósito | Relaciones |
|---|---|---|
| `medios` | Medio de comunicación y su orientación editorial (`Left`, `Center`, `Right`) | 1:N con `noticias` |
| `eventos` | Hecho noticioso que agrupa coberturas de distintos medios (resultado del clustering) | 1:N con `noticias` |
| `noticias` | Artículo extraído por el pipeline de scraping | N:1 con `eventos` y `medios`; 1:1 con `analisis_noticias` |
| `analisis_noticias` | Categoría, tono del titular, subjetividad (1 a 10) y resumen en viñetas del motor NLP | 1:1 con `noticias` |
| `reportes` | Reportes de usuarios sobre una noticia | N:1 con `noticias` |
| `usuarios_admin` | Administradores (contraseña almacenada como hash) | — |

## Cómo probarlo

Con el contenedor de PostgreSQL del proyecto levantado (`docker compose up -d db` en `talos-project/`):

```bash
psql -h localhost -U talos_user -d talos_db -f schema.sql
psql -h localhost -U talos_user -d talos_db -f datos_ejemplo.sql
psql -h localhost -U talos_user -d talos_db -v evento_id=ddbf237d-dbc2-4f28-a02b-52b9e2390079 -f consultas.sql
```

Los tres scripts se verificaron sobre PostgreSQL sin errores. El resultado del join entre eventos, noticias,
medios y análisis es:

| Evento | Medio | Sesgo | Categoría | Tono | Subjetividad |
|---|---|---|---|---|---|
| Incidentes en marcha por el 18-O | Emol | Right | Seguridad | Negativo | 2 |
| PDI detiene a sujeto por presunto parricidio en Pudahuel | TVN | Center | Seguridad | Negativo | 3 |
| Suspensión de clases en 10 comunas de la RM | TVN | Center | Sociedad | Neutral | 1 |
