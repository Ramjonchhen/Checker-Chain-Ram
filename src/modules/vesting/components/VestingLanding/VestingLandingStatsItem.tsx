import { DoubleChevronRightIcon } from "assets/icons"
import { Card } from "components"
import { Token } from "modules/token"
import { twMerge } from "tailwind-merge"
import { abbreviateNumber } from "utils/getLiquidityInfo"

type Props = {
  hideRightIcon?: boolean
  subTitle: string,
  value?: number,
}

function VestingLandingStatsItem({ hideRightIcon = false, subTitle, value = 0 }: Props) {
  return (
    <Card
      className={twMerge(
        "h-20 w-full md:max-w-[275px] bg-white pl-[14px] pr-[11px]   justify-between  rounded-lg py-2"
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex gap-[6px] items-center ">
            <Token symbol="CHECKR" />
            <div className="text-xl font-medium leading-[38px] text-neutral-900">
              {abbreviateNumber(value)} CHECKR
            </div>
          </div>
          <div className="text-xs leading-[38px] font-normal text-neutral-700 ">
            {subTitle}
          </div>
        </div>
        {hideRightIcon ? null : (
          <div>
            <DoubleChevronRightIcon />
          </div>
        )}
      </div>
    </Card>
  )
}

export default VestingLandingStatsItem
