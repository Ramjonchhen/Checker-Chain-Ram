import React from "react"
import OverviewStatCard from "./OverviewStatCard"
import OverviewCountDownCard from "./OverviewCountDownCard"
import { IRewardV2 } from "stores/rewards"

type Props = {
  rewardsV2Data: IRewardV2
}

const OverviewSection = ({ rewardsV2Data }: Props) => {
  return (
    <div className="pt-[26px] px-9 pb-6 rounded-2xl bg-white shadow-3">
      <div className="text-neutral-900 text-2xl font-semibold leading-[30px] tracking-[-0.48px] ">
        Overview
      </div>
      <div className="flex flex-col md:flex-row items-center space-evenly gap-2 mt-3">
        <OverviewStatCard
          cardTitle={"Daily Check-in"}
          highlightedTitle={"Coming Soon"}
          subTitle={""}
          value={0}
          totalValue={0}
        />
        <OverviewStatCard
          cardTitle={"Quests"}
          highlightedTitle={"Coming Soon"}
          subTitle={""}
          value={0}
          totalValue={0}
        />
        <OverviewCountDownCard nextEpochIn={rewardsV2Data.nextEpochIn} />
      </div>
    </div>
  )
}

export default OverviewSection
