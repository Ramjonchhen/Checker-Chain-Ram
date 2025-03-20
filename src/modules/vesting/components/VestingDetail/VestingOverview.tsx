import dayjs from "lib/dateLib"
import { Card } from "components"
import { VictoryPie } from "victory"
import VestingStatsItem from "modules/vesting/components/VestingDetail/VestingDetailStatsItem"
import {
  IVestingAmountDataItem,
  IVestingClaimStatus
} from "modules/vesting/components/types"
import {
  allVestingColors,
  availableVestingColor,
  claimedVestingColor,
  vestingColor
} from "constants/common"
import { VestingUnlockDurationIcon, VestingTimeSandIcon } from "assets/icons"
import { abbreviateNumber } from "utils/getLiquidityInfo"
import { IVestingData } from "modules/vesting"
import { calculateOrdinal, calculateUnlockedAmountVesting } from "utils/helper"
import { useBlockTime } from "hooks/useBlockTime"

type Props = {
  vestingDataItem: IVestingData
  utc_datetime: string
}

const pieData = (released: number, total: number, unlocked = 0) => [
  { x: "Claimed", y: (released / total) * 100, total },
  { x: "Available", y: (unlocked / total) * 100, total },
  { x: "Vesting", y: ((total - released - unlocked) / total) * 100, total }
]

const findVestingChartBgColor = (label: IVestingClaimStatus): string => {
  switch (label) {
    case "Claimed":
      return claimedVestingColor
    case "Available":
      return availableVestingColor
    case "Vesting":
      return vestingColor
    default:
      return ""
  }
}

function VestingChartIndexLabel({
  label,
  data
}: {
  label: IVestingClaimStatus
  data: any
}) {
  return (
    <div className="flex gap-2 items-center">
      <div
        className={`h-4 w-4 `}
        style={{ background: findVestingChartBgColor(label) }}
      />
      <div className="text-xs font-normal text-[#363435]">
        {label} (
        {abbreviateNumber(
          data
            .filter((each: any) => each.x === label)
            .reduce((b: any, a: any) => {
              return (a.y * a.total) / 100 + b
            }, 0)
        )}
        )
      </div>
    </div>
  )
}

function VestingAmountData({
  amountValue,
  subTitleValue,
  title
}: IVestingAmountDataItem) {
  return (
    <div>
      <div className="text-[11px] text-neutral-600 leading-4 font-medium">
        {title}
      </div>
      <div className="text-xl font-semibold text-neutral-900 leading-[30px]">
        {abbreviateNumber(amountValue)}
      </div>
      <div className="text-[11px] text-neutral-400 leading-4 font-medium">
        ≈ {abbreviateNumber(subTitleValue)} CP
      </div>
    </div>
  )
}

function VestingDateItem({ label, date }: { label: string; date: Date }) {
  return (
    <div className="flex justify-between items-center text-xs leading-[18px] font-medium">
      <div className="text-neutral-700">{label}</div>
      <div className="text-primary-500">{dayjs(date).format("YYYY-MM-DD")}</div>
    </div>
  )
}

function VestingOverview({ vestingDataItem, utc_datetime }: Props) {
  const { amount_total, cliff, duration, released, claimable } = vestingDataItem
  const { currentEpoch, epochDuration } = calculateUnlockedAmountVesting(
    cliff,
    amount_total,
    duration,
    released
  )
  const { timeRemaining } = useBlockTime(utc_datetime)

  const currentPeriod = calculateOrdinal(currentEpoch + 1)

  const vestingPieData = pieData(released, amount_total, claimable)
  return (
    <Card className="w-full max-w-[420px] pt-3 pb-8 px-0 rounded-xl border border-[#E9E9EB]">
      <div className="px-4">
        <div className="text-sm leading-[21px] font-medium text-neutral-900">
          Vesting Overview
        </div>
        <div className="min-h-[122px] w-full border border-[#E9E9EB] rounded-lg pt-2 px-3 mt-4">
          <div className="flex justify-between items-center w-full">
            <div className="grid place-items-center h-[177px]">
              <VictoryPie
                startAngle={90}
                endAngle={-90}
                data={vestingPieData}
                innerRadius={110}
                colorScale={allVestingColors}
                labelComponent={<></>}
              />
            </div>
            <div className="flex flex-col gap-[14px] ">
              <VestingChartIndexLabel label={"Claimed"} data={vestingPieData} />
              <VestingChartIndexLabel
                label={"Available"}
                data={vestingPieData}
              />
              <VestingChartIndexLabel label={"Vesting"} data={vestingPieData} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 px-[25px]">
        <div className="flex gap-[91px] items-center">
          <VestingAmountData
            title={"Total Vested"}
            amountValue={amount_total}
            subTitleValue={amount_total}
          />
          <VestingAmountData
            title={"Total Unlocked"}
            amountValue={claimable}
            subTitleValue={claimable}
          />
          <VestingAmountData
            title={"Total Claimed"}
            amountValue={released}
            subTitleValue={released}
          />
        </div>
      </div>
      <div className="mt-4 px-6 pt-3 pb-4 border-t border-b border-[#EAEAEA]">
        <div className="flex items-center justify-around">
          <VestingStatsItem
            label={`${duration} days`}
            subLabel={"Total Epoch"}
            icon={<VestingUnlockDurationIcon className="h-5 w-5" />}
          />
          <VestingStatsItem
            label={currentPeriod}
            subLabel={"Current Epoch"}
            icon={<VestingTimeSandIcon />}
          />
          <VestingStatsItem
            label={`${timeRemaining?.hours}:${timeRemaining?.minutes}:${timeRemaining?.seconds}`}
            subLabel={"Next unlock in"}
          />
        </div>
      </div>
      <div className="mt-3 px-6">
        <div className="flex flex-col gap-3">
          <VestingDateItem
            label={"Vesting Locked Date"}
            date={new Date(dayjs(cliff).toString())}
          />
          <VestingDateItem
            label={"Vesting Completion Date"}
            date={new Date(dayjs(cliff + duration * epochDuration).toString())}
          />
        </div>
      </div>
    </Card>
  )
}

export default VestingOverview
