import { Button, Card, Text } from "components"
import { CircularProgress } from "components/CircularProgress"
import { useReward } from "hooks/useReward"
import { useEffect, useState } from "react"
import { useUserStore } from "stores"
import { Reward, useRewardStore } from "stores/rewards"

// UNUSED CODE
interface Rewards {
  title: string
  subtitle: string
  status: string
  percentage: number
  progressText: string
}

const rewardsData: Rewards[] = [
  // {
  //     title: "Daily Check-in",
  //     subtitle: "5 days",
  //     status: "Streak Maintained",
  //     percentage: 5/7 * 100,
  //     progressText: "5/7"
  // },
  // {
  //     title: "Quests",
  //     subtitle: "14 Quests",
  //     status: "Quests Completed",
  //     percentage: 14/25 * 100,
  //     progressText: "14/25"
  // },
  //   {
  //     title: "Quests",
  //     subtitle: "14 Quests",
  //     status: "Quests Completed",
  //     percentage: 14/25 * 100,
  //     progressText: "14/25"
  // }
]

export const RewardsRow = () => {
  const user = useUserStore((state) => state.user)
  const { rewards, fetchRewards } = useRewardStore((state) => state)
  const [allRewards, setAllRewards] = useState<Reward[]>([])
  const { checkClaimStatus, claimAirdrop } = useReward()
  useEffect(() => {
    if (user.wallet) {
      fetchRewards(user.wallet)
    }
  }, [user])
  useEffect(() => {
    if (rewards.length > 0) {
      setTimeout(async () => {
        const everyRewards = await Promise.all(
          rewards.map(async (reward) => {
            const isClaimed = await checkClaimStatus(
              reward.wallet,
              reward.epoch
            )
            return { ...reward, claimed: !!isClaimed }
          })
        )
        setAllRewards(everyRewards)
      }, 1000)
    }
  }, [rewards])

  if (!allRewards.length) {
    return (
      <div className="mt-4">
        <Text variant="modal-header" className="!font-semibold">
          Rewards
        </Text>
        <div>
          <Text
            variant="body"
            className="text-center mt-2 text-neutral-600 text-xs"
          >
            There is no reward to claim.
          </Text>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex justify-between">
        <Text variant="modal-header" className="!font-semibold">
          Rewards
        </Text>
        {/* <Button variant="text" title="See More" /> */}
      </div>
      <div className="flex gap-6 justify-center">
        {/* {rewards.length === 0 && (
          <>
            <EmptyState
              className="p-2"
              message="No rewards found! Under Implementation"
            />
          </>
        )} */}
        {rewardsData?.map((item) => (
          <Card key={item.title} className="p-6">
            <Text
              variant="modal-header"
              className="!font-semibold !text-[16px]"
            >
              {item.title}
            </Text>
            <div className="flex flex-end gap-16">
              <div className="flex flex-col">
                <Text
                  variant="subtitle"
                  className="text-primary-tertiary font-normal"
                >
                  {item.subtitle}
                </Text>
                <Text variant="body">{item.status}</Text>
              </div>
              <div>
                <CircularProgress
                  status="outgoing"
                  percentage={item.percentage}
                  size={66}
                >
                  {item.progressText}
                </CircularProgress>
              </div>
            </div>
          </Card>
        ))}
        <div className="flex flex-col w-full gap-6">
          {allRewards.map((item) => (
            <div
              key={item.epoch}
              className="flex justify-between w-full shadow-1 border-separate border-2 rounded-md px-4 items-center py-4"
            >
              <Text variant="body">
                {item.name} (Epoch {item.epoch})
              </Text>
              <Text variant="body" className="!text-primary-tertiary">
                {item.amount / 1e5} CHECKR
              </Text>
              {/* <Button variant="outlined" title="Claim" /> */}
              <Button
                title={item.claimed ? "Claimed" : "Claim Now"}
                className="py-6"
                variant="outlined"
                onClick={() => {
                  claimAirdrop(item)
                }}
                disabled={item.amount === 0 || item.claimed}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
