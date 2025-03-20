import ProfileCompletion from "assets/images/profileCompletion.svg"
import { Button } from "components"
import { useRouter } from "next/router"

type Props = {
  showClaimRewardsBtn: boolean
}

const CompletedRewardSection = ({ showClaimRewardsBtn }: Props) => {
  const router = useRouter()
  return (
    <div className="overflow-hidden relative mt-4">
      <div className="text-xl font-bold text-center text-[#009B68] font-georgia tracking-[0.01em]">
        Congratulations!
      </div>
      <div className="text-center font-normal text-base text-neutral-600 tracking-[0.03em]">
        Your profile is complete.
      </div>
      <ProfileCompletion className="mx-auto mt-9" />
      {showClaimRewardsBtn && (
        <div className="absolute z-[9999] bottom-0 left-0 right-0 bg-[#F5F8FC] py-4 px-[10px]">
          <Button
            title="Claim Rewards"
            className="w-full"
            onClick={() => router.push("/rewards")}
          />
        </div>
      )}
    </div>
  )
}

export default CompletedRewardSection
