import { FC } from "react"
import { Modal, Text } from "components"
import { CircularProgress } from "components/CircularProgress"
import { IUserStatus } from "modules/profile/components/BasicInformation/ProfileStatus"
import UserStatusItem from "modules/profile/components/ProfileCompletionModal/UserStatusItem"
import { CrossIcon } from "assets/icons"
import {
  findUserCompletedPercentage,
  findUserCompletedSteps
} from "utils/helper"
import NotCompletedRewardSection from "modules/profile/components/ProfileCompletionModal/NotCompletedRewardSection"
import CompletedRewardSection from "modules/profile/components/ProfileCompletionModal/CompletedRewardSection"
import { twMerge } from "tailwind-merge"

type Props = {
  showModal: boolean
  closeModal: () => void
  userStatus: IUserStatus[]
  showClaimRewardsBtn: boolean
}

const ProfileCompletionModal: FC<Props> = ({
  showModal,
  closeModal,
  userStatus,
  showClaimRewardsBtn = false
}) => {
  const isCompletedProgress =
    findUserCompletedPercentage(userStatus) >= 100 ? true : false

  return (
    <Modal
      display={showModal}
      onHide={closeModal}
      className="!min-w-[min(80vw,964px)] p-0 pb-[53px] mt-[55vh] md:mt-0 "
      dismissable
    >
      <div className="flex justify-between items-center pt-[23px] pb-[25px] pl-10 pr-[22px] border-b border-[#E9E9EB]">
        <Text variant="modal-header" className="font-semibold ">
          Profile Completion
        </Text>
        <div className="cursor-pointer">
          <CrossIcon onClick={closeModal} />
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row pr-4 pl-10 mt-4">
        <div className="w-full lg:w-[284px] h-[430px] bg-[#ecf2fa80] flex flex-col  pt-[25px] rounded-xl">
          <div className="mx-auto">
            <CircularProgress
              percentage={findUserCompletedPercentage(userStatus)}
              status="none"
              size={100}
              lineWidth={14}
              caps="square"
              progressClassname={
                isCompletedProgress ? "text-[#009B68]" : "text-primary-500"
              }
              progressBgClassname="text-[#fff]"
            >
              <div className="h-[80px] w-[80px] bg-white border border-[#E9E9EB] rounded-full shadow-2xl grid place-items-center left-[11px] top-[11px] ">
                <span
                  className={twMerge(
                    "text-2xl leading-9 text-neutral-600 font-georgia font-bold tracking-[0.01em]",
                    isCompletedProgress && "text-[#009B68]"
                  )}
                >
                  {findUserCompletedSteps(userStatus)}/{userStatus.length}
                </span>
              </div>
            </CircularProgress>
          </div>

          {isCompletedProgress ? (
            <CompletedRewardSection showClaimRewardsBtn={showClaimRewardsBtn} />
          ) : (
            <NotCompletedRewardSection userStatus={userStatus} />
          )}
        </div>

        {/* right section */}
        <div className="w-full flex-1 pt-4 px-2 md:pl-4 md:pr-12 pb-[7px] max-h-[430px] overflow-y-auto bg-[#ECF2FA] rounded-xl">
          <div className="flex flex-col gap-4 overflow-y-auto ">
            {userStatus.map((item) => (
              <UserStatusItem userStatus={item} key={item.key} />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ProfileCompletionModal
