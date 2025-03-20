/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react"
import { twMerge } from "tailwind-merge"
import { StatsProps } from "./index.d"

export const Stats: React.FC<StatsProps> = ({
  value,
  bottomText,
  onClick = () => {},
  startIcon,
  topText,
  valueClassName,
  className = ""
}) => {
  return (
    <div
      className={twMerge(
        `cursor-pointer flex flex-col ${
          topText ? "items-start" : "items-center"
        } justify-center h-full`,
        className
      )}
      onClick={onClick}
    >
      <span className="text-content-primary text-sm uppercase font-normal text-center">
        {topText}
      </span>
      <div
        className={` ${
          topText && "pt-1"
        } flex items-center gap-2 justify-center`}
      >
        <div>{startIcon}</div>
        <span
          className={twMerge(
            `text-neutral-900 text-base font-[500] leading-6 text-center`,
            valueClassName ?? ""
          )}
        >
          {value}
        </span>
      </div>
      <span className="text-neutral-600 font-normal text-xs text-center">
        {bottomText}
      </span>
    </div>
  )
}
