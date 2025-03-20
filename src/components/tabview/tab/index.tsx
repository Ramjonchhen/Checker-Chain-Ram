import React, { FC } from "react"
import { twMerge } from "tailwind-merge"
import { TabProps } from "./index.d"

export const Tab: FC<TabProps> = (props) => {
  const {
    isActive,
    title,
    startIcon,
    count,
    className,
    onClick,
    roundedBorder,
    showActiveLine = true,
    activeLineClassName = "",
    activeColorClassName = "",
    showBadge = false,
    badgeCount = 0
  } = props

  return (
    <>
      <button
        type="button"
        className={twMerge(
          `capitalize gap-x-2 text-[14px] leading-5 font-normal ${
            isActive
              ? `text-primary ${activeColorClassName}`
              : "text-neutral-400"
          } relative flex items-center py-2 w-max focus:outline-0 transition duration-300`,
          className ?? ""
        )}
        onClick={onClick}
      >
        {startIcon && <span className="text-xl">{startIcon}</span>}
        {count && <span>{count}</span>}
        <div className="flex flex-row gap-2">
          <div>{title}</div>
          {showBadge && (
            <div
              className={twMerge(
                "rounded-md px-3 text-[10px] font-poppins font-normal",
                isActive
                  ? `${activeLineClassName} text-white`
                  : "bg-neutral-100 text-white"
              )}
            >
              {badgeCount}
            </div>
          )}
        </div>
        {showActiveLine && (
          <div
            className={`absolute h-[3px] bg-primary left-0 ${
              roundedBorder && "rounded-t-2xl"
            } -bottom-[1px] transition-all duration-300 ${
              isActive ? "w-full ease-out" : "w-0 ease-in"
            } ${activeLineClassName}`}
          />
        )}
      </button>
    </>
  )
}
