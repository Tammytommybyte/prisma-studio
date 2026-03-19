# Reglas Core: Prisma Studio

## 1. Filosofía del Proyecto (Inquebrantable)
Prisma Studio NO es un DAW (Digital Audio Workstation). El objetivo es "convertir dispersión en un episodio terminado" [6]. 
- NUNCA propongas ni programes editores multipista, automatizaciones de mezcla o generación procedural de audio [8].
- La app organiza, decide, estructura y empuja a terminar [5].

## 2. Stack Tecnológico Obligatorio
Todo el código debe utilizar estrictamente:
- **Frontend:** Next.js (App Router), TypeScript, TailwindCSS, shadcn/ui, Framer Motion [9, 10].
- **Backend y BD:** Supabase (Auth, PostgreSQL, Storage con Row Level Security) [9].
- **Audio UI:** wavesurfer.js o audio HTML5 nativo [8, 9].

## 3. Alcance del MVP (Fase 1)
Limítate a construir las pantallas mínimas:
1. Dashboard [11].
2. CRUD de episodios y segmentos [12].
3. Biblioteca sonora (Gestor de Sonido) [11].
4. Editor narrativo por bloques [13].
5. Vista de grabación ("modo cabina") [11].
6. Módulo de Publicación y panel editorial (Pipeline Kanban) [11].
## 4. Categorización Sónica (Sonic Folders)
Para mantener la coherencia del Agente y la limpieza del catálogo, los efectos (SFX) deben clasificarse en 4 carpetas lógicas:
- **IMPACTOS:** Glitches, stings, golpes secos, acentos.
- **TRANSICIONES:** Swishes, risers, caídas, barras sonoras.
- **ATMOSFERAS:** Fondos específicos (tráfico, lluvia, café, ruido estático) que no sean loops rítmicos.
- **MECÁNICOS:** Sonidos de foley, clics, teclados, interfaces.
- **RELIGIOSO:** Cantos gregorianos, campanas, confesiones, rezos, ambientes de iglesia/catedral.

## 5. Moods de Prisma
Tanto Drones como SFX deben etiquetarse con uno de los 5 Moods oficiales:
- 🖤 **Oscuro**: Tensión, misterio, tristeza profunda.
- 🌫️ **Neutro**: Calma, objetividad, transición limpia.
- ✨ **Luminoso**: Esperanza, claridad, epifanía.
- ⚡ **Tenso**: Ansiedad, urgencia, conflicto.
- 🫀 **Vulnerable**: Intimidad, confesión, empatía.
