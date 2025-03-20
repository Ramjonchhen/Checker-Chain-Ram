import { ProfileRewards } from "assets/images"
import { Text } from "components"
import { IUserStatus } from "modules/profile/components/BasicInformation/ProfileStatus"
import { twMerge } from "tailwind-merge"
import { ascendingOrderCompletedUserStatus } from "utils/helper"

type Props = {
  userStatus: IUserStatus[]
}

const NotCompletedRewardSection = ({ userStatus }: Props) => {
  return (
    <>
      <div className="flex gap-1 items-center mt-6 mx-auto">
        {ascendingOrderCompletedUserStatus(userStatus).map(
          (each: IUserStatus, index: number) => (
            <div
              key={`page-${each.key}${index}`}
              className={twMerge(
                "w-8 h-2 rounded-sm",
                each.value ? "bg-primary-500" : "bg-[#d9d9d9b3]"
              )}
            />
          )
        )}
      </div>
      <div className="mt-[55px] mb-[18px] mx-auto">
        <Text className="text-neutral-600 text-xl font-bold">Rewards</Text>
      </div>
      <ProfileRewards className="mx-auto" />
      <Text
        variant="body"
        className="text-center text-neutral-200 text-xs px-[26px]"
      >
        Complete the profile completion tasks to claim your reward.
      </Text>
    </>
  )
}

export default NotCompletedRewardSection
