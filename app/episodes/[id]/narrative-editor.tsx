'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, GripVertical, Waves, Zap } from 'lucide-react'
import { addSegment } from './actions'
import { SoundAssignmentModal } from '@/components/audio-player/drone-assignment-modal'
import Link from 'next/link'

// Simple type def for UI
type Segment = any;

export function NarrativeEditor({ episode, initialSegments, layers, assets }: { episode: any, initialSegments: Segment[], layers: any[], assets: any[] }) {
  const [isAdding, setIsAdding] = useState(false)

  const addAction = addSegment.bind(null, episode.id)
  
  async function handleAddSegment(formData: FormData) {
    setIsAdding(false)
    await addAction(formData)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/episodes" className="text-zinc-400 hover:text-white mb-4 inline-block text-sm">
          &larr; Volver
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">{episode.title}</h1>
            <p className="text-zinc-400 mt-2 max-w-2xl text-lg">{episode.premise}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(79,70,229,0.1)]">
              Editor Pro ++
            </span>
            <Link href={`/episodes/${episode.id}/cabina`} className="bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/20 rounded-xl px-6 py-2 text-sm font-bold transition-all transition-transform active:scale-95">
              Pasar a Cabina
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {initialSegments.length === 0 ? (
          <div className="p-12 border border-dashed border-zinc-800 bg-zinc-900/30 rounded-3xl text-center">
            <p className="text-zinc-400 mb-2 font-bold">Este episodio es solo una idea en el papel.</p>
            <p className="text-sm text-zinc-600 font-medium">Agrega bloques narrativos para estructurarlo antes de grabar.</p>
          </div>
        ) : (
          initialSegments.map((seg, idx) => (
            <Card key={seg.id} className="border-zinc-900 bg-zinc-950/40 hover:bg-zinc-900/50 transition-all backdrop-blur-md group overflow-hidden rounded-3xl">
              <CardContent className="p-0 flex flex-col sm:flex-row items-center">
                <div className="hidden sm:flex cursor-grab text-zinc-700 hover:text-zinc-500 px-4 items-center h-full self-stretch border-r border-zinc-900/50 group-hover:bg-zinc-900/20 transition-colors">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                <div className="p-6 flex flex-1 gap-6 items-center">
                  <div className="w-12 h-12 shrink-0 bg-zinc-950 rounded-2xl border border-zinc-900 flex flex-col items-center justify-center font-mono text-zinc-450 shadow-inner">
                    <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold">Blq</span>
                    <span className="text-xl font-black text-white">{idx + 1}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-zinc-100 truncate">{seg.nombre}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs mt-2">
                       <span className="bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg text-zinc-400 font-bold uppercase tracking-wider">{seg.tipo || 'Desarrollo'}</span>
                       {seg.ambient_usages?.[0] && (
                         <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
                            <Waves className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[120px]">{seg.ambient_usages[0].ambient_layers?.nombre}</span>
                         </div>
                       )}
                       {seg.sound_usages?.length > 0 && (
                         <div className="flex items-center gap-1 text-rose-400 font-bold">
                            <Zap className="w-3.5 h-3.5" />
                            <span>{seg.sound_usages.length} Pads</span>
                         </div>
                       )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-4">
                    <SoundAssignmentModal 
                      episodeId={episode.id} 
                      segment={seg} 
                      layers={layers} 
                      assets={assets} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {isAdding ? (
          <Card className="border-indigo-500/30 bg-indigo-500/5 shadow-[0_0_30px_rgba(79,70,229,0.05)] pt-6 mt-8 rounded-3xl overflow-hidden">
            <form action={handleAddSegment}>
              <CardHeader className="py-0 px-6 mb-4">
                <CardTitle className="text-lg text-indigo-300 tracking-tight font-black uppercase">Estructurar Nuevo Bloque</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Nombre del bloque</Label>
                    <Input id="nombre" name="nombre" placeholder="Ej. Intro, Entrevista profunda..." required className="bg-zinc-950 border-zinc-900 text-white placeholder:text-zinc-800 focus-visible:ring-indigo-500 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo" className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Tipo de Narrativa</Label>
                    <Input id="tipo" name="tipo" placeholder="Ej. Apertura emocional, Cierre..." className="bg-zinc-950 border-zinc-900 text-white placeholder:text-zinc-800 focus-visible:ring-indigo-500 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="intencion_emocional" className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Intención Emocional</Label>
                  <Input id="intencion_emocional" name="intencion_emocional" placeholder="Ej. Generar empatía inmediata, Dar respiro al oyente..." className="bg-zinc-950 border-zinc-900 text-white placeholder:text-zinc-800 focus-visible:ring-indigo-500 rounded-xl" />
                </div>
              </CardContent>
              <div className="flex gap-3 justify-end px-6 pb-6 pt-0">
                <Button type="button" variant="ghost" className="text-zinc-500 hover:text-white" onClick={() => setIsAdding(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 rounded-xl font-bold">
                  Guardar Bloque
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <Button onClick={() => setIsAdding(true)} variant="outline" className="w-full mt-4 border-dashed border-zinc-800 bg-zinc-950/20 hover:bg-zinc-950 text-zinc-500 hover:text-zinc-300 py-10 rounded-3xl transition-all shadow-inner group">
            <Plus className="w-6 h-6 mr-3 group-hover:scale-125 transition-transform text-indigo-500" />
            <span className="text-lg font-bold tracking-tight">Diseñar Siguiente Bloque Narrativo</span>
          </Button>
        )}
      </div>
    </div>
  )
}
