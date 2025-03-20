import { ITableOrders } from "components/landing/components/landingTables/LandingHotAndTrendingTable"
import * as React from "react"
import { SVGProps } from "react"

interface SvgComponentProps extends SVGProps<SVGSVGElement> {
  selectedFilterVariant?: ITableOrders
}

const SortOrderIcon = ({
  selectedFilterVariant = "none",
  ...props
}: SvgComponentProps) => {
  let upColor = "#8D8C8C"
  let downColor = "#8D8C8C"

  if (selectedFilterVariant === "asc") {
    upColor = "#4B4B4B"
    downColor = "#8D8C8C"
  } else if (selectedFilterVariant === "desc") {
    upColor = "#8D8C8C"
    downColor = "#4B4B4B"
  } else {
    upColor = "#8D8C8C"
    downColor = "#8D8C8C"
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={7}
      height={13}
      fill="none"
      {...props}
    >
      <path
        fill={upColor}
        d="M3.5 12.205 0 8.705.705 8 3.5 10.79 6.295 8 7 8.705l-3.5 3.5Z"
      />
      <path
        fill={downColor}
        d="m3.5 0 1.75 1.75L7 3.5l-.705.705L3.5 1.415.705 4.205 0 3.5 3.5 0Z"
      />
    </svg>
  )
}

export default SortOrderIcon
