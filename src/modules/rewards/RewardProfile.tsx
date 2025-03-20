import { NoProfileImage } from "assets/images"
import { Card, Stats, Text, UpdateButton } from "components"
import Image from "next/image"
import { FC, useEffect, useRef, useState } from "react"
import { useUserStore } from "stores"
import { useRewardStore } from "stores/rewards"
import { useToastStore } from "stores/toast"
import { RewardProfileProps } from "./RewardProfile.d"

export const RewardProfile: FC<RewardProfileProps> = ({
  className,
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [userImage, setUserImage] = useState("")
  const { fetchProfile, user } = useUserStore((state) => state)
  const { rewards, airdropToken, airdropLoading } = useRewardStore(
    (state) => state
  )
  const { successToast, errorToast } = useToastStore()
  const [hash, setHash] = useState("")

  useEffect(() => {
    fetchProfile()
  }, [])
  const style = {
    width: cardRef.current?.clientWidth || 300
  }
  useEffect(() => {
    if (user?.profilePicture) {
      setUserImage(
        `${process.env.NEXT_PUBLIC_SPACE_BASE}${user?.profilePicture ?? ""}`
      )
    } else {
      setUserImage(NoProfileImage.src)
    }
  }, [user])

  const airdrop = async () => {
    const res = await airdropToken(user.wallet)
    if (res.status === "success") {
      successToast({
        message: "Airdrop Successful"
      })
      setHash(res.data.hash)
    } else if (res.status === "error") {
      errorToast({
        message: res.message
      })
    } else {
      errorToast({
        message: "Something went wrong"
      })
    }
  }

  return (
    <div ref={cardRef} className={className} {...rest}>
      <Card className="p-0 flex flex-col items-center divide-y-2">
        <div className="flex flex-col items-center pb-3 rounded-t-md">
          {userImage !== "" && (
            <Image
              width={style.width}
              height={240}
              src={userImage}
              className="w-full h-50 object-cover !rounded-t-md"
              alt="RewardProfile"
            />
          )}
          <Text
            variant="subtitle"
            className="font-semibold leading-10 text-2xl mt-4 text-center"
          >
            {user.name ?? "..."}
          </Text>
          <Text
            variant="body"
            className="text-center max-h-12 w-full mb-4 text-content-tertiary text-xs text-ellipsis overflow-hidden ..."
          >
            {user?.bio}
          </Text>
        </div>
        <div className="flex justify-center w-full px-5 py-4 text-center">
          <Stats
            valueClassName="text-[20px]"
            bottomText="Points Earned"
            value={`${rewards.reduce((a, b) => a + b.points, 0) || 0} CP`}
          />
          {/* <Stats
            valueClassName="text-primary text-[20px]"
            bottomText="Overral Ranking"
            value={`${user.rank || 0}`}
          /> */}
        </div>
        {process.env.NEXT_PUBLIC_NETWORK === "devnet" && (
          <div className="w-full flex flex-col justify-center items-center pt-4 pb-8 px-4">
            <UpdateButton
              title="Airdrop Test Token"
              onClick={airdrop}
              loading={airdropLoading}
            />
            {hash && (
              <span className="mt-2 text-blue-800 hover:underline">
                <a
                  href={`https://devnet-explorer.multiversx.com/transactions/${hash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on Explorer
                </a>
              </span>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
