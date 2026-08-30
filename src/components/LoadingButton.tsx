'use client'
import { ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type LoadingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary hover:bg-primary-hover text-white border border-primary-hover',
  secondary: 'bg-surface border-2 border-ink text-ink hover:bg-surface-alt',
  danger: 'bg-danger hover:brightness-90 text-white border border-danger',
  ghost: 'bg-transparent text-text-secondary hover:bg-surface-alt hover:text-text border border-transparent',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-sm py-1.5 px-3 rounded-md',
  md: 'text-base py-2 px-4 rounded-md',
  lg: 'text-base py-3 px-4 rounded-lg font-bold shadow-md hover:shadow-lg',
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading, disabled, children, className = '', variant, size, ...props }, ref) => {
    const variantClass = variant
      ? `inline-flex items-center justify-center gap-2 font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-1 ${variantClasses[variant]} ${sizeClasses[size ?? 'md']}`
      : ''
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        {...props}
        className={`active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variantClass} ${className}`}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)

LoadingButton.displayName = 'LoadingButton'

export default LoadingButton
