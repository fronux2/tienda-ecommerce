'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { registroSchema } from '@/schemas/registroSchema'
import { passwordFueFiltrada } from '@/lib/auth/passwordFiltrada'

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

  if (await passwordFueFiltrada(password)) {
    redirect('/error?motivo=password-filtrada')
  }

  const cabeceras = await headers()
  const origen = cabeceras.get('origin') ?? `https://${cabeceras.get('host')}`

  const supabase = await createClient()

  // signUp (no admin.createUser): la cuenta queda pendiente hasta que la persona
  // abre el enlace del correo. Antes se creaba con email_confirm: true, lo que
  // permitia registrarse con la direccion de cualquier otra persona.
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origen}/auth/confirm?next=/`,
    },
  })

  if (signUpError) {
    redirect('/error')
  }

  redirect('/registro/confirmar')
}
