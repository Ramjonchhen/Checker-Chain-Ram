import useCountdownTimer from "hooks/useCountdownTimer"
import React from "react"
import { twMerge } from "tailwind-merge"

type ICountDownItem = {
  label: string
  value: number
  hideColon?: boolean
}

function CountDownItem({
  label = "",
  value = 0,
  hideColon = false
}: ICountDownItem) {
  return (
    <div className="flex flex-col ">
      <div className="flex items-center gap-1">
        <div className="min-w-[45px] h-[58px] rounded bg-secondary-50 flex items-center justify-center">
          <div className="text-secondary-700 text-[28px] font-semibold leading-[42px]">
            {value}
          </div>
        </div>
        {!hideColon && (
          <div className="text-secondary-700 text-[32px] font-semibold leading-[42px]">
            :
          </div>
        )}
      </div>
      <div
        className={twMerge(
          "text-neutral-700 text-xs font-medium leading-4 text-center",
          !hideColon && "pr-[15.6px]"
        )}
      >
        {label}
      </div>
    </div>
  )
}

const OverviewCountDownCard = ({
  nextEpochIn = 0
}: {
  nextEpochIn?: number
}) => {
  const { days, hours, minutes, seconds } = useCountdownTimer(
    nextEpochIn * 0.001 // converting milliseonds to seconds
  )
  return (
    <div className="w-full md:w-[275px] h-full md:min-h-[144px] rounded-xl border border-[#EAEAEA] bg-white shadow-sm pt-[10px] pl-[23px] pr-[15px] pb-[14px]">
      <div className="text-sm leading-4 text-neutral-900 font-medium">
        Next Distribution in
      </div>
      <div className="flex mt-[6px] gap-1">
        <CountDownItem label={"Days"} value={days} />
        <CountDownItem label={"Hours"} value={hours} />
        <CountDownItem label={"Mins"} value={minutes} />
        <CountDownItem label={"Secs"} value={seconds} hideColon />
      </div>
    </div>
  )
}

export default OverviewCountDownCard
