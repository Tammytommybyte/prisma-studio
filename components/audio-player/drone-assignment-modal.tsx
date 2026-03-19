'use client'

import { useState } from 'react'
import { assignDrone, assignPad, removePad } from '@/app/episodes/[id]/actions'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input'
import { Waves, PlayCircle, Settings2, ShieldAlert, Zap, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SoundAssignmentModal({ 
  episodeId, 
  segment, 
  layers,
  assets
}: { 
  episodeId: string, 
  segment: any, 
  layers: any[],
  assets: any[]
}) {
  const [open, setOpen] = useState(false)
  const ambientUsage = segment.ambient_usages?.[0]
  const padUsages = segment.sound_usages || []
  
  // Ambient State
  const [selectedLayer, setSelectedLayer] = useState<string | null>(ambientUsage?.ambient_layer_id || null)
  const [volume, setVolume] = useState(ambientUsage?.volumen || 15)
  const [loop, setLoop] = useState(ambientUsage?.loop ?? true)
  
  // Pad State
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [padLabel, setPadLabel] = useState('')
  
  const [errorStatus, setErrorStatus] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveAmbient = async () => {
    if (!selectedLayer) return
    setIsSaving(true)
    const res = await assignDrone(episodeId, segment.id, selectedLayer, volume, loop, '')
    if (res?.error) setErrorStatus(res.error)
    else setOpen(false)
    setIsSaving(false)
  }

  const handleAddPad = async () => {
    if (!selectedAsset) return
    setIsSaving(true)
    const res = await assignPad(episodeId, segment.id, selectedAsset, 80, padLabel || 'FX')
    if (res?.error) setErrorStatus(res.error)
    else {
      setSelectedAsset(null)
      setPadLabel('')
    }
    setIsSaving(false)
  }

  const handleRemovePad = async (usageId: string) => {
    await removePad(episodeId, usageId)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="flex items-center gap-2 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 rounded-xl px-4 py-2 transition-all cursor-pointer">
          <Settings2 className="w-4 h-4" />
          <span>Configurar Sonido</span>
          {(ambientUsage || padUsages.length > 0) && (
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse ml-1" />
          )}
        </div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-900 text-zinc-100 shadow-3xl rounded-3xl">
        <Tabs defaultValue="ambient" className="w-full">
          <DialogHeader className="mb-4">
            <div className="flex items-center justify-between pr-8">
              <DialogTitle className="text-xl font-black uppercase tracking-tight">Diseño Sonoro</DialogTitle>
              <TabsList className="bg-zinc-900 border-zinc-800">
                <TabsTrigger value="ambient" className="data-[state=active]:bg-indigo-600">Ambient</TabsTrigger>
                <TabsTrigger value="pads" className="data-[state=active]:bg-rose-600">Pads</TabsTrigger>
              </TabsList>
            </div>
          </DialogHeader>

          <TabsContent value="ambient" className="space-y-6 animate-in fade-in duration-300 mt-0">
            <ScrollArea className="h-64 rounded-2xl border border-zinc-900 bg-zinc-950/50 p-2">
              <div className="space-y-1">
                {layers.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setSelectedLayer(layer.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all",
                      selectedLayer === layer.id 
                        ? "bg-indigo-600/20 text-indigo-400 border border-indigo-600/30" 
                        : "hover:bg-zinc-900 text-zinc-500 border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Waves className={cn("w-4 h-4", selectedLayer === layer.id ? "text-indigo-400" : "text-zinc-600")} />
                      <div>
                        <span className="block font-bold text-sm">{layer.nombre}</span>
                        <span className="block text-[10px] uppercase tracking-widest opacity-60 font-medium">{layer.emocion}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
            
            <div className="bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800/50 space-y-4">
               <div className="flex justify-between items-center text-sm font-bold text-zinc-400 uppercase tracking-widest">
                 <span>Volumen Mezcla</span>
                 <span className="text-indigo-400 font-mono">{volume}%</span>
               </div>
               <Slider value={[volume]} max={25} min={10} step={1} onValueChange={(v) => setVolume((v as number[])[0])} className="[&_[role=slider]]:bg-indigo-500" />
               <div className="flex items-center justify-between">
                 <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Loop Continuo</span>
                 <Switch checked={loop} onCheckedChange={setLoop} className="data-[state=checked]:bg-indigo-500" />
               </div>
            </div>

            <Button onClick={handleSaveAmbient} className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 text-lg font-black uppercase rounded-2xl" disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Fijar Ambiente'}
            </Button>
          </TabsContent>

          <TabsContent value="pads" className="space-y-6 animate-in fade-in duration-300 mt-0">
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pads Activos</h4>
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {padUsages.map((usage: any) => (
                  <div key={usage.id} className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-full group">
                    <Zap className="w-3 h-3 text-rose-500" />
                    <span className="text-xs font-bold text-rose-200">{usage.trigger_label}</span>
                    <button onClick={() => handleRemovePad(usage.id)} className="text-rose-500/40 hover:text-rose-500 transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {padUsages.length === 0 && <p className="text-xs text-zinc-600 italic py-2">No hay efectos disparables asignados.</p>}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Añadir Efecto (SFX)</h4>
              <ScrollArea className="h-44 rounded-2xl border border-zinc-900 bg-zinc-950/50 p-2">
                <div className="space-y-1">
                  {assets.map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => {
                        setSelectedAsset(asset.id)
                        setPadLabel(asset.nombre.split(' ')[0])
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 rounded-xl flex items-center justify-between transition-all",
                        selectedAsset === asset.id 
                          ? "bg-rose-600/20 text-rose-400 border border-rose-600/30" 
                          : "hover:bg-zinc-900 text-zinc-500 border border-transparent"
                      )}
                    >
                      <span className="text-sm font-medium">{asset.nombre}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="flex gap-2">
                <Input value={padLabel} onChange={(e) => setPadLabel(e.target.value)} placeholder="Etiqueta del Pad (ej. Glitch)" className="bg-zinc-900 border-zinc-800" />
                <Button onClick={handleAddPad} disabled={!selectedAsset || isSaving} className="bg-rose-600 hover:bg-rose-500 shrink-0">
                  Añadir 
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
