import { NarrativeEditor } from './narrative-editor'

export default async function EpisodeEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // DATOS MOCK TEMPORALES (Sin Supabase) para previsualizar UI
  const episode = {
    id: id,
    title: 'El Glitch Espiritual',
    premise: '¿Por qué sentimos que nuestra mente va a más revoluciones que nuestro cuerpo? Exploramos la ansiedad hiperconectada.',
    objetivo_emocional: 'Pasar de la tensión a la liberación'
  }

  const segments = [
    {
      id: 'seg-1',
      orden: 1,
      nombre: 'Gancho: El Ruido Blanco',
      tipo: 'Apertura',
      intencion_emocional: 'Incomodidad / Tensión',
      ambient_usages: []
    },
    {
      id: 'seg-2',
      orden: 2,
      nombre: 'La Herida: 14 horas de pantalla',
      tipo: 'Vulnerabilidad',
      intencion_emocional: 'Empatía profunda',
      ambient_usages: [{ ambient_layers: { id: 'l1', nombre: 'Deep Space Pad', emocion: 'Oscuro' } }]
    },
    {
      id: 'seg-3',
      orden: 3,
      nombre: 'El Silencio',
      tipo: 'Resolución',
      intencion_emocional: 'Paz absoluta',
      ambient_usages: []
    }
  ]

  const layers = [
    { id: '1', nombre: 'Deep Space Pad', emocion: 'Oscuro', tipo: 'Pad', energia: 3 },
    { id: '2', nombre: 'Ethereal Light', emocion: 'Luminoso', tipo: 'Drone', energia: 2 }
  ]

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-500">
      <NarrativeEditor 
        episode={episode} 
        initialSegments={segments as any} 
        layers={layers}
      />
    </div>
  )
}
