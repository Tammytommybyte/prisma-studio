import { createClient } from '@/utils/supabase/client'

/**
 * Sube un archivo a un bucket de Supabase Storage
 * @param file Archivo a subir
 * @param bucket Nombre del bucket ('ambient-layers', 'sound-assets', 'recordings')
 * @returns La URL pública del archivo o null si falla
 */
export async function uploadAudio(file: File | Blob, bucket: string): Promise<string | null> {
  const supabase = createClient()
  
  // Generar nombre único: timestamp-original || timestamp-recording
  const fileName = file instanceof File ? file.name : `recording-${Date.now()}.webm`
  const filePath = `${Date.now()}-${fileName}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Error uploading audio:', error)
    return null
  }

  // Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return publicUrl
}
