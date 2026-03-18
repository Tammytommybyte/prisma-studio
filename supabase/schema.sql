-- Schema de BD para Prisma Studio (PostgreSQL para Supabase)

CREATE TABLE episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID,
  number INTEGER,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  premise TEXT,
  objetivo_emocional TEXT,
  duracion_estimada INTEGER, -- en segundos
  duracion_real INTEGER,
  estado TEXT DEFAULT 'draft',
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
  volumen INTEGER DEFAULT 15, -- entre 10 y 25%
  fade_in INTEGER DEFAULT 0,
  fade_out INTEGER DEFAULT 0,
  loop BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (segment_id, ambient_layer_id)
);

-- Habilitar Row Level Security e id de user en un futuro cuando completemos policies
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sound_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambient_layers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambient_usages ENABLE ROW LEVEL SECURITY;
