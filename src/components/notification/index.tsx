import { BellIcon } from "assets/icons"
import { Dropdown } from "components/dropdown"
import { useClickOutside } from "hooks/useOutsideClick"
import { useMemo, useRef, useState } from "react"
import NotificationDropdownContent from "components/notification/NotificationDropdownContent"
import { useNotificationStore } from "stores/notification"

const NotificationSection = ({ walletId }: { walletId: string }) => {
  const { notificationData } = useNotificationStore()

  const cleanedNotificationData = useMemo(
    () => notificationData.filter((item) => item.walletId == walletId),
    [notificationData, walletId]
  )
  const unSeenNotificationData = useMemo(
    () => cleanedNotificationData.filter((item) => !item.isSeen),
    [cleanedNotificationData]
  )
  const reviewNotificationData = useMemo(
    () =>
      cleanedNotificationData.filter((item) => item.type === "productReview"),
    [cleanedNotificationData]
  )
  const dropDownWrapperRef = useRef(null)
  useClickOutside(dropDownWrapperRef, {
    onClickOutside: () => setShowDropdown(false)
  })

  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div>
      <div className="relative" ref={dropDownWrapperRef}>
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className="cursor-pointer relative"
        >
          <BellIcon className="w-6 h-6 text-neutral-600 ml-11" />
          {unSeenNotificationData.length > 0 && (
            <div className="absolute -top-3 -right-4 text-[10px] text-white bg-primary-700 rounded-[50%] h-5 w-5 flex items-center justify-center ">
              {unSeenNotificationData.length}
            </div>
          )}
        </div>

        <Dropdown
          className="mt-3 bg-white border border-outline-secondary right-[-40px] md:right-0"
          show={showDropdown}
          position="right"
        >
          <NotificationDropdownContent
            cleanedNotificationData={cleanedNotificationData}
            unSeenNotificationData={unSeenNotificationData}
            reviewNotificationData={reviewNotificationData}
          />
        </Dropdown>
      </div>
    </div>
  )
}

export default NotificationSection
