import { MouseEventHandler } from "react"

export interface TabProps {
  isActive: boolean
  startIcon?: JSX.Element
  count?: number
  className?: string
  title: string
  onClick: MouseEventHandler<T>
  showActiveLine?: boolean
  roundedBorder?: boolean
  activeLineClassName?: string
  activeColorClassName?: string
  showBadge?: boolean;
  badgeCount?: number
}
