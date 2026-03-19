'use client'

import { useState } from 'react'
import { KanbanColumn } from './kanban-column'
import { updateEpisodeStatus } from '@/app/episodes/[id]/actions'

const COLUMNS = [
  { id: 'IDEACION', title: 'Ideación', color: 'zinc' },
  { id: 'ESTRUCTURA', title: 'Estructura', color: 'indigo' },
  { id: 'GRABACION', title: 'Cabina / Grabación', color: 'rose' },
  { id: 'PUBLICADO', title: 'Publicado', color: 'emerald' },
]

export function KanbanBoard({ initialEpisodes }: { initialEpisodes: any[] }) {
  const [episodes, setEpisodes] = useState(initialEpisodes)

  const onMoveEpisode = async (episodeId: string, newStatus: string) => {
    // Optimistic update
    setEpisodes(prev => prev.map(e => 
      e.id === episodeId ? { ...e, estado: newStatus } : e
    ))
    
    await updateEpisodeStatus(episodeId, newStatus)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[70vh] items-start">
      {COLUMNS.map((col) => (
        <KanbanColumn 
          key={col.id}
          id={col.id}
          title={col.title}
          color={col.color}
          episodes={episodes.filter(e => e.estado === col.id || (col.id === 'IDEACION' && (!e.estado || e.estado === 'draft')))}
          onMove={onMoveEpisode}
        />
      ))}
    </div>
  )
}
