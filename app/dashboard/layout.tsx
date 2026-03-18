import { ReactNode } from 'react'
import { Disc3, LayoutDashboard, Library, ListMusic, LogOut, Settings, Kanban } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Auth desactivado por solicitud del usuario para probar la UI
  /*
  if (!user) {
    redirect('/login')
  }
  */

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-900 bg-zinc-950/50 flex flex-col z-10 backdrop-blur-xl">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-indigo-600/20 p-2 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.2)]">
            <Disc3 className="w-5 h-5 text-indigo-400" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">Prisma.</h1>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 font-medium transition-all shadow-[inset_0_1px_rgba(255,255,255,0.05)] border border-indigo-500/10">
            <LayoutDashboard className="w-4 h-4" />
            <span>Resumen</span>
          </Link>
          <Link href="/episodes" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-all font-medium">
            <ListMusic className="w-4 h-4" />
            <span>Episodios</span>
          </Link>
          <Link href="/library" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-all font-medium">
            <Library className="w-4 h-4" />
            <span>Biblioteca de Audios</span>
          </Link>
          <Link href="/publishing" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-all font-medium">
            <Kanban className="w-4 h-4" />
            <span>Publicación</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-900 bg-zinc-950/80">
          <div className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 font-medium hover:bg-zinc-900 hover:text-zinc-100 transition-all cursor-pointer">
            <Settings className="w-4 h-4" />
            <span>Ajustes</span>
          </div>
          <form action="/auth/signout" method="post" className="w-full mt-1">
            <button className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-rose-400/80 font-medium hover:bg-rose-500/10 hover:text-rose-400 transition-all">
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/30 via-zinc-950 to-zinc-950">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
