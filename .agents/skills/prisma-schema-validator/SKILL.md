---
name: prisma-schema-validator
description: Valida que las migraciones de base de datos de PostgreSQL y las llamadas a Supabase coincidan con el esquema oficial de datos de Prisma Studio. Usa esta habilidad cuando el usuario pida crear, leer, actualizar o eliminar tablas y datos.
---
# Prisma DB Schema Validator

## Entidades Principales y Campos Requeridos
Cuando generes código SQL o interfaces Typescript para interactuar con Supabase, respeta SIEMPRE este esquema base estricto y no inventes columnas nuevas:

- **episodes:** `id`, `season_id`, `number`, `title`, `slug`, `premise`, `objetivo_emocional`, `duracion_estimada`, `duracion_real`, `estado`, `fecha_grabacion`, `fecha_publicacion`, `version_actual` [3, 8].
- **segments:** `id`, `episode_id`, `orden`, `nombre`, `tipo`, `duracion_objetivo`, `intencion_emocional` [8, 9].
- **sound_assets:** `id`, `nombre`, `categoria`, `subcategoria`, `archivo_url`, `duracion`, `emocion`, `energia`, `etiquetas`, `favorito`, `reusable`, `license_type` [9, 10].
- **ambient_layers:** (Drones/Pads) `id`, `nombre`, `tipo`, `archivo_url`, `emocion`, `energia`, `intensidad`, `oscuro_luminoso`, `etiquetas`, `favorito`, `uso_frecuente` [9, 11].
- **ambient_usages:** (Asignación al segmento) `id`, `segment_id`, `ambient_layer_id`, `volumen`, `fade_in`, `fade_out`, `loop`, `notes` [10, 12].

## Regla de validación
Antes de ejecutar cualquier inserción de código que toque la base de datos, revisa estas tablas. Si el usuario pide algo fuera de este MVP, recuérdale que no está en la Fase 1.

