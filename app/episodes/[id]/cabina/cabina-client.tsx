'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Waves, Play, Square, Timer, Mic2, Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'
import { audioEngine } from '@/lib/audio-engine'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'

interface CabinaClientProps {
  episode: any
  segments: any[]
}

export function CabinaClient({ episode, segments }: CabinaClientProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [usePolish, setUsePolish] = useState(true)
  const [seconds, setSeconds] = useState(0)
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null)
  const [completedSegments, setCompletedSegments] = useState<Set<string>>(new Set())
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartStop = async () => {
    if (isRecording) {
      setIsRecording(false)
      audioEngine?.stopAll()
      const blob = await audioEngine?.stopRecording()
      if (blob) setRecordedBlob(blob)
      setActiveSegmentId(null)
    } else {
      const success = await audioEngine?.startRecording(usePolish)
      if (success) {
        setIsRecording(true)
        setSeconds(0)
        setRecordedBlob(null)
        if (!activeSegmentId && segments.length > 0) {
          activateSegment(segments[0])
        }
      }
    }
  }

  const downloadRecording = () => {
    if (!recordedBlob) return
    const url = URL.createObjectURL(recordedBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prisma-episode-${episode.id}-${Date.now()}.webm`
    a.click()
  }

  const activateSegment = (seg: any) => {
    if (!isRecording) return
    
    // Stop previous audio if any
    if (activeSegmentId) {
      const prevSeg = segments.find(s => s.id === activeSegmentId)
      if (prevSeg?.ambient_usages?.[0]?.ambient_layers?.id) {
        audioEngine?.stopLayer(prevSeg.ambient_usages[0].ambient_layers.id)
      }
    }

    setActiveSegmentId(seg.id)

    // Play new audio if exists
    const usage = seg.ambient_usages?.[0]
    if (usage?.ambient_layers?.archivo_url) {
      audioEngine?.playLayer(
        usage.ambient_layers.id,
        usage.ambient_layers.archivo_url,
        usage.volumen,
        usage.loop
      )
    }
  }

  const toggleComplete = (segId: string) => {
    setCompletedSegments((prev) => {
      const next = new Set(prev)
      if (next.has(segId)) {
        next.delete(segId)
      } else {
        next.add(segId)
      }
      return next
    })
  }

  const playPad = (usage: any) => {
    if (!isRecording || !usage?.sound_assets?.archivo_url) return
    audioEngine?.playOneShot(
      usage.sound_assets.id,
      usage.sound_assets.archivo_url,
      usage.volumen
    )
  }

  const activeSegment = segments.find(s => s.id === activeSegmentId)

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-rose-500/30">
      <header className="p-6 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-1">
              <span className={cn(
                "flex h-3 w-3 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.8)]",
                isRecording ? "bg-rose-500 animate-pulse" : "bg-zinc-700"
              )}></span>
              <h1 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{episode.title}</h1>
            </div>
            <p className="text-[10px] text-zinc-600 font-mono">MODO CABINA • SESIÓN EN VIVO</p>
          </div>

          <Button 
            onClick={handleStartStop}
            className={cn(
              "ml-4 rounded-full px-6 transition-all",
              isRecording 
                ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700" 
                : "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/20"
            )}
          >
            {isRecording ? (
              <><Square className="w-4 h-4 mr-2 fill-current" /> Terminar Grabación</>
            ) : (
              <><Mic2 className="w-4 h-4 mr-2" /> Iniciar Sesión</>
            )}
          </Button>

          {/* Prisma Voice Polish Toggle */}
          <div className="ml-6 flex items-center gap-3 bg-zinc-900/50 px-4 py-2 rounded-xl border border-zinc-800">
             <div className="flex flex-col">
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Prisma Voice</span>
                <span className="text-[10px] text-zinc-500">Auto-Polish</span>
             </div>
             <Switch 
                checked={usePolish} 
                onCheckedChange={setUsePolish} 
                disabled={isRecording}
                className="data-[state=checked]:bg-indigo-500"
             />
          </div>
          
          {/* PRISMA PADS (Soundboard) */}
          {isRecording && activeSegment?.sound_usages?.length > 0 && (
            <div className="ml-8 flex items-center gap-2 animate-in fade-in zoom-in duration-300">
               <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mr-2">Pads</span>
               {activeSegment.sound_usages.map((usage: any) => (
                 <Button
                   key={usage.id}
                   size="sm"
                   onClick={() => playPad(usage)}
                   className="bg-zinc-900 border border-zinc-800 hover:bg-indigo-600 hover:border-indigo-500 text-zinc-300 hover:text-white rounded-lg px-4 h-9 font-bold text-xs transition-all active:scale-95 shadow-lg"
                 >
                   <Zap className="w-3 h-3 mr-1.5 text-amber-500" />
                   {usage.trigger_label || 'FX'}
                 </Button>
               ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-8">
          {recordedBlob && !isRecording && (
            <Button 
              onClick={downloadRecording}
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-5 flex items-center gap-2 shadow-lg shadow-emerald-900/20 animate-in fade-in slide-in-from-right-2"
            >
              <Sparkles className="w-4 h-4" /> Exportar Episodio (.webm)
            </Button>
          )}

          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-end gap-1">
              <Timer className="w-3 h-3" /> Tiempo Total
            </p>
            <p className={cn(
              "text-3xl font-mono tracking-tighter transition-colors",
              isRecording ? "text-white" : "text-zinc-600"
            )}>{formatTime(seconds)}</p>
          </div>
          <Link href={`/episodes/${episode.id}`} className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white transition-all">
            Cerrar
          </Link>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-12 max-w-5xl mx-auto w-full space-y-12 pb-32">
        <div className="text-center mb-16 pt-8">
          <h2 className="text-zinc-600 text-sm uppercase tracking-widest font-bold mb-4">Herida Central / Idea</h2>
          <p className="text-2xl lg:text-4xl font-serif text-zinc-100/90 leading-relaxed max-w-4xl mx-auto italic font-medium">
            "{episode.premise}"
          </p>
          {episode.objetivo_emocional && (
            <div className="mt-8 inline-flex items-center gap-2 border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 px-5 py-2.5 rounded-full font-semibold shadow-[0_0_20px_rgba(79,70,229,0.1)]">
               Objetivo: {episode.objetivo_emocional}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {segments.map((seg, idx) => {
            const isActive = activeSegmentId === seg.id
            const isDone = completedSegments.has(seg.id)
            const hasAudio = seg.ambient_usages && seg.ambient_usages.length > 0 && seg.ambient_usages[0].ambient_layers

            return (
              <Card 
                key={seg.id} 
                onClick={() => isRecording && activateSegment(seg)}
                className={cn(
                  "border-0 transition-all cursor-pointer relative group overflow-visible",
                  isActive ? "bg-indigo-500/10 ring-1 ring-indigo-500/50 shadow-2xl shadow-indigo-900/20" : "bg-zinc-900/40 opacity-70 hover:opacity-100",
                  isDone && "bg-emerald-950/20 ring-0 opacity-50 border border-emerald-500/20"
                )}
              >
                <div className={cn(
                  "absolute -left-4 sm:-left-6 top-6 w-10 sm:w-12 h-10 sm:h-12 rounded-full border-4 border-zinc-950 flex items-center justify-center font-bold text-lg z-10 shadow-lg",
                  isActive ? "bg-indigo-500 text-white" : "bg-zinc-800 text-zinc-400",
                  isDone && "bg-emerald-500 text-white"
                )}>
                  {isDone ? <CheckCircle2 className="w-6 h-6" /> : idx + 1}
                </div>

                <CardContent className="p-6 sm:p-8 pl-10 sm:pl-12">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={cn(
                        "font-bold uppercase tracking-widest text-xs px-3 py-1 rounded-md mb-4 block w-fit",
                        isActive ? "bg-indigo-500/20 text-indigo-300" : "bg-zinc-950 text-zinc-500"
                      )}>
                        {seg.tipo || 'Desarrollo'}
                      </span>
                      <h3 className={cn(
                        "text-2xl sm:text-3xl lg:text-4xl font-black mt-4 leading-tight transition-colors",
                        isActive ? "text-white" : "text-zinc-400",
                        isDone && "text-zinc-600 line-through decoration-zinc-700"
                      )}>
                        {seg.nombre}
                      </h3>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleComplete(seg.id)
                      }}
                      className={cn(
                        "w-12 h-12 rounded-full border flex items-center justify-center transition-all shrink-0",
                        isDone 
                          ? "bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                          : "border-zinc-700 bg-zinc-900 text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10"
                      )}
                    >
                      <CheckCircle2 className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <p className={cn(
                    "text-lg sm:text-xl mb-6",
                    isActive ? "text-zinc-300" : "text-zinc-500"
                  )}>
                    Intención: <span className={cn(
                      "font-medium",
                      isActive ? "text-zinc-100" : "text-zinc-400"
                    )}>{seg.intencion_emocional || 'Neutro'}</span>
                  </p>

                  {hasAudio && (
                    <div className={cn(
                      "flex items-center gap-3 border-l-2 pl-4 py-3 mt-6 transition-all",
                      isActive ? "border-indigo-500 bg-gradient-to-r from-indigo-500/10 to-transparent" : "border-zinc-800 bg-zinc-950/30"
                    )}>
                      <Waves className={cn(
                        "w-6 h-6",
                        isActive ? "text-indigo-400 animate-pulse" : "text-zinc-600"
                      )} />
                      <div>
                        <p className={cn(
                          "text-[10px] font-bold uppercase tracking-widest",
                          isActive ? "text-indigo-400" : "text-zinc-600"
                        )}>
                          Cama Sonora {isActive ? 'Activa' : 'Programada'}
                        </p>
                        <p className={cn(
                          "font-semibold",
                          isActive ? "text-zinc-100" : "text-zinc-500"
                        )}>
                          {seg.ambient_usages[0].ambient_layers.nombre} 
                          <span className="ml-2 font-normal opacity-60">({seg.ambient_usages[0].ambient_layers.emocion})</span>
                        </p>
                      </div>
                      {isActive && (
                        <div className="ml-auto pr-4 flex items-center gap-1">
                          <span className="w-1 h-3 bg-indigo-500/40 animate-[bounce_1s_infinite_0ms]"></span>
                          <span className="w-1 h-5 bg-indigo-500/60 animate-[bounce_1s_infinite_200ms]"></span>
                          <span className="w-1 h-4 bg-indigo-500/80 animate-[bounce_1s_infinite_400ms]"></span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
