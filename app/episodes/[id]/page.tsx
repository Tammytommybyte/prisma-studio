import { NarrativeEditor } from './narrative-editor'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

export default async function EpisodeEditorPage({ params }: { params: Promise<{ id: string }> }) {
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

  // 2. Fetch Segments with Ambient Usages AND Sound Usages (Pads)
  const { data: segments } = await supabase
    .from('segments')
    .select(`
      *,
      ambient_usages (
        id, ambient_layer_id, volumen, loop, notes,
        ambient_layers (*)
      ),
      sound_usages (
        id, sound_asset_id, volumen, trigger_label,
        sound_assets (*)
      )
    `)
    .eq('episode_id', id)
    .order('orden', { ascending: true })

  // 3. Fetch All Available Layers & Assets (for the simplified sound picker)
  const { data: layers } = await supabase
    .from('ambient_layers')
    .select('*')
    .order('nombre', { ascending: true })
    
  const { data: assets } = await supabase
    .from('sound_assets')
    .select('*')
    .order('nombre', { ascending: true })

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-500">
      <NarrativeEditor 
        episode={episode} 
        initialSegments={segments || []} 
        layers={layers || []}
        assets={assets || []}
      />
    </div>
  )
}
