import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import styles from './Input.module.css'

type InputVariant = 'default' | 'success' | 'error'
type InputSize = 'sm' | 'md' | 'lg'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /** Etiqueta visible sobre el campo */
    label?: string
    /** Texto de ayuda debajo del campo */
    helperText?: string
    /** Mensaje de error (activa variante error automáticamente) */
    errorMessage?: string
    /** Variante visual del input */
    variant?: InputVariant
    /** Tamaño del input */
    size?: InputSize
    /** Icono al inicio del input */
    startIcon?: React.ReactNode
    /** Icono al final del input */
    endIcon?: React.ReactNode
    /** Ocupa el 100% del ancho del contenedor */
    fullWidth?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            helperText,
            errorMessage,
            variant = 'default',
            size = 'md',
            startIcon,
            endIcon,
            fullWidth = false,
            className = '',
            disabled,
            id,
            ...rest
        },
        ref
    ) => {
        const [focused, setFocused] = useState(false)

        const resolvedVariant: InputVariant = errorMessage ? 'error' : variant
        const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

        const wrapperClasses = [
            styles.wrapper,
            fullWidth ? styles.fullWidth : '',
        ]
            .filter(Boolean)
            .join(' ')

        const fieldClasses = [
            styles.field,
            styles[`size-${size}`],
            styles[`variant-${resolvedVariant}`],
            focused ? styles.focused : '',
            disabled ? styles.disabled : '',
            startIcon ? styles.hasStartIcon : '',
            endIcon ? styles.hasEndIcon : '',
            className,
        ]
            .filter(Boolean)
            .join(' ')

        return (
            <div className={wrapperClasses}>
                {label && (
                    <label htmlFor={inputId} className={styles.label}>
                        {label}
                    </label>
                )}

                <div className={styles.inputContainer}>
                    {startIcon && (
                        <span className={`${styles.icon} ${styles.iconStart}`} aria-hidden="true">
                            {startIcon}
                        </span>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={fieldClasses}
                        disabled={disabled}
                        aria-invalid={resolvedVariant === 'error'}
                        aria-describedby={
                            errorMessage
                                ? `${inputId}-error`
                                : helperText
                                    ? `${inputId}-helper`
                                    : undefined
                        }
                        onFocus={(e) => {
                            setFocused(true)
                            rest.onFocus?.(e)
                        }}
                        onBlur={(e) => {
                            setFocused(false)
                            rest.onBlur?.(e)
                        }}
                        {...rest}
                    />

                    {endIcon && (
                        <span className={`${styles.icon} ${styles.iconEnd}`} aria-hidden="true">
                            {endIcon}
                        </span>
                    )}
                </div>

                {errorMessage && (
                    <span id={`${inputId}-error`} className={`${styles.helperText} ${styles.errorText}`} role="alert">
                        {errorMessage}
                    </span>
                )}

                {!errorMessage && helperText && (
                    <span id={`${inputId}-helper`} className={styles.helperText}>
                        {helperText}
                    </span>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export default Input
