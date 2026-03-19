import { createClient } from '@/utils/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Library, PlayCircle, Waves, Sparkles } from 'lucide-react'
import { SoundSearch } from '@/components/library/sound-search'

export default async function LibraryPage() {
  const supabase = await createClient()

  // Initial fetch (Drones/Pads) - later we will handle SFX toggle
  const { data: layers } = await supabase
    .from('ambient_layers')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Recursos Sonoros</span>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white italic">Biblioteca Prisma</h2>
          <p className="text-zinc-500 mt-2 max-w-md">Organiza tus Camas Sonoras y Efectos para inyectar emoción en cada bloque narrativo.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900 rounded-xl px-6">
            Gestionar Storage
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-[0_10px_20px_rgba(79,70,229,0.2)] transition-all px-6">
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Activo
          </Button>
        </div>
      </div>

      <SoundSearch onSearch={(filters) => console.log('Searching...', filters)} />

      {!layers || layers.length === 0 ? (
        <div className="border border-dashed border-zinc-800 rounded-3xl p-20 text-center bg-zinc-950/50 w-full flex flex-col items-center shadow-inner">
          <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
            <Library className="w-10 h-10 text-zinc-600" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-300 mb-2 tracking-tight">Tu ecosistema está en silencio</h3>
          <p className="text-zinc-500 max-w-sm mx-auto mb-8 leading-relaxed">Sube tus archivos de audio para empezar a construir la identidad sonora de tus episodios.</p>
          <Button variant="outline" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 rounded-xl px-10">
            Importar del Núcleo Prisma
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {layers.map((layer) => (
            <Card key={layer.id} className="border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 transition-all border-l-4 border-l-transparent hover:border-l-indigo-500 shadow-xl group overflow-hidden">
              <CardContent className="p-6 flex items-start gap-5">
                <button className="w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-800 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all shrink-0 shadow-inner">
                  <PlayCircle className="w-7 h-7" />
                </button>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-zinc-200 group-hover:text-white transition-colors tracking-tight">{layer.nombre}</h3>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="bg-zinc-950 border border-zinc-800 text-zinc-400 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Waves className="w-3 h-3" />
                      {layer.tipo}
                    </span>
                    <span className="bg-indigo-500/5 text-indigo-400 text-[10px] px-2.5 py-1 rounded-md font-bold border border-indigo-500/10">
                      Energía {layer.energia || 5}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
