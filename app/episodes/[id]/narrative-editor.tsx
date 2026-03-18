'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, GripVertical, Waves } from 'lucide-react'
import { addSegment } from './actions'
import { DroneAssignmentModal } from '@/components/audio-player/drone-assignment-modal'
import Link from 'next/link'

// Simple type def for UI
type Segment = any;

export function NarrativeEditor({ episode, initialSegments, layers }: { episode: any, initialSegments: Segment[], layers: any[] }) {
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
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              Modo Estructura
            </span>
            <Button asChild variant="outline" className="border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-300 transition-colors">
              <Link href={`/episodes/${episode.id}/cabina`}>
                Pasar a Cabina
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {initialSegments.length === 0 ? (
          <div className="p-12 border border-dashed border-zinc-800 bg-zinc-900/30 rounded-2xl text-center">
            <p className="text-zinc-400 mb-2">Este episodio es solo una idea en el papel.</p>
            <p className="text-sm text-zinc-500">Agrega bloques narrativos para estructurarlo antes de grabar.</p>
          </div>
        ) : (
          initialSegments.map((seg, idx) => (
            <Card key={seg.id} className="border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 transition-all backdrop-blur-sm group">
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="hidden sm:flex cursor-grab text-zinc-600 hover:text-zinc-400 py-4">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                <div className="w-12 h-12 shrink-0 bg-zinc-950 rounded-lg border border-zinc-800 flex flex-col items-center justify-center font-mono text-zinc-400 shadow-inner">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">Blq</span>
                  <span className="text-lg font-black text-zinc-200">{idx + 1}</span>
                </div>

                <div className="flex-1 w-full">
                  <h3 className="text-xl font-bold text-zinc-100">{seg.nombre}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 mt-1.5">
                    <span className="bg-zinc-800/80 px-2 py-0.5 rounded text-zinc-300 font-medium">{seg.tipo || 'Desarrollo'}</span>
                    <span>&bull;</span>
                    <span className="text-zinc-400 italic">"{seg.intencion_emocional || 'Neutro'}"</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 mt-2 sm:mt-0 w-full sm:w-auto justify-end border-t border-zinc-800/50 sm:border-0 pt-3 sm:pt-0">
                  <DroneAssignmentModal episodeId={episode.id} segment={seg} layers={layers} />
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {isAdding ? (
          <Card className="border-indigo-500/30 bg-indigo-500/5 shadow-[0_0_30px_rgba(79,70,229,0.05)] pt-6 mt-8">
            <form action={handleAddSegment}>
              <CardHeader className="py-0 px-6 mb-4">
                <CardTitle className="text-lg text-indigo-300 tracking-tight">Estructurar Nuevo Bloque</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-zinc-300 font-medium">Nombre del bloque</Label>
                    <Input id="nombre" name="nombre" placeholder="Ej. Intro, Entrevista profunda..." required className="bg-zinc-950/80 border-zinc-700/80 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo" className="text-zinc-300 font-medium">Tipo de Narrativa</Label>
                    <Input id="tipo" name="tipo" placeholder="Ej. Apertura emocional, Cierre..." className="bg-zinc-950/80 border-zinc-700/80 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="intencion_emocional" className="text-zinc-300 font-medium">Intención Emocional</Label>
                  <Input id="intencion_emocional" name="intencion_emocional" placeholder="Ej. Generar empatía inmediata, Dar respiro al oyente..." className="bg-zinc-950/80 border-zinc-700/80 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500" />
                </div>
              </CardContent>
              <div className="flex gap-3 justify-end px-6 pb-6 pt-0">
                <Button type="button" variant="ghost" className="text-zinc-400 hover:text-white" onClick={() => setIsAdding(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
                  Guardar Bloque
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <Button onClick={() => setIsAdding(true)} variant="outline" className="w-full mt-4 border-dashed border-zinc-700 bg-zinc-950/50 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 py-8 rounded-xl transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
            <Plus className="w-5 h-5 mr-3" />
            <span className="text-lg">Diseñar Siguiente Bloque Narrativo</span>
          </Button>
        )}
      </div>
    </div>
  )
}
