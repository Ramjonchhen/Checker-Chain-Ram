export type PositionStyle = "right" | "left"

export interface DropdownProps {
  children: React.ReactNode
  show: boolean
  variant?: "default" | "light"
  className?: string
  position?: PositionStyle
  ref?: React.RefObject<HTMLDivElement>
}