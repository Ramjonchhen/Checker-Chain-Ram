import React from "react"
import { Stats } from "components"
import { FollowPeopleDialog } from "modules/profile/components/FollowPeopleDialog"
import { User } from "stores/user"
import { useRouter } from "next/router"
import { abbreviateNumber } from "utils/getLiquidityInfo"

type Props = {
  user: User
}

const ProfileStatsSection = ({ user }: Props) => {
  const router = useRouter()
  return (
    <div className="flex gap-6 flex-wrap justify-center md:justify-start">
      <FollowPeopleDialog userId={user?._id} type="followers" title="Followers">
        <Stats bottomText="Followers" value={`${user?.follower ?? 0}`} />
      </FollowPeopleDialog>
      <FollowPeopleDialog
        userId={user?._id}
        type="followings"
        title="Following"
      >
        <Stats bottomText="Following" value={`${user?.following ?? 0}`} />
      </FollowPeopleDialog>

      <Stats bottomText="Profile Score" value={`${user?.profileScore ?? 0}`} />
      <Stats
        bottomText="Points Earned"
        value={`${user?.points || 0} CP`}
        onClick={() => {
          router.push("/leaderboard")
        }}
      />
      <Stats
        bottomText="Rewards"
        value={`${abbreviateNumber(user?.reward) ?? 0}`}
      />
      <Stats
        bottomText="Total Rewards"
        value={`${abbreviateNumber(user?.totalReward) ?? 0}`}
      />
    </div>
  )
}

export default ProfileStatsSection
