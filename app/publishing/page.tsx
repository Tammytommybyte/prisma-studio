import { createClient } from '@/utils/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Kanban, Sparkles, Mic2, Rocket } from 'lucide-react'

// Simple Kanban view for episodes
export default async function PublishingPage() {
  const supabase = await createClient()

  const { data: episodes } = await supabase
    .from('episodes')
    .select('*')
    .order('created_at', { ascending: false })

  const drafts = episodes?.filter(e => e.estado === 'draft') || []
  const recorded = episodes?.filter(e => e.estado === 'grabado') || []
  const published = episodes?.filter(e => e.estado === 'publicado') || []

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-700 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_20px_rgba(79,70,229,0.15)]">
          <Kanban className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Pipeline de Publicación</h2>
          <p className="text-zinc-400 mt-1">Panel editorial para organizar el ciclo de vida de tu producción.</p>
        </div>
      </div>

      <div className="flex-1 grid md:grid-cols-3 gap-6 overflow-x-auto pb-4">
        
        {/* Column 1: Planificación / Draft */}
        <div className="flex flex-col bg-zinc-900/20 rounded-2xl border border-zinc-800/50 p-5 min-w-[300px] shadow-inner">
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="font-bold text-zinc-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Planificación
            </h3>
            <span className="bg-zinc-800 text-zinc-400 text-xs px-2.5 py-1 rounded-md font-mono font-bold shadow-sm">{drafts.length}</span>
          </div>
          <div className="flex-1 space-y-3">
            {drafts.map(ep => (
              <Card key={ep.id} className="bg-zinc-900 border-zinc-700 hover:border-amber-500/50 hover:bg-zinc-800 transition-colors cursor-pointer group">
                <CardContent className="p-4">
                  <span className="text-[10px] font-mono font-bold text-zinc-500 mb-2 block uppercase tracking-widest group-hover:text-amber-500/80 transition-colors">EP {ep.number || '?'}</span>
                  <p className="font-bold text-sm text-zinc-200 leading-snug">{ep.title}</p>
                </CardContent>
              </Card>
            ))}
            {drafts.length === 0 && (
               <p className="text-zinc-600 text-sm text-center py-4 italic">No tienes episodios en idea.</p>
            )}
          </div>
        </div>

        {/* Column 2: Listo para Post / Grabado */}
        <div className="flex flex-col bg-zinc-900/20 rounded-2xl border border-zinc-800/50 p-5 min-w-[300px] shadow-inner">
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="font-bold text-zinc-300 flex items-center gap-2">
              <Mic2 className="w-4 h-4 text-emerald-500" /> Para Edición
            </h3>
            <span className="bg-zinc-800 text-zinc-400 text-xs px-2.5 py-1 rounded-md font-mono font-bold shadow-sm">{recorded.length}</span>
          </div>
          <div className="flex-1 space-y-3">
            {recorded.map(ep => (
              <Card key={ep.id} className="bg-zinc-900 border-zinc-700 hover:border-emerald-500/50 hover:bg-zinc-800 transition-colors cursor-pointer group">
                <CardContent className="p-4">
                  <span className="text-[10px] font-mono font-bold text-zinc-500 mb-2 block uppercase tracking-widest group-hover:text-emerald-500/80 transition-colors">EP {ep.number || '?'}</span>
                  <p className="font-bold text-sm text-zinc-200 leading-snug">{ep.title}</p>
                </CardContent>
              </Card>
            ))}
            {recorded.length === 0 && (
               <p className="text-zinc-600 text-sm text-center py-4 italic">No hay episodios grabados.</p>
            )}
          </div>
        </div>

        {/* Column 3: Publicado */}
        <div className="flex flex-col bg-zinc-900/20 rounded-2xl border border-zinc-800/50 p-5 min-w-[300px] shadow-inner">
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="font-bold text-zinc-300 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-indigo-400" /> Publicados
            </h3>
            <span className="bg-zinc-800 text-zinc-400 text-xs px-2.5 py-1 rounded-md font-mono font-bold shadow-sm">{published.length}</span>
          </div>
          <div className="flex-1 space-y-3">
             {published.map(ep => (
              <Card key={ep.id} className="bg-zinc-900 border-zinc-700 hover:border-indigo-500/50 hover:bg-zinc-800 transition-colors cursor-pointer group">
                <CardContent className="p-4">
                  <span className="text-[10px] font-mono font-bold text-zinc-500 mb-2 block uppercase tracking-widest group-hover:text-indigo-400/80 transition-colors">EP {ep.number || '?'}</span>
                  <p className="font-bold text-sm text-zinc-200 leading-snug">{ep.title}</p>
                </CardContent>
              </Card>
            ))}
            {published.length === 0 && (
               <p className="text-zinc-600 text-sm text-center py-4 italic">Aún no has publicado.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
