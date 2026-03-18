import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Waves } from 'lucide-react'
import Link from 'next/link'

export default async function CabinaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // DATOS MOCK TEMPORALES (Sin Supabase) para previsualizar UI en cabina
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
      ambient_usages: [{ ambient_layers: { nombre: 'Deep Space Pad', emocion: 'Oscuro' } }]
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

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-rose-500/30">
      <header className="p-6 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10 shadow-xl">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="flex h-3 w-3 rounded-full bg-rose-500 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.8)]"></span>
            <span className="text-rose-500 font-black tracking-widest uppercase text-xs">En Cabina</span>
          </div>
          <h1 className="text-xl font-bold text-zinc-200">{episode.title}</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Temporizador</p>
            <p className="text-3xl font-mono tracking-tighter text-white">00:00:00</p>
          </div>
          <Link href={`/episodes/${id}`} className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white transition-all">
            Salir
          </Link>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-12 max-w-5xl mx-auto w-full space-y-12 pb-32">
        <div className="text-center mb-16 pt-8">
          <h2 className="text-zinc-600 text-sm uppercase tracking-widest font-bold mb-4">Herida Central / Idea</h2>
          <p className="text-2xl lg:text-4xl font-serif text-zinc-100/90 leading-relaxed max-w-4xl mx-auto italic font-medium">
            "{episode.premise}"
          </p>
          {episode.objetivo_emocional && (
            <div className="mt-8 inline-flex items-center gap-2 border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 px-5 py-2.5 rounded-full font-semibold shadow-[0_0_20px_rgba(79,70,229,0.1)]">
               Objetivo: {episode.objetivo_emocional}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {segments.map((seg, idx) => (
            <Card key={seg.id} className="border-0 bg-zinc-900/40 relative group overflow-visible">
              <div className="absolute -left-4 sm:-left-6 top-6 w-10 sm:w-12 h-10 sm:h-12 rounded-full border-4 border-zinc-950 bg-zinc-800 flex items-center justify-center font-bold text-lg text-white z-10 shadow-lg shadow-black/50">
                {idx + 1}
              </div>
              <CardContent className="p-6 sm:p-8 pl-10 sm:pl-12">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs bg-zinc-950 px-3 py-1 rounded-md">{seg.tipo || 'Desarrollo'}</span>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mt-4 leading-tight">{seg.nombre}</h3>
                  </div>
                  <button className="w-12 h-12 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </button>
                </div>
                
                <p className="text-lg sm:text-xl text-zinc-400 mb-6">
                  Intención: <span className="text-zinc-200 font-medium">{seg.intencion_emocional || 'Neutro'}</span>
                </p>

                {seg.ambient_usages && seg.ambient_usages.length > 0 && (
                  <div className="flex items-center gap-3 border-l-2 border-indigo-500 pl-4 py-2 mt-6 bg-gradient-to-r from-indigo-500/5 to-transparent">
                    <Waves className="w-6 h-6 text-indigo-400" />
                    <div>
                      <p className="text-[10px] font-bold text-indigo-400/80 uppercase tracking-widest">Cama Sonora Activa</p>
                      <p className="text-zinc-200 font-semibold">{seg.ambient_usages[0].ambient_layers.nombre} <span className="text-zinc-500 font-normal">({seg.ambient_usages[0].ambient_layers.emocion})</span></p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
