import React from "react"
import RewardStatCard from "./RewardStatCard"
import RewardHistoryTable from "./RewardHistoryTable"
import { IRewardV2 } from "stores/rewards"

type Props = {
  rewardsV2Data: IRewardV2
}

const RewardsSection = ({ rewardsV2Data }: Props) => {
  return (
    <div className="mt-5 rounded-2xl bg-white shadow-3 pl-[35px] pt-[42px] px-5 md:pr-[62px] md:pb-[77px]">
      <div className="flex flex-col min-[943px]:flex-row flex-wrap  space-evenly gap-2">
        <RewardStatCard
          cardTitle={"Poster"}
          totalEarnings={rewardsV2Data?.totalReward?.posterReward}
          potentialEarnings={rewardsV2Data?.potentialReward?.posterReward}
          lastMonthReward={rewardsV2Data?.previousEpochRewards?.posterReward}
          momRewardPercent={rewardsV2Data?.percentageChange?.posterReward}
        />
        <RewardStatCard
          cardTitle={"Reviewer"}
          totalEarnings={rewardsV2Data?.totalReward?.reviewerReward}
          potentialEarnings={rewardsV2Data?.potentialReward?.reviewerReward}
          lastMonthReward={rewardsV2Data?.previousEpochRewards?.reviewerReward}
          momRewardPercent={rewardsV2Data?.percentageChange?.reviewerReward}
        />
        <RewardStatCard
          cardTitle={"Influencer"}
          totalEarnings={rewardsV2Data.totalReward?.influencerReward}
          potentialEarnings={rewardsV2Data.potentialReward?.influencerReward}
          lastMonthReward={
            rewardsV2Data?.previousEpochRewards?.influencerReward
          }
          momRewardPercent={rewardsV2Data?.percentageChange?.influencerReward}
        />
      </div>
      <RewardHistoryTable history={rewardsV2Data?.history} />
    </div>
  )
}

export default RewardsSection
