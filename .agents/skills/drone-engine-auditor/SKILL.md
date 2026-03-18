---
name: drone-engine-auditor
description: Úsalo al desarrollar, validar o corregir la lógica del reproductor de audio, el esquema de base de datos de sonidos, o la interfaz de asignación de Drones y Pads (Ambient Layers) para Prisma Studio.
---
# Drone & Pad Engine Skill

## Cuándo usar esta habilidad
- Al crear el reproductor de interfaz de usuario (UI) para la cama sonora.
- Al programar la inserción de audios en los segmentos del guion.
- Al definir las tablas `AmbientLayer` y `AmbientUsage` en Supabase.

## Reglas de Negocio (Estrictas e Inquebrantables)
Al programar validaciones en base de datos o en el Frontend, respeta SIEMPRE la regla de oro del podcast:
1. **Límite por segmento:** Máximo 1 drone o pad por segmento [9, 10]. Si el usuario intenta meter más, la UI debe bloquearlo para evitar que se vuelva una "sopa sonora" [10, 11].
2. **Límite por episodio:** Máximo 5 drones o ambient layers en total por todo el episodio [12, 13].
3. **Mezcla Base:** El volumen de los drones por defecto DEBE programarse siempre entre el 10% y el 25% respecto a la voz al 100% [10, 14].

## Funciones Permitidas en UI (Restricciones Técnicas)
El motor de Drones NO debe ser complejo. NO programes un sintetizador, ni mezcla automática multipista, ni efectos complejos [15]. 
Solo programa 5 controles para la interfaz de los audios:
- Reproducir en loop [15].
- Ajustar volumen [16].
- Fade in / Fade out (usando JS + gain) [15].
- Mood selector (Filtro por emoción: 🖤 oscuro, 🌫️ neutro, ✨ luminoso, ⚡ tenso, 🫀 vulnerable) [11, 15].
- Botón "Usar en segmento" [16].
