import { RatingStarIcon } from "assets/icons"
import Progressbar from "components/progressbar/Progressbar"
import { caluclateTotalCountSum, getCategoryRatingArray } from "utils/helper"
import { IRatingOverview } from "."

type IRatingProgressItem = {
  starCount: number
  progressValue: number
  ratingSum: number
}

const RatingProgressItem = ({
  starCount,
  progressValue,
  ratingSum
}: IRatingProgressItem) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-[3px]">
        <span className="text-xs text-neutral-900 font-medium">
          {starCount}
        </span>
        <RatingStarIcon className="w-[10px] h-[9.5] text-neutral-900" />
      </div>
      <Progressbar
        progressPercent={isNaN(progressValue) ? 0 : progressValue}
        progressValueClassname="bg-[#FFCE00]"
      />
      <span className="text-[10px] leading-[15px] text-neutral-600">
        {ratingSum}
      </span>
    </div>
  )
}

const RatingProgressSection = ({ categoryRating }: IRatingOverview) => {
  const categoryRatingArray = getCategoryRatingArray(categoryRating)

  return (
    <div className="w-[min(429px,80%)] flex flex-col gap-[9px] mx-auto lg:mx-0">
      {categoryRatingArray.map((item) => (
        <RatingProgressItem
          key={`${item._id}_ratingProgress`}
          starCount={item._id}
          progressValue={
            (item.count / caluclateTotalCountSum(categoryRating)) * 100
          }
          ratingSum={item.count}
        />
      ))}
    </div>
  )
}

export default RatingProgressSection
