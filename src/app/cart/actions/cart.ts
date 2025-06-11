import { createClient } from '@/utils/supabase/server'

export async function addToCartAction(formData: FormData) {
  const mangaId = formData.get('mangaId') as string

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !mangaId) return

  await supabase.from('cart_items').insert({
    user_id: user.id,
    manga_id: mangaId,
    quantity: 1,
  })
}
