import React from "react"
import { RatingBlankStarIcon, RatingStarIcon } from "assets/icons"
import { twMerge } from "tailwind-merge"

interface RatingStarProps {
  rating: number
  onChange?: (val: number) => void
  className?: string
}

const RatingStarInput: React.FC<RatingStarProps> = ({
  rating,
  onChange,
  className = ""
}) => {
  const [hoveredStar, setHoveredStar] = React.useState(-1)

  return (
    <div className="flex gap-1">
      {new Array(5).fill(0).map((_, i) => {
        return (
          <div
            className={twMerge(
              "px-2 py-2 bg-white border-1 border-separate",
              className
            )}
            key={`star-${i}-${Math.random()}`}
          >
            {(hoveredStar > -1 ? i <= hoveredStar : rating > i) ? (
              <RatingStarIcon
                onClick={() => {
                  setHoveredStar(i)
                  onChange && onChange(rating === i + 1 ? i : i + 1)
                }}
                onMouseEnter={() => {
                  setHoveredStar(i)
                }}
                onMouseLeave={() => {
                  setHoveredStar(-1)
                }}
                className="w-6 h-6 cursor-pointer text-[#FFCE00]"
              />
            ) : (
              <RatingBlankStarIcon
                onClick={() => {
                  setHoveredStar(i)
                  onChange && onChange(i + 1)
                }}
                onMouseEnter={() => {
                  setHoveredStar(i)
                }}
                onMouseLeave={() => {
                  setHoveredStar(-1)
                }}
                className="w-6 h-6 cursor-pointer text-[#BABABA]"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default RatingStarInput
