import { createHash } from 'crypto'

const TIMEOUT_MS = 3000

/**
 * Verifica si una contraseña aparece en filtraciones conocidas, usando la API
 * publica de HaveIBeenPwned (la misma que usa la proteccion de contraseñas
 * filtradas del plan Pro de Supabase).
 *
 * Funciona por k-anonimato: se envian solo los primeros 5 caracteres del hash
 * SHA-1, la API responde con todos los sufijos que empiezan asi, y la
 * comparacion final ocurre aca. La contraseña nunca sale del servidor.
 *
 * Si la API falla o tarda demasiado devuelve false (deja pasar el registro):
 * bloquear a los usuarios porque un servicio externo esta caido seria peor que
 * el riesgo que se intenta evitar.
 */
export async function passwordFueFiltrada(password: string): Promise<boolean> {
  const hash = createHash('sha1').update(password).digest('hex').toUpperCase()
  const prefijo = hash.slice(0, 5)
  const sufijo = hash.slice(5)

  try {
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefijo}`, {
      // Add-Padding rellena la respuesta con hashes falsos (count 0) para que su
      // tamaño no delate cuantas coincidencias reales hay.
      headers: { 'Add-Padding': 'true' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    })

    if (!res.ok) return false

    const cuerpo = await res.text()

    return cuerpo.split('\n').some((linea) => {
      const [sufijoRemoto, veces] = linea.trim().split(':')
      // Los hashes de relleno vienen con count 0 y hay que ignorarlos.
      return sufijoRemoto === sufijo && Number(veces) > 0
    })
  } catch {
    return false
  }
}
