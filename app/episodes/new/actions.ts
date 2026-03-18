'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createEpisode(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const premise = formData.get('premise') as string
  const objetivo_emocional = formData.get('objetivo_emocional') as string
  
  // Create a basic slug
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') 
    + '-' + Math.random().toString(36).substring(2, 6)

  // Get current max number
  const { data: maxEpisodes } = await supabase
    .from('episodes')
    .select('number')
    .order('number', { ascending: false })
    .limit(1)

  const number = (maxEpisodes?.[0]?.number || 0) + 1

  const { data, error } = await supabase
    .from('episodes')
    .insert([
      {
        title,
        slug,
        premise,
        objetivo_emocional,
        number,
        estado: 'draft'
      }
    ])
    .select()
    .single()

  if (error) {
    console.error("Error al crear episodio", error)
    redirect('/episodes/new?error=No se pudo crear el episodio')
  }

  revalidatePath('/dashboard', 'layout')
  redirect(`/episodes/${data.id}`)
}
