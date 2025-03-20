import React from "react"
import {
  RatingBlankStarIcon,
  RatingHalfStarIcon,
  RatingStarIcon
} from "assets/icons"
import { twMerge } from "tailwind-merge"

interface RatingStarProps {
  rating: number
  noBackground?: boolean
  activeStarClassName?: string
  disabledStarClassName?: string
  className?: string
  containerClassName?: string
}

const getRatingBg = (rating: number): { backgroundColor: string } => {
  if (rating < 2) return { backgroundColor: "#FF3722" }
  if (rating == 2) return { backgroundColor: "#FF8622" }
  if (rating > 2 && rating <= 3) return { backgroundColor: "#FFCE00" }
  if (rating > 3 && rating < 5) return { backgroundColor: "#73CF11" }
  if (rating == 5) return { backgroundColor: "#009B68" }

  return { backgroundColor: "#D9D9D9" }
}

const RenderFilledStarIcon = ({
  rating,
  currentIndexStar,
  activeStarClassName
}: {
  backgroundColor: string
  rating: number
  currentIndexStar: number
  activeStarClassName: string
}) => {
  let RenderIcon = RatingStarIcon

  if (!Number.isInteger(rating) && Math.ceil(rating) === currentIndexStar) {
    RenderIcon = RatingHalfStarIcon
  }

  return (
    <RenderIcon
      className={twMerge(
        "w-[12.5px] h-[11.88px] cursor-pointer text-white",
        activeStarClassName
      )}
    />
  )
}

const RatingStarView: React.FC<RatingStarProps> = ({
  rating = 0,
  noBackground = false,
  activeStarClassName = "",
  disabledStarClassName = "",
  className = "",
  containerClassName = ""
}) => {
  const { backgroundColor } = getRatingBg(rating)
  return (
    <div className={twMerge("flex gap-1", containerClassName)}>
      {new Array(5).fill(0).map((_, i) => {
        return (
          <div
            className={twMerge(
              `w-5 h-5 grid place-items-center rounded `,
              className
            )}
            key={i + "ratings"}
            style={{
              backgroundColor: noBackground
                ? ""
                : rating > i
                ? backgroundColor
                : "#D9D9D9"
            }}
          >
            {rating > i ? (
              <RenderFilledStarIcon
                backgroundColor={backgroundColor}
                rating={rating}
                currentIndexStar={i + 1}
                activeStarClassName={activeStarClassName}
              />
            ) : (
              <RatingBlankStarIcon
                className={twMerge(
                  "w-[12.5px] h-[11.88px] text-white",
                  disabledStarClassName
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default RatingStarView
