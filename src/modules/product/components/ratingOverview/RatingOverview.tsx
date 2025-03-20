import { InfoIcon } from "assets/icons"
import { Card } from "components"
import RatingStarView from "components/ratingStar/RatingStarView"
import {
  // calculateRatingAvg,
  caluclateTotalCountSum,
  cutAfterInputDecimalPlaces,
  largeNumberFormater
} from "utils/helper"
import { IRatingOverview } from "./index.d"
import RatingProgressSection from "./RatingProgressSection"
import TooltipSpan from "components/toolTipSpan"

type Props = {
  ratingData: IRatingOverview
  ratingScore: number
}
//TODO: rename this component to FeedbackOverview
const RatingOverview = ({ ratingData, ratingScore }: Props) => {
  if (ratingData.status !== "success") return null

  // const ratingAvg = cutAfterInputDecimalPlaces(
  //   calculateRatingAvg(ratingData.categoryRating),
  //   1
  // )
  const ratingScoreAvg = cutAfterInputDecimalPlaces(ratingScore, 2)

  const totalRatings = largeNumberFormater(
    caluclateTotalCountSum(ratingData.categoryRating)
  )

  return (
    <Card className=" w-full rounded-lg bg-white shadow-sm px-0 py-[14px]">
      <div className="titleSection pr-4 pl-6">
        <div className="flex items-center gap-1 w-fit">
          <div className="text-base text-neutral-900 font-semibold tracking-[0.01em] ">
            Rating Overview
          </div>
          <div className="group relative">
            <InfoIcon className="h-4 w-4 cursor-pointer" />
            <TooltipSpan className="-left-[78px]">
              Ratings based on feedbacks recieved
            </TooltipSpan>
          </div>
        </div>
      </div>

      <div className="body-section flex flex-col gap-4 mt-5 lg:items-center lg:flex-row lg:gap-16">
        <div className="left-section flex flex-col items-center px-2 md:px-8">
          <div>
            <span className="text-[32px] leading-[48px] font-semibold text-[#2B2B2B]">
              {ratingScoreAvg}
            </span>
            <span className="text-xs leading-[18px] font-normal text-[#4B4B4B]">
              /5
            </span>
          </div>
          <div>
            <RatingStarView
              rating={ratingScore}
              noBackground
              activeStarClassName="text-[#FFCE00] h-[16.67px] w-[15.83px]"
              disabledStarClassName="text-[#bababa99] h-[16.67px] w-[15.83px]"
            />
          </div>
          <div className="text-[10px] leading-[15px] tracking-[0.01em] text-neutral-400 font-medium">
            {totalRatings}
            {" ratings"}
          </div>
        </div>

        <div className="rightsection w-full">
          <RatingProgressSection {...ratingData} />
        </div>
      </div>
      {/* <div className="seperator bg-separator h-[1px] w-full mt-[29px]"></div> */}
    </Card>
  )
}

export default RatingOverview
