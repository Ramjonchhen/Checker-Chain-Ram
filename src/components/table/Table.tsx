import React, { FC } from "react"
import { TableHeader } from "./TableHeader"
import useMediaQuery from "hooks/useMediaQuery"
import { twMerge } from "tailwind-merge"

interface TableProps {
  headers: TableHeader[]
  children: React.ReactNode
  isMobile: boolean
}

export const Table: FC<TableProps> = ({ headers, children, isMobile }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full whitespace-nowrap">
        <TableHeader headers={headers} isMobile={isMobile} />
        {children}
      </table>
    </div>
  )
}

export const LeaderboardTable: FC<TableProps> = ({
  headers,
  children,
  isMobile
}) => {
  const matches = useMediaQuery("(min-width: 600px)")
  return (
    <div
      className={twMerge(
        "overflow-x-hidden max-w-[600px]",
        matches && "overflow-x-auto max-w-full"
      )}
    >
      <table className="w-full whitespace-nowrap">
        <TableHeader headers={headers} isMobile={isMobile} />
        {children}
      </table>
    </div>
  )
}
