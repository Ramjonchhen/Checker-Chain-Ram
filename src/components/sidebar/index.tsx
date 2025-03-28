import { Transition } from "@headlessui/react"
import { FC, Fragment } from "react"
import { twMerge } from "tailwind-merge"

interface SidebarProps {
  show: boolean
  children: React.ReactNode
  className?: string
}

export const Sidebar: FC<SidebarProps> = ({
  show,
  children,
  className,
  ...rest
}) => {
  return (
    <Transition
      as={Fragment}
      show={show}
      enter="transition ease-out duration-500"
      enterFrom="transform -translate-x-full"
      enterTo="transform translate-x-0"
      leave="transition ease-in duration-500"
      leaveFrom="transform translate-x-0"
      leaveTo="transform -translate-x-full"
    >
      <div
        className={twMerge(
          `fixed flex flex-col shadow-lg top-0 z-20 left-0 bg-white overflow-auto h-full`,
          className ?? ""
        )}
        {...rest}
      >
        {children}
      </div>
    </Transition>
  )
}
