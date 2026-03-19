'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Upload, Loader2, Music2 } from 'lucide-react'
import { uploadAudio } from '@/lib/storage-utils'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const MOODS = [
  { label: 'Oscuro', emoji: '🖤', value: 'oscuro' },
  { label: 'Neutro', emoji: '🌫️', value: 'neutro' },
  { label: 'Luminoso', emoji: '✨', value: 'luminoso' },
  { label: 'Tenso', emoji: '⚡', value: 'tenso' },
  { label: 'Vulnerable', emoji: '🫀', value: 'vulnerable' },
]

const CATEGORIES = ['IMPACTOS', 'TRANSICIONES', 'ATMOSFERAS', 'MECÁNICOS', 'RELIGIOSO']

export function UploadDialog() {
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState('IMPACTOS')
  const [mood, setMood] = useState('neutro')
  const [energia, setEnergia] = useState(5)
  const router = useRouter()

  const handleUpload = async () => {
    if (!file || !nombre) return
    setUploading(true)
    
    try {
      // 1. Subir a Storage
      const bucket = categoria === 'RELIGIOSO' ? 'sound-assets' : 'sound-assets' // Simplificado por ahora
      const publicUrl = await uploadAudio(file, bucket)
      
      if (!publicUrl) throw new Error('Failed to upload file')

      // 2. Guardar en Base de Datos
      const supabase = createClient()
      const { error } = await supabase
        .from('sound_assets')
        .insert({
          nombre,
          categoria,
          archivo_url: publicUrl,
          emocion: mood,
          energia,
          favorito: false
        })

      if (error) throw error

      setOpen(false)
      router.refresh()
      // Reset form
      setFile(null)
      setNombre('')
    } catch (err) {
      console.error('Error in upload process:', err)
      alert('Error al subir el sonido. Revisa la consola.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-rose-600 hover:bg-rose-500 rounded-xl px-6 font-bold shadow-lg shadow-rose-900/20">
          <Upload className="w-4 h-4 mr-2" /> Subir Sonido
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-900 text-white max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <Music2 className="text-rose-500 w-5 h-5" /> Nueva Pieza Sónica
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase">Archivo de Audio</Label>
            <Input 
              type="file" 
              accept="audio/*" 
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) {
                  setFile(f)
                  setNombre(f.name.split('.')[0])
                }
              }}
              className="bg-zinc-900 border-zinc-800 file:text-rose-400 file:font-bold file:mr-4"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-zinc-500 uppercase">Nombre del Asset</Label>
            <Input 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Impacto Metálico Reverberado"
              className="bg-zinc-900 border-zinc-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase">Categoría</Label>
              <Select value={categoria} onValueChange={(val) => setCategoria(val as string)}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-900 text-white">
                  {CATEGORIES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase">Mood</Label>
              <Select value={mood} onValueChange={(val) => setMood(val as string)}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-900 text-white">
                  {MOODS.map(m => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.emoji} {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase">Energía ({energia})</Label>
              <span className="text-[10px] text-zinc-600 font-mono">1-10</span>
            </div>
            <Slider 
              value={[energia]} 
              onValueChange={(val) => setEnergia(Array.isArray(val) ? val[0] : val)} 
              max={10} 
              min={1} 
              step={1}
              className="[&_[role=slider]]:bg-rose-500"
            />
          </div>

          <Button 
            onClick={handleUpload} 
            disabled={!file || !nombre || uploading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 text-lg font-black uppercase rounded-2xl shadow-xl shadow-indigo-900/20 group"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>Procesar Asset <Upload className="ml-2 w-5 h-5 transition-transform group-hover:-translate-y-1" /></>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
