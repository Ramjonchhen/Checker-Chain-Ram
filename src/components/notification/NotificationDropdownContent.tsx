import { TabView } from "components"
import { useState } from "react"
import NotificationCtaPopup from "./NotificationCtaPopup"
import NotificationItem from "./NotificationItem"
import { INotificationData, useNotificationStore } from "stores/notification"
import { useRouter } from "next/router"
import dayjs from "lib/dateLib"
import { getBaseBackendImageUrl } from "utils"
// import { getBaseBackendImageUrl } from "utils"

const NotificationView = ({
  closeNotificationCTA,
  notificationData = []
}: {
  closeNotificationCTA: () => void
  notificationData: INotificationData[]
}) => {
  const router = useRouter()
  const { postMarkNotificationsAsRead } = useNotificationStore()

  if (notificationData.length === 0) {
    return (
      <div className="h-[300px] grid place-items-center">
        <div>{"You're all caught up"}</div>
      </div>
    )
  }

  return (
    <div className="h-[300px] overflow-y-auto">
      <div className="flex flex-col">
        {notificationData?.map((item) => (
          <NotificationItem
            key={item?._id}
            onClick={() => {
              router.push(item?.url)
              postMarkNotificationsAsRead([item._id])
              closeNotificationCTA()
            }}
            isNotificationRead={item?.isSeen}
            message={item?.message}
            time={dayjs(item?.createdAt).format("MMM DD, YYYY [at] hh:mm a")}
            // logo={undefined} // TODO: no imags from Backend
            logo={item?.logo ? getBaseBackendImageUrl(item?.logo) : undefined} // TODO: no imags from Backend
          />
        ))}
      </div>
    </div>
  )
}

const NotificationDropdownContent = ({
  cleanedNotificationData,
  unSeenNotificationData,
  reviewNotificationData
}: {
  cleanedNotificationData: INotificationData[]
  unSeenNotificationData: INotificationData[]
  reviewNotificationData: INotificationData[]
}) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const toggleDropdown = () => setShowDropdown((curr) => !curr)
  const closeDropdown = () => setShowDropdown(false)

  return (
    <div className="w-[300px] md:w-[388px] max-h-[689px] min-h-[200pxx]">
      {/* HEADER */}
      <div className="pt-[18px] pl-6 pr-4 flex justify-between items-center">
        <div>Notifications</div>
        <NotificationCtaPopup
          showDropdown={showDropdown}
          toggleDropdown={toggleDropdown}
        />
      </div>
      {/* TABS */}
      <TabView
        tabs={[
          {
            title: "All",
            badgeCount: cleanedNotificationData?.length,
            showBadge: true,
            componet: (
              <NotificationView
                notificationData={cleanedNotificationData}
                closeNotificationCTA={closeDropdown}
              />
            )
          },

          {
            title: "Reviews",
            badgeCount: reviewNotificationData?.length,
            showBadge: true,

            componet: (
              <NotificationView
                notificationData={reviewNotificationData}
                closeNotificationCTA={closeDropdown}
              />
            )
          },
          {
            title: "Unread",
            badgeCount: unSeenNotificationData?.length,
            showBadge: true,

            componet: (
              <NotificationView
                notificationData={unSeenNotificationData}
                closeNotificationCTA={closeDropdown}
              />
            )
          }
        ]}
        activeLineClassName="bg-secondary-500"
        activeColorClassName="text-secondary-500"
        scrollBar={false}
        showTabShadow
        onTabChange={closeDropdown}
      />
    </div>
  )
}

export default NotificationDropdownContent
