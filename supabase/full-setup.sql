-- ==========================================
-- PRISMA STUDIO: CONSOLIDATED DB SETUP
-- ==========================================

-- 1. BASE SCHEMA
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID,
  number INTEGER,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  premise TEXT,
  objetivo_emocional TEXT,
  duracion_estimada INTEGER,
  duracion_real INTEGER,
  estado TEXT DEFAULT 'IDEACION',
  user_id UUID DEFAULT auth.uid(),
  fecha_grabacion TIMESTAMP WITH TIME ZONE,
  fecha_publicacion TIMESTAMP WITH TIME ZONE,
  version_actual INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE segments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE NOT NULL,
  orden INTEGER NOT NULL,
  nombre TEXT NOT NULL,
  tipo TEXT,
  duracion_objetivo INTEGER,
  intencion_emocional TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE sound_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  categoria TEXT,
  subcategoria TEXT,
  archivo_url TEXT NOT NULL,
  user_id UUID DEFAULT auth.uid(),
  duracion INTEGER,
  emocion TEXT,
  energia INTEGER,
  etiquetas JSONB,
  favorito BOOLEAN DEFAULT false,
  reusable BOOLEAN DEFAULT true,
  license_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE ambient_layers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL,
  archivo_url TEXT NOT NULL,
  user_id UUID DEFAULT auth.uid(),
  emocion TEXT,
  energia INTEGER,
  intensidad INTEGER,
  oscuro_luminoso INTEGER,
  etiquetas JSONB,
  favorito BOOLEAN DEFAULT false,
  uso_frecuente BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE ambient_usages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  segment_id UUID REFERENCES segments(id) ON DELETE CASCADE NOT NULL,
  ambient_layer_id UUID REFERENCES ambient_layers(id) ON DELETE CASCADE NOT NULL,
  volumen INTEGER DEFAULT 15,
  fade_in INTEGER DEFAULT 0,
  fade_out INTEGER DEFAULT 0,
  loop BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (segment_id, ambient_layer_id)
);

CREATE TABLE sound_usages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  segment_id UUID REFERENCES segments(id) ON DELETE CASCADE NOT NULL,
  sound_asset_id UUID REFERENCES sound_assets(id) ON DELETE CASCADE NOT NULL,
  volumen INTEGER DEFAULT 80,
  trigger_label TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (segment_id, sound_asset_id)
);

-- 2. RLS POLICIES
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sound_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambient_layers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambient_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sound_usages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Manage own episodes" ON episodes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Manage segments" ON segments FOR ALL USING (EXISTS (SELECT 1 FROM episodes WHERE episodes.id = segments.episode_id AND episodes.user_id = auth.uid()));
CREATE POLICY "Public sound assets" ON sound_assets FOR SELECT USING (true);
CREATE POLICY "Manage own sound assets" ON sound_assets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public ambient layers" ON ambient_layers FOR SELECT USING (true);
CREATE POLICY "Manage own ambient layers" ON ambient_layers FOR ALL USING (auth.uid() = user_id);

-- 3. STORAGE SETUP
-- Manual: Create buckets 'ambient-layers', 'sound-assets', 'recordings' in Supabase UI.
-- Ensure they are set to 'Public' if you want direct URL access.
