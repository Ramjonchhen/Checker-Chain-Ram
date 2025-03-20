import { Button, Card, EmptyState, Text } from "components"
import { CircularProgress } from "components/CircularProgress"

// UNUSED CODE

interface Rewards {
  title: string
  subtitle: string
  status: string
  percentage: number
  progressText: string
}

const rewards: Rewards[] = [
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
  // }
]

export const VestingRow = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <Text variant="modal-header" className="!font-semibold">
          Vesting
        </Text>
        <Button variant="text" title="See More" />
      </div>
      <div className="flex gap-6 justify-center">
        {rewards.length === 0 && (
          <>
            <EmptyState
              className="p-2 self-center"
              message="No rewards found! Under Implementation"
            />
          </>
        )}
        {rewards.map((item) => (
          <Card key={item.title} className="p-6">
            <Text
              variant="modal-header"
              className="!font-semibold !text-[16px]"
            >
              {item.title}
            </Text>
            <div className="flex flex-end gap-24">
              <div className="flex flex-col">
                <Text variant="subtitle" className="text-primary font-normal">
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
      </div>
    </div>
  )
}
