/**
 * Transicion estandar de cambio de estado: 150ms con ease-out real
 * (la curva de la libreria es demasiado debil) y sin movimiento cuando el
 * usuario pidio reducir animaciones.
 */
export const TRANSICION_ESTADO =
  'transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none'
