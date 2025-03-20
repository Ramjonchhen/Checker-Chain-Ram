import React, { FC, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}
const Card: FC<CardProps> = React.forwardRef<HTMLDivElement, CardProps>(
  (props, ref): JSX.Element => {
    const { children, className = "", ...rest } = props
    return (
      <div
        ref={ref}
        className={twMerge(
          "bg-white shadow-default rounded-md px-5 py-5",
          className
        )}
        {...rest}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"
export { Card }
