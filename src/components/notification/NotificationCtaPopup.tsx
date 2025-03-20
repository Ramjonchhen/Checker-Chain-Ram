/* eslint-disable @typescript-eslint/no-empty-function */
import { More, CheckTickIcon } from "assets/icons"
import { Dropdown } from "components/dropdown"
import { useNotificationStore } from "stores/notification"

type Props = {
  showDropdown: boolean
  toggleDropdown?: () => void
}

const NotificationCtaPopup = ({ showDropdown, toggleDropdown }: Props) => {
  const { postMarkNotificationsAsRead, notificationData } =
    useNotificationStore()
  const allNotificationIds = notificationData.map((item) => item._id)

  const ctaItems = [
    {
      icon: <CheckTickIcon />,
      text: "Mark all as read",
      onClick: () => {
        postMarkNotificationsAsRead(allNotificationIds)
        toggleDropdown?.()
      }
    }
    // {
    //   icon: <BellIcon className="scale-75" />,
    //   text: "Show all notifications",
    //   onClick: () => {}
    // }
  ]

  return (
    <div>
      <div className="cursor-pointer" onClick={toggleDropdown}>
        <More />
      </div>
      <Dropdown
        className="-mt-1 bg-white border border-outline-secondary right-[30px] w-[226px]"
        show={showDropdown}
        position="right"
      >
        <div className="py-6 px-3 flex flex-col gap-6">
          {ctaItems.map((item) => (
            <div
              className="flex gap-[10px] items-center cursor-pointer"
              key={item.text}
              onClick={item.onClick}
            >
              {item.icon}
              <div className="text-xs font-medium text-neutral-700">
                {item.text}
              </div>
            </div>
          ))}
        </div>
      </Dropdown>
    </div>
  )
}

export default NotificationCtaPopup
