/**
 * Iconos de estado de 12px para indicadores de formulario.
 * Van siempre acompañando al color, nunca reemplazándolo: el estado no puede
 * depender solo de distinguir rojo de verde.
 */

export function IconoCumple() {
  return (
    <svg className="h-3 w-3 shrink-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M2.5 6.5L5 9l4.5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconoPendiente() {
  return (
    <svg className="h-3 w-3 shrink-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <circle cx="6" cy="6" r="3" />
    </svg>
  )
}

export function IconoError() {
  return (
    <svg className="h-3 w-3 shrink-0" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M3.5 3.5l5 5M8.5 3.5l-5 5" strokeLinecap="round" />
    </svg>
  )
}
