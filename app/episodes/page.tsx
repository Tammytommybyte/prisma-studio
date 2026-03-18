import { createClient } from '@/utils/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Mic2, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function EpisodesPage() {
  const supabase = await createClient()
  
  const { data: episodes } = await supabase
    .from('episodes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Episodios</h2>
          <p className="text-zinc-400">Gestiona y planifica el contenido de tu producción.</p>
        </div>
        <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.2)] transition-all">
          <Link href="/episodes/new">
            <Plus className="w-5 h-5 mr-2" />
            Crear Episodio
          </Link>
        </Button>
      </div>

      {!episodes || episodes.length === 0 ? (
        <div className="border border-dashed border-zinc-800 rounded-2xl p-12 text-center bg-zinc-900/30 w-full flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
            <Mic2 className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-xl font-bold text-zinc-200 mb-2">Aún no hay episodios</h3>
          <p className="text-zinc-400 max-w-sm mx-auto mb-6">Empieza estructurando la idea de tu primer episodio. Recuerda que no importa si no es perfecto.</p>
          <Button asChild variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl">
            <Link href="/episodes/new">
              Crear Nuevo Episodio
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {episodes.map((ep) => (
            <Link key={ep.id} href={`/episodes/${ep.id}`}>
              <Card className="border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/60 hover:border-indigo-500/50 transition-all cursor-pointer group h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-zinc-800 group-hover:bg-indigo-500 transition-colors"></div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-zinc-800 text-zinc-300 text-xs px-2.5 py-1 rounded-md mb-2 inline-flex font-medium">
                        Ep {ep.number || '?'}
                      </span>
                      {ep.estado === 'draft' && (
                        <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs px-2.5 py-1 rounded-md mb-2 inline-flex font-medium">Borrador</span>
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors mb-2 line-clamp-2">
                    {ep.title}
                  </h3>
                  <p className="text-sm text-zinc-500 line-clamp-2 mb-4 flex-1">
                    {ep.premise || 'Sin premisa redactada.'}
                  </p>
                  
                  <div className="pt-4 mt-auto border-t border-zinc-800/50 flex items-center justify-between text-xs text-zinc-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(ep.created_at).toLocaleDateString()}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
