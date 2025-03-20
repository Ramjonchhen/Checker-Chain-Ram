import { CircularProgress } from "components/CircularProgress"
import React from "react"
import { abbreviateNumber } from "utils/getLiquidityInfo"

type IStatItem = {
  value: string
  label: string
}

type Props = {
  cardTitle: string
  totalEarnings?: number
  potentialEarnings?: number
  lastMonthReward?: number
  momRewardPercent?: number
}

function StatItem({ value = "", label }: IStatItem) {
  return (
    <div className="flex flex-col text-center">
      <div className="text-[#1D1D1F] text-base font-semibold leading-6">
        {value}
      </div>
      <div className="text-[#363435] text-[10px] font-normal leading-[14px] tracking-[0.1px]">
        {label}
      </div>
    </div>
  )
}

const RewardStatCard = ({
  cardTitle,
  potentialEarnings = 0,
  totalEarnings = 0,
  lastMonthReward = 0,
  momRewardPercent = 0
}: Props) => {
  const calculateCircularProgress =
    potentialEarnings === 0 || lastMonthReward === 0
      ? 0
      : Math.min(Math.max((potentialEarnings / lastMonthReward) * 100, 0), 100)

  return (
    <div className="w-full min-[943px]:w-[275px] h-auto min-[943px]:min-h-[228px] rounded-xl border border-[#EAEAEA] bg-white shadow-sm pt-[10px] pl-[23px] pr-[15px] pb-[29px]">
      <div className="text-[#1D1D1F] text-base font-semibold leading-8">
        {cardTitle}
      </div>
      <div className="flex flex-row items-center justify-between min-[943px]:justify-around">
        <div className="flex flex-col gap-1 items-center">
          <div className="text-primary-500 text-xl font-semibold leading-6 tracking-[0.2px]">
            {abbreviateNumber(totalEarnings)}
          </div>
          <div className="text-[#363435] text-[11px] font-normal leading-[14px] tracking-[0.22px]">
            Total Reward
          </div>
        </div>
        <div>
          <CircularProgress
            percentage={calculateCircularProgress}
            status="none"
            size={91}
            lineWidth={6}
            caps="round"
            progressClassname={"text-[#4F76FF]"}
            progressBgClassname="text-[#CAD9ED]"
          >
            <div className="text-black text-[13px] font-semibold leading-[14px] text-center">
              {abbreviateNumber(potentialEarnings)}
            </div>
            <div className="text-[#4B4B4B] text-[8px] font-light leading-[10px] text-center mt-1">
              Potential Rewards
            </div>
          </CircularProgress>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center mt-[26px] ">
        <StatItem
          value={abbreviateNumber(lastMonthReward)}
          label={"Last Month Reward"}
        />
        <StatItem
          value={`${abbreviateNumber(momRewardPercent)} %`}
          label={"MoM Reward Change"}
        />
        {/* <StatItem value={12719000} label={"Claimed"} /> */}
      </div>
    </div>
  )
}

export default RewardStatCard
