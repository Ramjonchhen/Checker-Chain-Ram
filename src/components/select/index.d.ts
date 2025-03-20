import React from "react"

interface DynamicObject {
  [key: string]: string | number
}

export type DynamicValues = DynamicObject | string | number | null | undefined

export interface SelectProps extends React.HTMLAttributes<HTMLSelectElement> {
  label: string
  value?: string
  key?: string
  items: DynamicValues[]
  placeholder?: string
  onValueChange?: (arg0: DynamicValues) => void
  required?: boolean
  labelClassName?: string
}
