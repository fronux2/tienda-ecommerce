'use client'

const LARGO_MINIMO = 10
const SIMBOLOS = /[!@#$%^&*()_+\-=\[\]{};'\\:"|<>?,.\/`~]/

const CURVA = 'transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none'

function IconoCumple() {
  return (
    <svg className="h-3 w-3 shrink-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M2.5 6.5L5 9l4.5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconoPendiente() {
  return (
    <svg className="h-3 w-3 shrink-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <circle cx="6" cy="6" r="3" />
    </svg>
  )
}

export default function PasswordRequisitos({ password }: { password: string }) {
  const largo = password.length
  const celdasLlenas = Math.min(largo, LARGO_MINIMO)
  const faltanCaracteres = Math.max(LARGO_MINIMO - largo, 0)

  const requisitos = [
    { id: 'mayuscula', etiqueta: 'Mayúscula', cumple: /[A-Z]/.test(password) },
    { id: 'minuscula', etiqueta: 'Minúscula', cumple: /[a-z]/.test(password) },
    { id: 'numero', etiqueta: 'Número', cumple: /[0-9]/.test(password) },
    { id: 'simbolo', etiqueta: 'Símbolo', cumple: SIMBOLOS.test(password) },
  ]

  const pendientes = requisitos.filter((r) => !r.cumple)
  const empezo = largo > 0
  const listo = faltanCaracteres === 0 && pendientes.length === 0

  let mensaje: string
  if (!empezo) {
    mensaje = 'Mínimo 10 caracteres, con mayúscula, minúscula, número y símbolo.'
  } else if (listo) {
    mensaje = 'Contraseña lista'
  } else if (faltanCaracteres > 0) {
    mensaje = `Te falta${faltanCaracteres === 1 ? '' : 'n'} ${faltanCaracteres} ${faltanCaracteres === 1 ? 'caracter' : 'caracteres'}`
  } else {
    mensaje = `Falta: ${pendientes.map((r) => r.etiqueta.toLowerCase()).join(', ')}`
  }

  return (
    <div className="mt-3">
      {/* Medidor de longitud: una celda por caracter exigido, se entinta al escribir */}
      <div className="flex gap-1" aria-hidden="true">
        {Array.from({ length: LARGO_MINIMO }, (_, i) => (
          <span
            key={i}
            className={`h-2 flex-1 rounded-[2px] border ${CURVA} ${
              i < celdasLlenas
                ? listo
                  ? 'bg-success border-success'
                  : 'bg-ink border-ink'
                : 'bg-transparent border-ink/25'
            }`}
          />
        ))}
      </div>

      <p
        role="status"
        aria-live="polite"
        className={`mt-2 flex items-center gap-1 text-sm font-medium tabular-nums ${CURVA} ${
          listo ? 'text-success' : empezo ? 'text-text-secondary' : 'text-text-muted'
        }`}
      >
        {listo && <IconoCumple />}
        {mensaje}
      </p>

      <ul className="mt-2 flex flex-wrap gap-1.5">
        {requisitos.map((r) => (
          <li
            key={r.id}
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium ${CURVA} ${
              r.cumple
                ? 'border-success text-success bg-success/10'
                : empezo
                  ? 'border-danger/40 text-danger bg-danger/5'
                  : 'border-border text-text-muted'
            }`}
          >
            {r.cumple ? <IconoCumple /> : <IconoPendiente />}
            {r.etiqueta}
          </li>
        ))}
      </ul>
    </div>
  )
}
