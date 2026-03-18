import { createEpisode } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function NewEpisodePage() {
  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-500 max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/episodes" className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a episodios
        </Link>
        <h2 className="text-3xl font-bold tracking-tight text-white">Nueva Idea</h2>
        <p className="text-zinc-400 mt-2">Paso 1: Define la semilla de tu episodio.</p>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50 shadow-2xl backdrop-blur-xl">
        <form action={createEpisode}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-zinc-100">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              La Chispa
            </CardTitle>
            <CardDescription className="text-zinc-400">
              No busques perfección, solo plasma la intención principal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-zinc-300">Título Tentativo</Label>
              <Input 
                id="title" 
                name="title" 
                placeholder="Ej. La sombra de la duda" 
                required 
                className="border-zinc-800 bg-zinc-950/50 text-white focus-visible:ring-indigo-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="premise" className="text-zinc-300">Premisa / Herida Central</Label>
              <Textarea 
                id="premise" 
                name="premise" 
                placeholder="¿De qué trata realmente este episodio? ¿Cuál es el conflicto base?" 
                required 
                className="border-zinc-800 bg-zinc-950/50 text-white min-h-[120px] focus-visible:ring-indigo-500 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objetivo_emocional" className="text-zinc-300">Objetivo Emocional (Mood)</Label>
              <Input 
                id="objetivo_emocional" 
                name="objetivo_emocional" 
                placeholder="Ej. Melancolía reflexiva seguida de esperanza" 
                className="border-zinc-800 bg-zinc-950/50 text-white focus-visible:ring-indigo-500"
              />
            </div>
          </CardContent>
          <CardFooter className="bg-zinc-950/30 border-t border-zinc-800/50 pt-6 rounded-b-xl flex justify-end">
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">
              Guardar y Continuar Estructurando
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
