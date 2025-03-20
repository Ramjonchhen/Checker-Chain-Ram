import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
  children: ReactNode
  className?: string
}

const TooltipSpan = ({ children, className = "" }: Props) => {
  return (
    <div
      className={twMerge(
        "absolute hidden group-hover:flex -left-1/2 -top-3 -translate-y-full w-max px-2 py-1 bg-neutral-600 rounded-[4px] text-center text-white text-[10px] font-medium after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-neutral-600",
        className
      )}
    >
      {children}
    </div>
  )
}

export default TooltipSpan
