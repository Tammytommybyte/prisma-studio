import { createClient } from '@/utils/supabase/server'
import { KanbanBoard } from '@/components/pipeline/kanban-board'
import Link from 'next/link'
import { LayoutDashboard, ArrowLeft } from 'lucide-react'

export default async function PipelinePage() {
  const supabase = await createClient()

  // Fetch all episodes with basic info
  const { data: episodes } = await supabase
    .from('episodes')
    .select('*, segments(id)')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-black text-white p-8 lg:p-12">
      <div className="max-w-[1600px] mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Link href="/episodes" className="text-zinc-500 hover:text-white flex items-center gap-2 text-sm transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Volver a Episodios
            </Link>
            <h1 className="text-5xl font-black tracking-tighter uppercase flex items-center gap-4">
              <LayoutDashboard className="w-10 h-10 text-indigo-500" />
              Pipeline <span className="text-zinc-800 text-3xl">Prisma Studio</span>
            </h1>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center gap-6">
            <div className="text-center">
              <span className="block text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Activos</span>
              <span className="text-2xl font-black text-indigo-400">{episodes?.filter(e => e.estado !== 'PUBLICADO').length || 0}</span>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="text-center">
              <span className="block text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Publicados</span>
              <span className="text-2xl font-black text-emerald-400">{episodes?.filter(e => e.estado === 'PUBLICADO').length || 0}</span>
            </div>
          </div>
        </div>

        <KanbanBoard initialEpisodes={episodes || []} />
      </div>
    </div>
  )
}
