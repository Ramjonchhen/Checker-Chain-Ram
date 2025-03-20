import React, { FC } from "react"
import { twMerge } from "tailwind-merge"

interface TableBodyProps {
  className?: string
  children: React.ReactNode
}

export const TableBody: FC<TableBodyProps> = ({ className, children }) => {
  return (
    <>
      <tbody
        className={twMerge(
          `table w-full rounded-lg bg-white border-collapse divide-y-[3px] divide-[#fafafa]`,
          className ?? ""
        )}
      >
        {children}
      </tbody>
    </>
  )
}
