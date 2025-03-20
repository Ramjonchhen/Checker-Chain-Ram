import { Button } from "components"
import Progressbar from "components/progressbar/Progressbar"
import TooltipSpan from "components/toolTipSpan"
import { IVestingData } from "modules/vesting"
import { abbreviateNumber } from "utils/getLiquidityInfo"
import { calculateUnlockedAmountVesting } from "utils/helper"

type Props = {
  onVestingRowClick: (id: IVestingData) => void
  vestingDataItem: IVestingData
}

function VestingTableItem({ onVestingRowClick, vestingDataItem }: Props) {
  const { creator, amount_total, duration, cliff, released, claimable } = vestingDataItem



  const { currentEpoch } = calculateUnlockedAmountVesting(
    cliff,
    amount_total,
    duration,
    released
  )


  return (
    <tr
      className={`${"border-b border-separator"} w-full text-neutral-700 font-medium cursor-pointer text-sm leading-4 hover:bg-secondary-50`}
      onClick={() => onVestingRowClick(vestingDataItem)}
    >
      <td className="py-4 pl-6 font-semibold">{creator}</td>
      <td className="py-4 pl-6">{abbreviateNumber(amount_total)} CHECKR</td>
      <td className="py-4 pl-6">{duration} days</td>
      <td className="py-4 pl-6">
        <div className="group relative">
          {currentEpoch} days
          <TooltipSpan className="-left-6  border border-[#E9E9EB]">
            {new Date().toDateString()}
          </TooltipSpan>
        </div>
      </td>
      <td className="py-4 pl-6">
        <div className="group relative">
          <Progressbar
            progressPercent={(claimable+released)*100/amount_total}
            className="bg-secondary-50 border border-[#E9E9EB]"
            progressValueClassname="vestingTable__progressbar__gradient border border-white"
          />
          <TooltipSpan className="left-1/2 -translate-x-1/2 border border-[#E9E9EB]">
            {abbreviateNumber(claimable + released)} /{" "}
            {abbreviateNumber(amount_total)}
          </TooltipSpan>
        </div>
      </td>
      <td className="py-4 pr-6 ml-auto flex justify-end" colSpan={2}>
        <Button className="bg-secondary-50 rounded-2xl"
          disabled={released === amount_total}
        >
          <div className="vestingClaim__text-gradient text-xs font-medium leading-4">
            {released === amount_total ? "Claimed" : "Claim"}
          </div>
        </Button>
      </td>
    </tr>
  )
}

export default VestingTableItem
