---
description: Guía rápida para desplegar Prisma Studio y empezar a grabar hoy.
---

# 🚀 Despliegue Express: Prisma Studio

Sigue estos pasos para tener tu estudio listo en 15 minutos:

## 1. Configuración de Base de Datos (Supabase)
1. Ve a tu proyecto en [Supabase](https://app.supabase.com).
2. Abre el **SQL Editor**.
3. Copia y ejecuta el contenido de [full-setup.sql](file:///home/nana/prisma-studio/supabase/full-setup.sql).
4. **Almacenamiento**: Ve a "Storage" y crea 3 Buckets con estos nombres exactos (puedes ponerlos públicos): 
   - `ambient-layers`
   - `sound-assets`
   - `recordings`

## 2. Despliegue de Código (Vercel)
1. Sube tu código a un repositorio de GitHub.
2. Crea un nuevo proyecto en [Vercel](https://vercel.com) y enlaza tu repositorio.
3. **Variables de Entorno**: Añade estas dos desde tu panel de Supabase (Settings > API):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Node Version**: Asegúrate de que el proyecto use **Node.js 18.x** (por la compatibilidad de Next 14 que configuramos).

## 3. Preparación para la Grabación
1. Una vez desplegado, entra en tu URL de Vercel.
2. En la **Library**, sube tus sonidos base (se guardarán en tus nuevos buckets).
3. Crea tu primer episodio en el **Pipeline** (Estado: Ideación).
4. Diseña los bloques en el **Editor Pro++**.
5. ¡Entra en la **Cabina** y presiona "Iniciar Sesión"!

> [!TIP]
> Si tienes problemas con el micrófono en Chrome, asegúrate de que el sitio use `https://` (Vercel lo hace por defecto).

¡Mucha suerte con el primer episodio! 🎧🔥
