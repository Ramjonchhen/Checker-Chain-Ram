import { Dispatch, SetStateAction } from "react"
import { twMerge } from "tailwind-merge"
import Image from "next/image"
import { useUserStore } from "stores"
import NoProfileImage from "assets/images/avatar/no_profile.png"
import RatingStarView from "components/ratingStar/RatingStarView"

type Props = {
  setIsExpanded: Dispatch<SetStateAction<boolean>>
}

const LandingCardContent = ({ setIsExpanded }: Props) => {
  const { user } = useUserStore((state) => state)

  return (
    <div className={twMerge("px-4 h-full", "flex gap-3")}>
      <div>
        <Image
          src={
            user?.profilePicture
              ? `${process.env.NEXT_PUBLIC_SPACE_BASE}${user.profilePicture}`
              : NoProfileImage.src
          }
          className="object-cover rounded-full w-10 h-10"
          width={40}
          height={40}
          alt="profile"
          unoptimized
        />
      </div>
      <div
        className="h-[72px] w-full bg-[#ECF2FA] pt-2 pl-[9px] pr-3 cursor-pointer rounded-[4px]"
        onClick={() => setIsExpanded(true)}
        aria-hidden
      >
        <div className="flex justify-between">
          <div className="text-neutral-200 text-sm font-normal">
            Write a feedback...
          </div>
          <div>
            <RatingStarView
              rating={0}
              noBackground
              className="border border-[rgba(186,186,186,0.85)]"
              disabledStarClassName="text-[rgba(186,186,186,0.85)] h-[16.67px] w-[15.83px]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default LandingCardContent
