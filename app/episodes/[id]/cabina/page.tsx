import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { CabinaClient } from './cabina-client'

export default async function CabinaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Fetch Episode Details
  const { data: episode, error: epError } = await supabase
    .from('episodes')
    .select('*')
    .eq('id', id)
    .single()

  if (epError || !episode) {
    return notFound()
  }

  // Consulta compleja: traemos segmentos con sus usos de ambiente Y usos de efectos (Pads)
  const { data: segments } = await supabase
    .from('segments')
    .select(`
      *,
      ambient_usages (
        volumen,
        loop,
        ambient_layers (*)
      ),
      sound_usages (
        volumen,
        trigger_label,
        sound_assets (*)
      )
    `)
    .eq('episode_id', id)
    .order('orden', { ascending: true })

  return (
    <CabinaClient episode={episode} segments={segments || []} />
  )
}
