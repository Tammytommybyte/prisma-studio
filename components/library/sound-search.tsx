'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const MOODS = [
  { label: 'Oscuro', emoji: '🖤', value: 'oscuro' },
  { label: 'Neutro', emoji: '🌫️', value: 'neutro' },
  { label: 'Luminoso', emoji: '✨', value: 'luminoso' },
  { label: 'Tenso', emoji: '⚡', value: 'tenso' },
  { label: 'Vulnerable', emoji: '🫀', value: 'vulnerable' },
]

const CATEGORIES = ['IMPACTOS', 'TRANSICIONES', 'ATMOSFERAS', 'MECÁNICOS', 'RELIGIOSO']

export function SoundSearch({ onSearch }: { onSearch: (filters: any) => void }) {
  const [query, setQuery] = useState('')
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [energy, setEnergy] = useState([5])
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = () => {
    onSearch({
      query,
      mood: selectedMood,
      category: selectedCategory,
      energy: energy[0]
    })
  }

  const clearFilters = () => {
    setQuery('')
    setSelectedMood(null)
    setSelectedCategory(null)
    setEnergy([5])
    onSearch({})
  }

  return (
    <div className="space-y-4 mb-8 bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800 shadow-xl backdrop-blur-sm">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input 
            placeholder="Buscar por nombre o etiquetas..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-200 focus-visible:ring-indigo-500 rounded-xl py-6"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
             "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white rounded-xl px-6 h-auto py-3 transition-all",
             showFilters && "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
          )}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
        <Button 
          onClick={handleSearch}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-8 shadow-lg shadow-indigo-900/20"
        >
          Explorar
        </Button>
      </div>

      {showFilters && (
        <div className="pt-4 border-t border-zinc-800/50 grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-top-2 duration-300">
          {/* Moods */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Mood Emocional</h4>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(selectedMood === mood.value ? null : mood.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm border transition-all flex items-center gap-2",
                    selectedMood === mood.value 
                      ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-200" 
                      : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600"
                  )}
                >
                  <span>{mood.emoji}</span>
                  {mood.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Carpeta Sónica</h4>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Badge
                  key={cat}
                  variant="outline"
                  onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                  className={cn(
                    "cursor-pointer px-3 py-1 font-mono text-[10px] transition-all",
                    selectedCategory === cat 
                      ? "bg-emerald-500 text-emerald-950 border-emerald-500" 
                      : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          {/* Energy */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-500" /> Nivel de Energía
              </h4>
              <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">{energy[0]}</span>
            </div>
            <Slider 
              value={energy} 
              onValueChange={(value) => setEnergy(value as number[])} 
              max={10} 
              min={1} 
              step={1} 
              className="py-4"
            />
            <div className="flex justify-between text-[10px] text-zinc-600 font-medium">
              <span>SUTIL</span>
              <span>AGRESIVO</span>
            </div>
          </div>

          <div className="md:col-span-3 flex justify-end gap-3 pt-4 border-t border-zinc-800/30">
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-zinc-500 hover:text-zinc-300">
              <X className="w-3 h-3 mr-2" /> Limpiar Filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
