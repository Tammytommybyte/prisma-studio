-- Configuración de Supabase Storage para Prisma Studio
-- Ejecuta esto en tu SQL Editor de Supabase

-- 1. Crear Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('ambient-layers', 'ambient-layers', true),
  ('sound-assets', 'sound-assets', true),
  ('recordings', 'recordings', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Políticas de Seguridad (RLS)

-- Permiso de Lectura Pública (Todos pueden escuchar)
CREATE POLICY "Acceso público de lectura"
ON storage.objects FOR SELECT
USING (bucket_id IN ('ambient-layers', 'sound-assets', 'recordings'));

-- Permiso de Carga (Solo usuarios autenticados)
CREATE POLICY "Carga para usuarios autenticados"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id IN ('ambient-layers', 'sound-assets', 'recordings') 
  AND auth.role() = 'authenticated'
);

-- Permiso de Borrado (Solo el dueño o admin)
CREATE POLICY "Borrado para dueños"
ON storage.objects FOR DELETE
USING (
  bucket_id IN ('ambient-layers', 'sound-assets', 'recordings') 
  AND auth.role() = 'authenticated'
);
