import { useGetActiveTransactionsStatus } from "@multiversx/sdk-dapp/hooks"
import {
  InfoQuestionIcon,
  VestingLockOpenFilledIcon,
  VestingUnlockDurationIcon
} from "assets/icons"
import { Button } from "components"
import { useVestingContract } from "hooks/useVestingContract"
import { IVestingData } from "modules/vesting"
import VestingDetailStatsItem, {
  IVestngDetailStatsItemProps
} from "modules/vesting/components/VestingDetail/VestingDetailStatsItem"
import { useEffect, useState } from "react"
import { abbreviateNumber } from "utils/getLiquidityInfo"

function VestingRewardStatItem({
  checkrValue,
  ...rest
}: { checkrValue: number } & IVestngDetailStatsItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-col gap-[3px]">
        <div className="flex gap-2 items-center">
          <div>
            <VestingLockOpenFilledIcon className="h-6 w-6 text-black" />
          </div>
          <div className="text-base font-semibold leading-6 text-neutral-900">
            {abbreviateNumber(checkrValue)} CHECKR
          </div>
        </div>
        <div className="text-[10px] font-medium leading-[15px] text-neutral-700">
          Vesting
        </div>
      </div>
      <VestingDetailStatsItem {...rest} />
    </div>
  )
}

type Props = {
  vestingDataItem: IVestingData
}

const percentToUnlock = [
  {
    percent: 0.25,
    label: "25%"
  },
  {
    percent: 0.5,
    label: "50%"
  },
  {
    percent: 0.75,
    label: "75%"
  },
  {
    percent: 1,
    label: "100%"
  }
]

function ClaimVestingReward({ vestingDataItem }: Props) {
  const {
    amount_total: total,
    vesting_schedule_id,
    released,
    claimable
  } = vestingDataItem
  const unlockedAmount = claimable
  const amount_total = total - released
  const [amountToClaim, setAmountToClaim] = useState(
    Number(unlockedAmount.toFixed(3).slice(0, -1))
  )
  const { releaseVestedTokens } = useVestingContract()
  const { success, pending } = useGetActiveTransactionsStatus()

  useEffect(() => {
    if (success) {
      setAmountToClaim(0)
    }
  }, [success])

  const releaseTokens = async () => {
    if (amountToClaim <= 0) return
    await releaseVestedTokens(vesting_schedule_id, amountToClaim)
  }

  return (
    <div className="w-full max-w-[375px] bg-white pt-3 pb-8 px-0 rounded-xl border border-[#E9E9EB]">
      <div className="text-sm leading-[21px] font-medium text-neutral-900 px-4">
        Claim Vesting Reward
      </div>
      <div className="h-[1px] bg-separator w-full mt-3"></div>
      <div className="px-6 pt-6 pb-9]">
        <div>
          <VestingRewardStatItem
            checkrValue={total - released - claimable}
            label={"1 Days"}
            subLabel={"Every Unlock Period"}
            icon={<VestingUnlockDurationIcon className="h-5 w-5" />}
          />
          {/* <div className="mt-[22px]"></div>
          <VestingRewardStatItem
            checkrValue={12000.574}
            label={"4 Days"}
            subLabel={"Next Unlocks in"}
            icon={<ClockIcon className="h-5 w-5" />}
          /> */}
        </div>

        <div className="mt-8">
          <div className="h-20 bg-[linear-gradient(#4F76FF,#E64EFF)] rounded-lg grid place-items-center">
            <div className="h-[calc(100%-2px)] w-[calc(100%-2px)] bg-[#EBF0F3] rounded-lg pt-2 px-[14px] pb-[17px]">
              <div className="flex justify-between items-center text-[10px] leading-[15px] font-medium text-neutral-600">
                <div>Amount</div>
                <div
                  onClick={() => {
                    setAmountToClaim(
                      Number(unlockedAmount.toFixed(3).slice(0, -1))
                    )
                  }}
                  className="cursor-pointer"
                >
                  Claimable:{" "}
                  <span className="text-neutral-900">
                    {abbreviateNumber(unlockedAmount)}
                  </span>
                </div>
              </div>
              <div className="h-6 mt-3">
                <div className="text-2xl leading-6 font-medium text-neutral-100 flex w-full">
                  <input
                    // pattern="[0-9]*"
                    className="claimVestingReward__input"
                    style={{
                      all: "unset",
                      width: "100%"
                    }}
                    type="number"
                    step="0.01"
                    onChange={(e) => {
                      setAmountToClaim(
                        e.target.value != "" ? parseFloat(e.target.value) : 0
                      )
                    }}
                    value={amountToClaim || ""}
                  />
                  <div className="">
                    <Button
                      onClick={() => {
                        setAmountToClaim(
                          Number(unlockedAmount.toFixed(3).slice(0, -1))
                        )
                      }}
                      className="bg-[#ff4b69]"
                    >
                      Max
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full mt-6 gap-3">
          {percentToUnlock.map((item) => (
            <div
              onClick={() => {
                setAmountToClaim(
                  Number((amount_total * item.percent).toFixed(3).slice(0, -1))
                )
              }}
              key={`unlock-${item.percent}`}
              className={`flex-1 cursor-pointer flex flex-col justify-center text-center`}
            >
              <div
                className={`${amountToClaim / amount_total >= item.percent - 0.02
                  ? "bg-primary-500"
                  : "bg-[#EBF0F3]"
                  } rounded-md w-full h-2`}
              ></div>
              <div className="text-neutral-200 font-medium text-[8px]">
                {item.label}
              </div>
            </div>
          ))}
        </div>
        {amountToClaim > amount_total && (
          <span className="text-primary-500 font-normal text-xs my-4 block">
            Amount to claim is greater than locked amount
          </span>
        )}

        <div className="mt-6">
          <Button
            disabled={
              released === amount_total ||
              pending ||
              amountToClaim > amount_total
            }
            onClick={() => releaseTokens()}
            className="bg-[#ff4b69] w-full"
          >
            {amountToClaim > unlockedAmount ? "Early Claim" : "Claim"}
          </Button>
        </div>
        <div className="mt-4 relative">
          <Button
            variant="text"
            className="p-0 text-primary-500 text-xs font-normal leading-[18px]"
            title="Under Maintainance"
          >
            Early quit penalty <InfoQuestionIcon /> 20% of total claimed.
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ClaimVestingReward
