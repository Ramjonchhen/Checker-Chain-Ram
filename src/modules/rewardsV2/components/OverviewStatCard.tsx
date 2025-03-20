import React from "react"
import { CircularProgress } from "components/CircularProgress"

type Props = {
  cardTitle: string
  highlightedTitle: string
  subTitle: string
  value: number
  totalValue: number
}

const OverviewStatCard = ({
  cardTitle,
  highlightedTitle,
  subTitle,
  value,
  totalValue
}: Props) => {
  const isTotalValueUndefined = totalValue === 0
  const circularPercentProgress = isTotalValueUndefined
    ? 0
    : (value / totalValue) * 100
  return (
    <div className="w-full md:w-[275px] h-auto md:min-h-[132px] rounded-xl border border-[#EAEAEA] bg-white shadow-sm pt-[10px] pl-[23px] pr-[15px] pb-[14px]">
      <div className="text-[#1D1D1F] text-base font-semibold leading-[38px]">
        {cardTitle}
      </div>
      <div className="flex items-center justify-between mt-1">
        <div>
          <div className="text-[#FF4B69] text-xl font-medium leading-[38px]">
            {highlightedTitle}
          </div>
          <div className="text-[#363435] text-xs font-normal leading-[38px]">
            {subTitle}
          </div>
        </div>
        <div>
          <CircularProgress
            percentage={circularPercentProgress}
            status="none"
            size={60}
            lineWidth={8}
            caps="round"
            progressClassname={"text-[#FF4B69]"}
            progressBgClassname="text-[#fff]"
          >
            <div className="text-[#1D1D1F] text-sm font-medium leading-[38px]">
              {isTotalValueUndefined ? `N/A` : `${value}/${totalValue}`}
            </div>
          </CircularProgress>
        </div>
      </div>
    </div>
  )
}

export default OverviewStatCard
