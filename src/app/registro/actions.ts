'use server'

import { createClient } from '@/utils/supabase/server'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { registroSchema } from '@/schemas/registroSchema'

export async function registrarAction(formData: FormData) {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmar_password: formData.get('confirmar_password') as string,
  }

  const parsed = registroSchema.safeParse(raw)
  if (!parsed.success) {
    redirect('/error')
  }

  const { email, password } = parsed.data

  const { error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (createError) {
    redirect('/error')
  }

  const supabase = await createClient()
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
