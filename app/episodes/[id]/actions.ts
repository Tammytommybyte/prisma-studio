'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addSegment(episodeId: string, formData: FormData) {
  const supabase = await createClient()

  const nombre = formData.get('nombre') as string
  const tipo = formData.get('tipo') as string
  const intencion_emocional = formData.get('intencion_emocional') as string

  // Get current max order
  const { data: maxSeg } = await supabase
    .from('segments')
    .select('orden')
    .eq('episode_id', episodeId)
    .order('orden', { ascending: false })
    .limit(1)

  const orden = (maxSeg?.[0]?.orden || 0) + 1

  await supabase.from('segments').insert([
    {
      episode_id: episodeId,
      nombre,
      tipo,
      intencion_emocional,
      orden
    }
  ])

  revalidatePath(`/episodes/${episodeId}`)
}

export async function assignDrone(
  episodeId: string,
  segmentId: string, 
  ambientLayerId: string, 
  volumen: number,
  loop: boolean,
  mood: string
) {
  const supabase = await createClient()

  // 1. Obtener todos los usos de drones en este episodio para la regla de max 5
  const { data: segmentsData } = await supabase
    .from('segments')
    .select('id, ambient_usages(id)')
    .eq('episode_id', episodeId)

  let totalDronesEnEpisodio = 0
  let isUpdate = false
  let existingUsageId = null

  if (segmentsData) {
    for (const seg of segmentsData) {
      if (seg.ambient_usages && seg.ambient_usages.length > 0) {
        totalDronesEnEpisodio += seg.ambient_usages.length
        if (seg.id === segmentId) {
          isUpdate = true
          existingUsageId = seg.ambient_usages[0].id
        }
      }
    }
  }

  // REGLA: Max 5 por episodio (Si es nuevo insert, verificamos que no pase de 5)
  if (!isUpdate && totalDronesEnEpisodio >= 5) {
    return { error: 'Límite de audios estructurado alcanzado. (Máx 5 por episodio).' }
  }

  // REGLA: Max 1 por segmento. Al hacer update, sobreescribimos.
  // REGLA: Volumen debe estar entre 10 y 25.
  const finalVolume = Math.min(Math.max(volumen, 10), 25)

  if (isUpdate && existingUsageId) {
    await supabase.from('ambient_usages').update({
      ambient_layer_id: ambientLayerId,
      volumen: finalVolume,
      loop: loop,
      notes: mood
    }).eq('id', existingUsageId)
  } else {
    await supabase.from('ambient_usages').insert([{
      segment_id: segmentId,
      ambient_layer_id: ambientLayerId,
      volumen: finalVolume,
      loop: loop,
      notes: mood
    }])
  }

  revalidatePath(`/episodes/${episodeId}`)
  return { success: true }
}

export async function assignPad(
  episodeId: string,
  segmentId: string,
  soundAssetId: string,
  volumen: number = 80,
  triggerLabel: string = 'FX'
) {
  const supabase = await createClient()

  // REGLA: Por ahora no tenemos limite de pads por segmento, 
  // pero solo permitimos uno del mismo asset por segmento (UNIQUE constraint en BD).
  
  const { error } = await supabase.from('sound_usages').upsert({
    segment_id: segmentId,
    sound_asset_id: soundAssetId,
    volumen: volumen,
    trigger_label: triggerLabel
  }, { onConflict: 'segment_id, sound_asset_id' })

  if (error) return { error: error.message }

  revalidatePath(`/episodes/${episodeId}`)
  return { success: true }
}

export async function updateEpisodeStatus(episodeId: string, newStatus: string) {
  const supabase = await createClient()
  await supabase.from('episodes').update({ estado: newStatus }).eq('id', episodeId)
  revalidatePath('/pipeline')
  revalidatePath(`/episodes/${episodeId}`)
  return { success: true }
}

export async function removePad(episodeId: string, usageId: string) {
  const supabase = await createClient()
  await supabase.from('sound_usages').delete().eq('id', usageId)
  revalidatePath(`/episodes/${episodeId}`)
  return { success: true }
}

export async function removeDrone(episodeId: string, usageId: string) {
  const supabase = await createClient()
  await supabase.from('ambient_usages').delete().eq('id', usageId)
  revalidatePath(`/episodes/${episodeId}`)
  return { success: true }
}
