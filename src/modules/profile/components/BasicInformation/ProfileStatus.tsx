import { CrossIcon, GiftIcon } from "assets/icons"
import { Text } from "components"
import { IconButton } from "components/iconButton"
import Progressbar from "components/progressbar/Progressbar"
import { userStatusConstants } from "constants/userStatus"
import { useDisclosure } from "hooks/useDisclosure"
import { useEffect, useState } from "react"
import { User, useUserStore } from "stores"
import { findUserCompletedPercentage } from "utils/helper"
import ProfileCompletionModal from "modules/profile/components/ProfileCompletionModal/ProfileCompletionModal"

import { useProductAirdropContract } from "hooks/useProductAirdropContract"
import { useWallet } from "hooks/useWallet"

export interface IUserStatus {
  key: string
  value: boolean
  description?: string
}

export const getUserStatus: (user: User) => IUserStatus[] = (user: User) => {
  return [
    {
      key: userStatusConstants.profileName.key,
      value: !!user.name && user.name !== "",
      description: userStatusConstants.profileName.description
    },
    {
      key: userStatusConstants.profilePicture.key,
      value: !!user.profilePicture && user.profilePicture !== "",
      description: userStatusConstants.profilePicture.description
    },
    {
      key: userStatusConstants.userType.key,
      value:
        !!user.bestDescribeInCheckerchain &&
        user.bestDescribeInCheckerchain !== "" &&
        user.bestDescribeInCheckerchain?.toLowerCase() !== "undecided",
      description: userStatusConstants.userType.description
    },
    {
      key: userStatusConstants.selectPreferences.key,
      value: !!user.preference && user.preference.length > 0,
      description: userStatusConstants.selectPreferences.description
    },
    {
      key: userStatusConstants.aboutYourself.key,
      value: !!user.bio && user.bio !== "",
      description: userStatusConstants.aboutYourself.description
    },
    {
      key: userStatusConstants.followOtherUsers.key,
      value: user.following > 0,
      description: userStatusConstants.followOtherUsers.description
    },
    {
      key: userStatusConstants.verifyEmailAddress.key,
      value: user.emailVerified,
      description: userStatusConstants.verifyEmailAddress.description
    }
  ]
}

export const ProfileStatus = () => {
  const [showStatus, setShowStatus] = useState(true)
  const [showClaimRewardsBtn, setShowClaimRewardsBtn] = useState(false)
  const [userStatus, setUserStatus] = useState<IUserStatus[]>([])

  const user = useUserStore((state) => state.user)
  const { wallet } = useWallet()
  const { getCurrentAirdropCount, getAirdropRoot, checkClaimStatus } =
    useProductAirdropContract()

  const [
    isProfileCompletionModalOpen,
    { open: openProfileCompletionModal, close: closeProfileCompletionModal }
  ] = useDisclosure()

  const checkIfRewardsUnclaimed = async () => {
    const { latestAirdropId } = await getCurrentAirdropCount()
    const { airdropRoot } = await getAirdropRoot(latestAirdropId)
    if (airdropRoot) {
      const isClaimed = await checkClaimStatus(wallet?.address, latestAirdropId)
      setShowClaimRewardsBtn(isClaimed ? false : true)
    } else {
      setShowClaimRewardsBtn(false)
    }
  }
  useEffect(() => {
    if (user) {
      const userStatus = getUserStatus(user)
      setShowStatus(!userStatus.every((item) => item.value))
      setUserStatus(userStatus)
    }
  }, [user])

  useEffect(() => {
    if (findUserCompletedPercentage(userStatus) >= 100 && !!wallet.address) {
      checkIfRewardsUnclaimed()
    }
  }, [userStatus, wallet])

  return (
    <>
      {showStatus && (
        <div
          onClick={openProfileCompletionModal}
          aria-disabled
          className="bg-neutral-50 cursor-pointer rounded-lg w-full md:w-[440px] my-4 pt-3 pl-[17px] pb-[18px] pr-7 relative border border-[#E9E9EB]"
        >
          <IconButton
            onClick={(event) => {
              event.stopPropagation()
              setShowStatus(false)
            }}
            size="small"
            icon={<CrossIcon className="scale-50" />}
            className="absolute right-2"
          />
          <div className="flex justify-between">
            <Text variant="body">
              {findUserCompletedPercentage(userStatus)}% Profile Completed
            </Text>
          </div>
          <div className="flex gap-2 items-end">
            <Progressbar
              progressPercent={findUserCompletedPercentage(userStatus)}
            />
            <GiftIcon />
          </div>
        </div>
      )}
      <ProfileCompletionModal
        showModal={isProfileCompletionModalOpen}
        closeModal={closeProfileCompletionModal}
        userStatus={userStatus}
        showClaimRewardsBtn={showClaimRewardsBtn}
      />
    </>
  )
}
