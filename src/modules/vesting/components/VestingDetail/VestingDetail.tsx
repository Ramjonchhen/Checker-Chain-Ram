import { ArrowLeftLong } from "assets/icons"
import { Button } from "components"
import ClaimVestingReward from "./ClaimVestingReward"
import VestingOverview from "./VestingOverview"
import { IVestingData } from "modules/vesting"

type Props = {
  onGoBack: () => void
  vestingDataItem: IVestingData
  utc_datetime: string
}

function VestingDetail({ onGoBack, vestingDataItem, utc_datetime }: Props) {
  return (
    <div>
      <div className="flex gap-4 items-center">
        <Button
          startIcon={<ArrowLeftLong className="text-black" />}
          variant="text"
          className="p-0 m-0"
          onClick={onGoBack}
        />
        <div className="text-2xl leading-[30px] font-semibold text-neutral-900 tracking-[-0.02em]">
          TYPE: {vestingDataItem.creator}
        </div>
      </div>
      <div className="flex justify-center mt-[42px]">
        <div className="flex flex-col md:flex-row items-center gap-[68px] justify-center">
          <VestingOverview
            vestingDataItem={vestingDataItem}
            utc_datetime={utc_datetime}
          />
          <ClaimVestingReward vestingDataItem={vestingDataItem} />
        </div>
      </div>
    </div>
  )
}

export default VestingDetail
