'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings2, Mic2, Rocket, ArrowRightLeft, Clock, Layers } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export function KanbanColumn({ id, title, color, episodes, onMove }: { 
  id: string, 
  title: string, 
  color: string, 
  episodes: any[],
  onMove: (id: string, next: string) => void
}) {
  const NEXT_STATUS: Record<string, string> = {
    'IDEACION': 'ESTRUCTURA',
    'ESTRUCTURA': 'GRABACION',
    'GRABACION': 'PUBLICADO',
    'PUBLICADO': 'ESTRUCTURA' // Loop de vuelta opcional
  }

  const colorVariants: Record<string, any> = {
    zinc: "bg-zinc-500",
    indigo: "bg-indigo-500",
    rose: "bg-rose-500",
    emerald: "bg-emerald-500"
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-900/50">
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", colorVariants[color])} />
          <h2 className="font-black uppercase text-xs tracking-[0.2em] text-zinc-500">{title}</h2>
        </div>
        <span className="text-[10px] font-mono bg-zinc-900 text-zinc-600 px-2 py-0.5 rounded-full border border-zinc-800">
          {episodes.length}
        </span>
      </div>

      <div className="space-y-4 min-h-[200px]">
        <AnimatePresence>
          {episodes.map((ep) => (
            <motion.div
              key={ep.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="bg-zinc-950/50 border-zinc-900 group hover:border-zinc-800 transition-all rounded-3xl overflow-hidden shadow-lg shadow-black/50">
                <CardContent className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-zinc-100 text-lg leading-tight group-hover:text-indigo-400 transition-colors">
                      {ep.title}
                    </h3>
                    <p className="text-xs text-zinc-600 line-clamp-2 mt-1 italic">
                      {ep.premise || 'Sin premisa técnica definida.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/50 p-2 rounded-xl border border-zinc-900 flex items-center gap-2">
                      <Layers className="w-3 h-3 text-zinc-600" />
                      <span className="text-[10px] font-bold text-zinc-400">{ep.segments?.length || 0} Blq</span>
                    </div>
                    <div className="bg-black/50 p-2 rounded-xl border border-zinc-900 flex items-center gap-2">
                      <Clock className="w-3 h-3 text-zinc-600" />
                      <span className="text-[10px] font-bold text-zinc-400">{Math.floor((ep.duracion_estimada || 0) / 60)}m</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-1">
                      <Button asChild size="xs" variant="ghost" className="h-8 rounded-lg hover:bg-zinc-900">
                        <Link href={`/episodes/${ep.id}`}>
                          <Settings2 className="w-3 h-3 mr-1" /> Editar
                        </Link>
                      </Button>
                      <Button asChild size="xs" variant="ghost" className="h-8 rounded-lg hover:bg-zinc-900">
                        <Link href={`/episodes/${ep.id}/cabina`}>
                          <Mic2 className="w-3 h-3 mr-1" /> Cabina
                        </Link>
                      </Button>
                    </div>
                    
                    {NEXT_STATUS[id] && (
                      <Button 
                        size="xs" 
                        onClick={() => onMove(ep.id, NEXT_STATUS[id])}
                        className={cn(
                          "h-8 w-8 rounded-xl shrink-0 transition-all",
                          id === 'IDEACION' ? "bg-indigo-600 hover:bg-indigo-500" :
                          id === 'ESTRUCTURA' ? "bg-rose-600 hover:bg-rose-500" :
                          id === 'GRABACION' ? "bg-emerald-600 hover:bg-emerald-500" :
                          "bg-zinc-800 hover:bg-zinc-700"
                        )}
                      >
                        <ArrowRightLeft className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {episodes.length === 0 && (
          <div className="border-2 border-dashed border-zinc-950 rounded-3xl py-12 flex flex-col items-center justify-center opacity-20">
             <div className="w-12 h-12 rounded-full border border-zinc-900" />
          </div>
        )}
      </div>
    </div>
  )
}
