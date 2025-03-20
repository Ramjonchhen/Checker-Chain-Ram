import { FC } from "react"
import VestingLandingStatsItem from "./VestingLandingStatsItem"
import { IVestingData } from "modules/vesting"

const VestingLandingTopSection: FC<{
  vestingData: IVestingData[]
}> = ({ vestingData }) => {
  return (
    <>
      <div className="px-0 md:px-5 lg:px-0">
        <div className="text-2xl font-semibold leading-[30px] tracking-[-0.02em] text-neutral-900">
          Vesting
        </div>
        <div className="text-sm leading-5 font-normal text-neutral-700 mt-2">
          Claim your unlock rewards.
        </div>
      </div>
      <div className="flex gap-2 flex-wrap mt-6 justify-center lg:justify-start">
        <VestingLandingStatsItem
          subTitle={"Total Vested Amount"}
          value={vestingData.reduce((a, b) => a + b?.amount_total ?? 0, 0)}
        />
        <VestingLandingStatsItem
          subTitle={"Total Locked Amount"}
          value={
            vestingData.reduce((a, b) => a + b?.amount_total ?? 0, 0) -
            vestingData.reduce((a, b) => a + b?.claimable ?? 0 + b?.released ?? 0, 0)
          }
        />
        <VestingLandingStatsItem
          hideRightIcon
          value={vestingData.reduce((a, b) => a + b?.claimable ?? 0 + b?.released ?? 0, 0)}
          subTitle={"Total Unlocked Amount"}
        />
      </div>
    </>
  )
}

export default VestingLandingTopSection
