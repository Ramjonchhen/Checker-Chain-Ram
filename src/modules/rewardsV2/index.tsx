import React, { useEffect } from "react"
import ClaimRewards from "./components/ClaimRewards"

import OverviewSection from "./components/OverviewSection"
import RewardsSection from "./components/RewardsSection"
import { useWallet } from "hooks/useWallet"
import { useRewardStore } from "stores/rewards"

const RewardsPage = () => {
  const {
    wallet: { address }
  } = useWallet()
  const { fetchRewardsV2, rewardsV2 } = useRewardStore()

  useEffect(() => {
    if (address) {
      fetchRewardsV2(address)
    }
  }, [address])
  return (
    <div className="pt-[84px]">
      <div className="flex flex-col min-[1275px]:flex-row gap-5 min-[1275px]:gap-[50px]  pb-[200px]">
        <ClaimRewards />
        <div>
          <OverviewSection rewardsV2Data={rewardsV2} />
          <RewardsSection rewardsV2Data={rewardsV2} />
        </div>
      </div>
      <div className="mb-10"></div>
    </div>
  )
}

export default RewardsPage
