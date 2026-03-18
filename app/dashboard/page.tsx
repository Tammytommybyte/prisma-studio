import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Plus, Disc3, Mic2, Waves } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Count episodes
  const { count: episodesCount } = await supabase
    .from('episodes')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mb-2">
            Workspace Prisma
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-zinc-100">
            Tu Producción
          </h2>
          <p className="text-zinc-400 text-lg">
            Convierte la dispersión en episodios terminados.
          </p>
        </div>
        <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all rounded-xl h-12 px-6">
          <Link href="/episodes/new">
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Episodio
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Card 1 */}
        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Episodios</CardTitle>
            <Mic2 className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-zinc-100">{episodesCount || 0}</div>
            <p className="text-xs text-zinc-500 mt-1">Registrados en la plataforma</p>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Drones & Pads</CardTitle>
            <Waves className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-zinc-100">0</div>
            <p className="text-xs text-zinc-500 mt-1">Disponibles en Biblioteca</p>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Estado de Próximo Episodio</CardTitle>
            <Disc3 className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-zinc-200 mt-1">Sin episodios activos</div>
            <p className="text-xs text-zinc-500 mt-2">Empieza a planificar usando el editor narrativo.</p>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
