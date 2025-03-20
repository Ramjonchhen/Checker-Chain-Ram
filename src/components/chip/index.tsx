import { ChipIcon } from "assets/icons"
import React from "react"
import { ChipProps } from "./index.d"

export const Chip: React.FC<ChipProps> = ({
  title,
  selectable = true,
  onChange = () => {
    null
  },
  isSelected = null,
  onClick
}) => {
  const [selection, setIsSelected] = React.useState(!!isSelected)
  React.useEffect(() => {
    setIsSelected(!!isSelected)
  }, [isSelected])
  return (
    <button
      className={`${
        selectable && selection
          ? "bg-primary text-white border-primary-500"
          : "text-neutral-900 bg-background-gradient border-outline"
      } ${
        !selectable && "cursor-auto"
      }  flex border rounded-xl items-center justify-center gap-1 px-[10px] py-1`}
      onClick={() => {
        if (onClick) {
          onClick()
          return
        }
        if (selectable) {
          onChange(!selection)
          if (isSelected === null) {
            setIsSelected(!selection)
          }
        }
      }}
      type="button"
    >
      <span className="text-[11px] font-normal leading-[14px] whitespace-nowrap">
        {title}
      </span>
      {selection && (
        <div className="text-sm leading-[14px]">
          <ChipIcon />
        </div>
      )}
    </button>
  )
}
