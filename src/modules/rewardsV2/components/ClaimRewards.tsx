import { Button } from "components"
import React, { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
// import { CheckerSmallLogo } from "assets/images"
import { useDisclosure } from "hooks/useDisclosure"
import { CheckerChainSmallNewLogo, ChevronDownIcon } from "assets/icons"
import { useReward } from "hooks/useReward"
import { Reward, useRewardStore } from "stores/rewards"
import { abbreviateNumber } from "utils/getLiquidityInfo"
import { useToastStore } from "stores/toast"
import { findTotalClaimableRewards } from "utils/helper"
import { usePriceRatesStore } from "stores/priceRatesData"

const ClaimRewards = () => {
  const [isExpanded, { toggle, open }] = useDisclosure()

  const { checkClaimStatus, claimAirdrop } = useReward()
  const { rewards, wallet, fetchRewards } = useRewardStore((state) => state)
  const [allRewards, setAllRewards] = useState<Reward[]>([])
  const [selectedReward, setSelectedReward] = useState<Reward>()
  const { errorToast } = useToastStore()
  const { pairData } = usePriceRatesStore()

  const { totalClaimableCheckr, totalAmountInDollars } =
    findTotalClaimableRewards(allRewards, pairData.basePrice ?? 0)

  const handleClaimRewards = () => {
    if (!selectedReward) {
      errorToast({ message: "Please select a reward" })
      open()
    } else {
      claimAirdrop(selectedReward)
    }
  }

  const fetchRewardsWrapper = () => fetchRewards(wallet)

  useEffect(() => {
    if (wallet) {
      fetchRewardsWrapper()
    }
  }, [wallet])

  useEffect(() => {
    if (rewards.length > 0 && wallet) {
      ;(async () => {
        const everyRewards = await Promise.all(
          rewards.map(async (reward) => {
            const isClaimed = await checkClaimStatus(wallet, reward.epoch)
            return { ...reward, claimed: !!isClaimed }
          })
        )
        setAllRewards(everyRewards)
      })()
    }
  }, [rewards, wallet])

  return (
    <div className="flex-shrink-0 h-fit w-full min-[1275px]:w-[280px] rounded-2xl bg-white border border-[#E9E9EB] px-[18px] pt-[14px] pb-5">
      <div className={twMerge("flex flex-col items-center text-neutral-900")}>
        <div className="text-xl font-semibold leading-6 tracking-[0.2px]">
          Rewards
        </div>
        <div className="mt-4">
          <CheckerChainSmallNewLogo className=" scale-125" />
          {/* <img src={CheckerSmallLogo.src} alt="" height={80} width={80} /> */}
        </div>
        <div className="mt-3 text-xs leading-4 text-neutral-500 ">
          Rewards Claimable
        </div>
        <div className="mt-1 text-neutral-900 text-[32px] font-bold leading-[42px]">
          ${abbreviateNumber(totalAmountInDollars)}
        </div>
        <div className="mt-[2px] text-sm text-neutral-400 font-medium leading-4 ">
          ≈ {`${abbreviateNumber(totalClaimableCheckr)}`} CHECKR
        </div>

        <div
          className={twMerge(
            "mt-4 w-full",
            isExpanded && "bg-secondary-50 pt-[14px] pb-5"
          )}
        >
          <div
            className="flex flex-row justify-center items-center cursor-pointer"
            onClick={toggle}
          >
            <div
              className={twMerge(
                "bg-gradient-to-r from-blue-400 via-purple-600 to-blue-400 text-transparent bg-clip-text text-sm leading-4 font-semibold self-center"
              )}
              role="button"
            >
              View Details
            </div>
            <div>
              <ChevronDownIcon
                className={twMerge(
                  "w-4 h-4 text-blue-600 transition-transform duration-300",
                  isExpanded && "rotate-180"
                )}
              />
            </div>
          </div>
          {isExpanded && (
            <div className="px-3  text-xs font-medium leading-[14px] mt-2">
              <div className="flex items-center justify-between">
                <div></div>
                <div>Epoch</div>
                <div>CHECKR</div>
              </div>
              <div className="h-[1px] w-full my-2 bg-neutral-200"></div>
              {allRewards?.map((rewardItem) => (
                <div
                  key={rewardItem.epoch}
                  className="flex items-center justify-between cursor-pointer mt-1"
                  onClick={() => setSelectedReward(rewardItem)}
                >
                  <div>
                    <input
                      type="checkbox"
                      className="!w-4 !h-4 !border !border-neutral-900 !rounded-sm"
                      checked={rewardItem._id === selectedReward?._id}
                    />
                  </div>
                  <div className="text-right">{rewardItem.epoch}</div>
                  <div className="w-[55px] text-right">
                    {abbreviateNumber(rewardItem.amount / 1e5)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-[22px]">
          <Button
            title={selectedReward?.claimed ? "Claimed" : "Claim Reward"}
            onClick={handleClaimRewards}
            disabled={selectedReward?.claimed}
          />
        </div>
      </div>
    </div>
  )
}

export default ClaimRewards
