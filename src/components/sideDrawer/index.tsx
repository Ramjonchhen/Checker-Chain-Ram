import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
  isDrawerOpen: boolean
  className?: string
  children: ReactNode
}

const SideDrawer = ({ isDrawerOpen, className = "", children }: Props) => {
  return (
    <div
      className={twMerge(
        "static md:fixed right-0 top-0 bottom-0 bg-white z-[2147483645] translate-x-[100%] transition-transform duration-500 w-full md:w-[400px] overflow-hidden shadow-sm",
        !isDrawerOpen && "hidden md:block",
        isDrawerOpen && "translate-x-0",
        className
      )}
    >
      <div className=" h-full w-full">{children}</div>
    </div>
  )
}

export default SideDrawer
