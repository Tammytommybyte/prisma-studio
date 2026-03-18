import { createClient } from '@/utils/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Library, PlayCircle, Waves } from 'lucide-react'

export default async function LibraryPage() {
  const supabase = await createClient()

  // For this MVP, we query ambient_layers
  const { data: layers } = await supabase
    .from('ambient_layers')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Biblioteca Sonora</h2>
          <p className="text-zinc-400">Gestiona tus Drones y Pads para asignarlos a tus episodios.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.2)] transition-all">
          <Plus className="w-5 h-5 mr-2" />
          Añadir Sonido
        </Button>
      </div>

      {!layers || layers.length === 0 ? (
        <div className="border border-dashed border-zinc-800 rounded-2xl p-12 text-center bg-zinc-900/30 w-full flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4 shadow-inner">
            <Library className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-xl font-bold text-zinc-200 mb-2">Biblioteca vacía</h3>
          <p className="text-zinc-400 max-w-sm mx-auto mb-6">Sube tus capas de ambientación (Drones/Pads) a tu storage y mintealos aquí.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {layers.map((layer) => (
            <Card key={layer.id} className="border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/60 transition-all flex flex-col relative overflow-hidden group">
              <CardContent className="p-6 flex items-start gap-4">
                <button className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors shrink-0">
                  <PlayCircle className="w-6 h-6" />
                </button>
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">{layer.nombre}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded-md font-medium inline-flex items-center gap-1.5">
                      <Waves className="w-3 h-3" />
                      {layer.tipo}
                    </span>
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-md font-medium">
                      Energía: {layer.energia || 5}/10
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
