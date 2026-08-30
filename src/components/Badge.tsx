import { ReactNode } from 'react'

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  info: 'bg-info/10 text-info border-info/20',
  neutral: 'bg-text-muted/10 text-text-secondary border-border',
}

export default function Badge({
  variant = 'neutral',
  children,
  className = '',
}: {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full border ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
