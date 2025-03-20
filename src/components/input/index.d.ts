import { InputHTMLAttributes } from "react"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  helper?: string
  value?: string
  label?: string
  inputClassName?: string
  endIcon?: JSX.Element
  isNotCopy?: boolean
  labelClassName?: string
}

export interface TextAreaProps
  extends InputHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  helper?: string
  value?: string
  label?: string
  className?: string
  inputClassName?: string
  endIcon?: JSX.Element
  max?: number | string
  rows?: number
  labelClassName?: string
}
