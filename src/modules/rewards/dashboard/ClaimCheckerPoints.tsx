import * as Icons from "assets/icons"
import { RewardCheckerPointChecker } from "assets/images"
import { Button, Input, Text } from "components"
import { useReward } from "hooks/useReward"
import { useEffect, useState } from "react"
import { useUserStore } from "stores"
import { Reward, useRewardStore } from "stores/rewards"

const ListItem = ({
  index,
  text,
  linkUrl = "",
  textClassName = ""
}: {
  index: number
  text: string
  linkUrl?: string
  textClassName?: string
}) => {
  return (
    <div className="flex gap-1">
      <div>{index}.</div>
      {linkUrl ? (
        <div className={textClassName}>
          <a href={linkUrl} target="/">
            {text}
          </a>
          {}
        </div>
      ) : (
        <div className={textClassName}>{text}</div>
      )}
    </div>
  )
}

export const ClaimCheckerPoints = () => {
  const user = useUserStore((state) => state.user)
  const { rewards, fetchRewards } = useRewardStore((state) => state)
  const { checkClaimStatus, claimAirdrop } = useReward()
  const [reward, setReward] = useState<Reward>({
    wallet: "",
    index: 1,
    epoch: 1,
    amount: 0,
    proof: [],
    name: "",
    claimed: false,
    points: 0,
    _id: ""
  })
  useEffect(() => {
    if (user.wallet) {
      fetchRewards(user.wallet)
    }
  }, [user])
  useEffect(() => {
    if (rewards.length > 0) {
      const reward = rewards.sort(
        (each, b) =>
          parseInt(b.epoch.toString()) - parseInt(each.epoch.toString())
      )[0] as Reward
      checkClaimStatus(reward.wallet, reward.epoch).then((isClaimed) => {
        setReward({ ...reward, amount: reward.amount, claimed: !!isClaimed })
      })
    }
  }, [rewards])

  return (
    <div className="flex flex-col gap-4">
      <div className="grid lg:grid-cols-2 grid-cols-1 sm:gap-10">
        <div className="flex flex-col gap-4 sm:border-[2px] sm:border-outline-secondary rounded-lg sm:px-6 py-8">
          <div className="flex justify-between">
            <Text variant="modal-header" className="!font-semibold">
              Claim Checker Points
            </Text>
          </div>
          <div className="input-wrapper !flex-col !gap-0 !p-0">
            <div className="flex flex-between px-4">
              <label className="block text-[#858585] leading-[38px] text-[16px] mb-1">
                CP Points
              </label>
            </div>
            <div className="flex w-full justify-between items-center pr-4">
              <Input
                type="text"
                label=""
                inputClassName="!border-none flex-grow"
                value={`${reward.points}`}
                disabled
              />
              <div className="flex gap-2 sm:min-w-[122px] bg-white rounded-md p-3">
                <Icons.CPIcon />
                CP
              </div>
            </div>
          </div>
          <div className="input-wrapper !flex-col !gap-0 !p-0">
            <div className="flex flex-between px-4">
              <label className="block text-[#858585] leading-[38px] text-[16px] mb-1">
                CHECKR
              </label>
            </div>
            <div className="flex w-full justify-between items-center pr-4">
              <Input
                type="text"
                label=""
                inputClassName="!border-none flex-grow"
                value={`${(reward.amount * 1e-5).toFixed(5)}`}
                disabled
              />
              <div className="flex justify-center items-center gap-2 sm:min-w-[122px] bg-white rounded-md p-1">
                <Icons.CheckerChainIcon />
                CHECKR
              </div>
            </div>
          </div>
          <Button
            title={reward.claimed ? "Claimed" : "Claim Now"}
            className="w-full bg-primary py-6"
            onClick={() => {
              claimAirdrop(reward)
            }}
            disabled={reward.amount === 0 || reward.claimed}
          />
        </div>
        <div className="flex flex-col">
          <div className="mx-auto">
            <RewardCheckerPointChecker className="w-full" />
          </div>
          <div>
            <div className="text-primary font-semibold text-center text-md">
              <span className="text-neutral-700 font-medium ">
                Current Conversion Rate:{" "}
              </span>
              1 CP = 1 CHECKR
            </div>
            <div className="text-xs mt-2 text-neutral-700">
              <div className="text-md text-neutral-800 font-semibold">
                Important Notes
              </div>
              <ListItem
                index={1}
                text={"To acquire CP, completing your profile is essential."}
              />
              <ListItem
                index={2}
                text={
                  "To convert CP to CHECKR, you must submit 2 products, provide 2 reviews, and receive 10 feedbacks in every epoch."
                }
              />
              <ListItem
                index={3}
                text={"See details on how you earn CP from Checkerchain"}
                linkUrl={"https://docs.checkerchain.com/whitepaper/tokenomics"}
                textClassName="underline"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
