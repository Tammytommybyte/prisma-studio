---
name: drone-engine-auditor
description: Úsalo al desarrollar, validar o corregir la lógica del reproductor de audio, la base de datos de sonidos, o la interfaz de asignación de Drones y Pads (Ambient Layers) para Prisma Studio.
---
# Drone & Pad Engine Skill

## Cuándo usar esta habilidad
- Al crear el reproductor de UI para la cama sonora.
- Al programar la inserción de audio en los segmentos del guion.

## Reglas de Negocio (Estrictas)
Al programar validaciones, respeta SIEMPRE la regla de oro del podcast:
1. **Límite por segmento:** Máximo 1 drone o pad por segmento (AmbientUsage) [15, 16].
2. **Límite por episodio:** Máximo 5 drones/ambient layers en total por episodio [15].
3. **Mezcla Base:** El volumen de los drones por defecto DEBE programarse siempre entre el 10% y el 25% respecto a la voz al 100% [15, 16].

## Funciones Permitidas en UI
El motor de Drones NO debe ser complejo. Solo programa 5 controles [17]:
- Reproducir en loop.
- Ajustar volumen.
- Fade in / Fade out (JS + gain).
- Mood selector (Filtro por emoción: oscuro, neutro, luminoso, tenso, vulnerable) [8, 18].
- Botón "Usar en segmento" [19].
