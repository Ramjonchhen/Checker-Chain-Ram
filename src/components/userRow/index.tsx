import NoProfileImage from "assets/images/avatar/no_profile.png"
import { Button, Chip } from "components"
import { useRouter } from "next/router"
import { FC, useState } from "react"
import { useUserStore } from "stores"
import { twMerge } from "tailwind-merge"
import { UserRowProps } from "./index.d"

export const UserRow: FC<UserRowProps> = ({
  followed,
  name,
  description,
  profileImage,
  className,
  badges,
  bio,
  wallet,
  username
}) => {
  const [isFollowing, setIsFollowing] = useState(followed)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { followUser, user, getRecommendedFollowers, authorization } = useUserStore((state) => state)
  const follow = async () => {
    await followUser(wallet, false)
    setIsFollowing(!isFollowing)
    setTimeout(() => {
      getRecommendedFollowers()
    }, 1000)
  }
  const router = useRouter()

  const getImage = () => {
    // if (profileImage.includes("http")) {
    //   return profileImage
    // }
    if(profileImage){
      return `${process.env.NEXT_PUBLIC_SPACE_BASE}${profileImage}`
    } else {
      return NoProfileImage.src
    }
  }

  return (
    <>
      <div className={twMerge("w-full pb-2", className ?? "")}>
        <div className="flex px-6 gap-[14px] items-center">
          <div className="min-w-[45px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="profile"
              className="rounded-full w-[45px] h-[45px] object-cover"
              src={getImage() || NoProfileImage.src}
            />
          </div>
          <div className="cursor-pointer flex items-center gap-3 justify-between flex-1">
            <div
              onClick={() => router.push(`/user/${username}`)}
              className="text-content-primary grid text-left"
            >
              <span className="truncate ... w-full block text-md font-semibold">
                {name || "Guest User"}
              </span>
              <p className="text-xs text-content-secondary">
                Level: {description}
              </p>
            </div>
            <Button
              variant={isFollowing ? "default" : "outlined"}
              title={isFollowing ? "Following" : "Follow"}
              disabled={user.wallet === wallet || !authorization}            
              size="small"
              titleClassName="text-[14px] font-medium"
              onClick={async ()=>{
                if(!authorization) return
                follow()
              }}
            />
          </div>
        </div>
        {(badges || bio) && (
          <div className="hidden sm:block pl-[83px] py-2">
            {badges && (
              <div className="flex flex-wrap gap-[10px] overflow-y-auto max-h-20">
                {badges.map((badge, index) => {
                  return <Chip key={index} selectable={false} title={badge} />
                })}
              </div>
            )}
            {bio && (
              <p className="text-xs mt-4 text-content-secondary">{bio}</p>
            )}
          </div>
        )}
      </div>
    </>
  )
}
