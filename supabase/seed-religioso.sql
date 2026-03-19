-- Semillas de Sonido Religioso para Prisma Studio
-- Ejecuta este script en tu SQL Editor de Supabase

-- 1. Ambient Layers (Drones/Pads)
INSERT INTO ambient_layers (nombre, tipo, archivo_url, emocion, energia, intensidad, oscuro_luminoso, etiquetas)
VALUES 
('Catedral de Silencio', 'Pad', 'https://example.com/audio/catedral-silencio.mp3', 'luminoso', 2, 3, 8, '["espiritual", "eco", "paz"]'),
('Abadía Gris', 'Drone', 'https://example.com/audio/abadia-gris.mp3', 'neutro', 4, 5, 5, '["clima", "antiguo", "misterio"]'),
('Inquisición Estática', 'Drone', 'https://example.com/audio/inquisicion.mp3', 'tenso', 7, 8, 2, '["oscuro", "histórico", "miedo"]');

-- 2. Sound Assets (SFX/One-shots)
INSERT INTO sound_assets (nombre, categoria, subcategoria, archivo_url, emocion, energia, etiquetas)
VALUES 
('Campana de San Pedro', 'RELIGIOSO', 'IMPACTOS', 'https://example.com/audio/campana.mp3', 'neutro', 8, '["metal", "iglesia"]'),
('Canto Gregoriano Fragmento', 'RELIGIOSO', 'ATMOSFERAS', 'https://example.com/audio/gregoriano.mp3', 'vulnerable', 4, '["voces", "monjes", "espiritual"]'),
('Confesionario Cerrando', 'RELIGIOSO', 'MECÁNICOS', 'https://example.com/audio/confesion.mp3', 'oscuro', 3, '["madera", "clic", "secreto"]');
