-- Migración: Políticas de Row Level Security (RLS)
-- Ejecutar después de add_user_ownership.sql

-- Habilitar RLS (por si acaso no estaban habilitadas)
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sound_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambient_layers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambient_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sound_usages ENABLE ROW LEVEL SECURITY;

-- 1. Políticas para EPISODES (Dueño solo)
CREATE POLICY "Users can manage their own episodes" 
ON episodes FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. Políticas para SEGMENTS (Basado en el dueño del episodio)
CREATE POLICY "Users can manage segments of their episodes" 
ON segments FOR ALL
USING (EXISTS (
  SELECT 1 FROM episodes 
  WHERE episodes.id = segments.episode_id 
  AND episodes.user_id = auth.uid()
));

-- 3. Políticas para SOUND_ASSETS (Lectura pública, creación privada)
CREATE POLICY "Public sound assets are readable by everyone" 
ON sound_assets FOR SELECT
USING (true);

CREATE POLICY "Users can manage their own sound assets" 
ON sound_assets FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Políticas para AMBIENT_LAYERS (Lectura pública)
CREATE POLICY "Public ambient layers are readable by everyone" 
ON ambient_layers FOR SELECT
USING (true);

CREATE POLICY "Users can manage their own ambient layers" 
ON ambient_layers FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. Políticas para USAGES (Ligadas al dueño del segmento/episodio)
CREATE POLICY "Users can manage their ambient usages" 
ON ambient_usages FOR ALL
USING (EXISTS (
  SELECT 1 FROM segments 
  JOIN episodes ON segments.episode_id = episodes.id
  WHERE ambient_usages.segment_id = segments.id
  AND episodes.user_id = auth.uid()
));

CREATE POLICY "Users can manage their sound usages" 
ON sound_usages FOR ALL
USING (EXISTS (
  SELECT 1 FROM segments 
  JOIN episodes ON segments.episode_id = episodes.id
  WHERE sound_usages.segment_id = segments.id
  AND episodes.user_id = auth.uid()
));
