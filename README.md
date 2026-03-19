This is a [Next.js](https://nextjs.org) project for **Prisma Studio**.

## Requisitos Previos

1. **Supabase Project**: Crea un proyecto en [Supabase](https://supabase.com).
2. **Base de Datos**: Ejecuta el contenido de `supabase/schema.sql` en el SQL Editor de tu Dashboard de Supabase.
3. **Variables de Entorno**: Configura tu `.env.local` con:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=tu_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
   ```

## Desarrollo Local

```bash
pnpm install
pnpm dev
```

## Despliegue (Deploy)

### 1. Supabase (Backend)
- Asegúrate de haber ejecutado `supabase/schema.sql`.
- (Opcional) Si usas Supabase CLI: `supabase db push`.

### 2. Vercel (Frontend)
La forma más rápida es usar la [Vercel Platform](https://vercel.com/new).

- Conecta tu repositorio de GitHub.
- Configura las variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) en el panel de Vercel.
- Vercel detectará Next.js automáticamente y ejecutará `npm run build`.

### 3. Build Manual (Opcional)
Si quieres probar el build localmente antes de desplegar:
```bash
pnpm build
pnpm start
```
