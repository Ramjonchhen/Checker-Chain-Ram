import { FC } from "react"

export interface TableHeader {
  label: string
  width?: string
}

interface TableHeaderProps {
  headers: TableHeader[]
  isMobile: boolean
}

const getWidth = (width: string | undefined) => {
  if (width) {
    return `min-w-${width}`
  }
  return `w-full`
}

export const TableHeader: FC<TableHeaderProps> = (props) => {
  const { headers, isMobile } = props

  return (
    <>
      <thead className="w-full bg-white">
        <tr className="px-2 md:px-6 flex items-center border-t-0 border-y-[3px] border-[#fafafa]">
          {headers.map((header, index) => {
            return (
              <td
                key={header.label}
                className={`px-2 md:px-6 py-4 text-caption text-content-primary font-semibold uppercase border-separate  ${
                  !isMobile && getWidth(header.width)
                }`}
              >
                {index !== headers.length && `${header.label}`}
              </td>
            )
          })}
        </tr>
      </thead>
    </>
  )
}
