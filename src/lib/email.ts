import { Resend } from 'resend'
import { type ReactElement } from 'react'

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string
  subject: string
  react: ReactElement
}) {
  const resend = getResend()
  if (!resend) {
    console.warn('RESEND_API_KEY no configurada. Email no enviado.')
    return { data: null, error: new Error('RESEND_API_KEY no configurada') }
  }

  const from = process.env.EMAIL_FROM || 'Tienda Mangas <no-reply@tiendamangas.cl>'

  return resend.emails.send({
    from,
    to: [to],
    subject,
    react,
  })
}
