import { FC } from "react"
import RatingStarInput from "./RatingStarInput"
import RatingStarView from "./RatingStarView"

interface RatingStarProps {
  rating: number
  input?: boolean
  onChange?: (value: number) => void
  error?: string
  className?: string
}

export const RatingStar: FC<RatingStarProps> = ({
  rating,
  input,
  onChange,
  error = "",
  className = ""
}) => {
  if (input) {
    return (
      <>
        <RatingStarInput
          rating={rating}
          onChange={onChange}
          className={className}
        />
        {!!error && (
          <p className={"text-error italic text-xs leading-[18px] ml-3 mt-2"}>
            {error}
          </p>
        )}
      </>
    )
  }
  return <RatingStarView rating={rating} />
}
