-- Migración: Añadir propiedad de usuario a tablas clave
-- Ejecutar en el editor SQL de Supabase

-- 1. Añadir user_id a las tablas principales
ALTER TABLE episodes ADD COLUMN IF NOT EXISTS user_id UUID DEFAULT auth.uid();
ALTER TABLE sound_assets ADD COLUMN IF NOT EXISTS user_id UUID DEFAULT auth.uid();
ALTER TABLE ambient_layers ADD COLUMN IF NOT EXISTS user_id UUID DEFAULT auth.uid();

-- 2. Crear índices para búsquedas rápidas por dueño
CREATE INDEX IF NOT EXISTS idx_episodes_user_id ON episodes(user_id);
CREATE INDEX IF NOT EXISTS idx_sound_assets_user_id ON sound_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_ambient_layers_user_id ON ambient_layers(user_id);

-- 3. Comentario para documentación
COMMENT ON COLUMN episodes.user_id IS 'ID del usuario dueño del episodio (Supabase Auth)';
