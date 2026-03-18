'use client'

import { useState } from 'react'
import { assignDrone } from '@/app/episodes/[id]/actions'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Waves, PlayCircle, Settings2, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DroneAssignmentModal({ 
  episodeId, 
  segment, 
  layers 
}: { 
  episodeId: string, 
  segment: any, 
  layers: any[] 
}) {
  const [open, setOpen] = useState(false)
  const currentUsage = segment.ambient_usages?.[0]
  
  const [selectedLayer, setSelectedLayer] = useState<string | null>(currentUsage?.ambient_layer_id || null)
  const [volume, setVolume] = useState(currentUsage?.volumen || 15)
  const [loop, setLoop] = useState(currentUsage?.loop ?? true)
  const [mood, setMood] = useState(currentUsage?.notes || '')
  
  const [errorStatus, setErrorStatus] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!selectedLayer) return
    setIsSaving(true)
    setErrorStatus(null)

    const res = await assignDrone(episodeId, segment.id, selectedLayer, volume, loop, mood)
    
    if (res?.error) {
      setErrorStatus(res.error)
    } else {
      setOpen(false)
    }
    setIsSaving(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {currentUsage ? (
          <Button variant="outline" className="flex items-center gap-2 bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-4 py-2 hover:bg-indigo-500/20 hover:text-indigo-300 rounded-lg text-sm font-semibold shadow-[0_0_10px_rgba(79,70,229,0.1)] transition-all">
            <Waves className="w-4 h-4" />
            <span>Editar Sonido</span>
          </Button>
        ) : (
          <Button variant="outline" className="text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10 border-zinc-800/50 hover:border-indigo-500/30 transition-all shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
            <Waves className="w-4 h-4 mr-2" />
            Asignar Pad / Drone
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-zinc-100 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Waves className="w-5 h-5 text-indigo-400" />
            Motor de Drones
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Escoge un drone para este segmento y ajusta el ambiente sonoro.
          </DialogDescription>
        </DialogHeader>

        {errorStatus && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg flex items-start gap-3 mt-2 text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <p>{errorStatus}</p>
          </div>
        )}

        <div className="mt-4 space-y-6">
          {/* Sounds Selection */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">Biblioteca Disponible</h4>
            <ScrollArea className="h-40 rounded-md border border-zinc-800 bg-zinc-900/30 shadow-inner">
              <div className="p-2 space-y-2">
                {layers.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setSelectedLayer(layer.id)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-md flex items-center justify-between transition-all",
                      selectedLayer === layer.id 
                        ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-200 border shadow-[inset_0_1px_rgba(255,255,255,0.05)]" 
                        : "hover:bg-zinc-800/80 text-zinc-400 border border-transparent"
                    )}
                  >
                    <div>
                      <span className="block font-medium text-sm">{layer.nombre}</span>
                      <span className="block text-[10px] opacity-70 mt-0.5">{layer.emocion || layer.tipo}</span>
                    </div>
                    {selectedLayer === layer.id && (
                      <PlayCircle className="w-4 h-4 text-indigo-400" />
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Controls */}
          {selectedLayer && (
            <div className="space-y-5 border-t border-zinc-800/60 pt-5">
              <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Settings2 className="w-4 h-4" /> Controles
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400 font-medium">Mezcla (Volumen)</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 font-mono text-zinc-300">{volume}%</span>
                </div>
                <Slider
                  defaultValue={[volume]}
                  max={25}
                  min={10}
                  step={1}
                  onValueChange={(vals) => setVolume((vals as number[])[0])}
                  className="[&_[role=slider]]:bg-indigo-400 [&_[role=slider]]:border-indigo-400"
                />
                <p className="text-[10px] text-zinc-500 leading-tight">
                  Regla de oro: El volumen del pad no puede tapar la voz original (10% a 25% max).
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-zinc-300">Reproducción Cíclica (Loop)</label>
                  <p className="text-[10px] text-zinc-500">Mantener el drone activo durante todo el segmento.</p>
                </div>
                <Switch 
                  checked={loop} 
                  onCheckedChange={setLoop}
                  className="data-[state=checked]:bg-indigo-500" 
                />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2 gap-3">
            <Button variant="ghost" onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white">
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!selectedLayer || isSaving}
              className="bg-indigo-600 hover:bg-indigo-500 text-white w-full sm:w-auto"
            >
              {isSaving ? 'Guardando...' : 'Aplicar Reglas y Guardar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
