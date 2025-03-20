import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import { CheckerSmallLogo } from "assets/images"

/* eslint-disable @typescript-eslint/no-empty-function */
type Props = {
  message?: string
  time?: string
  isNotificationRead?: boolean
  onClick: () => void
  logo?: string
}

const dummyText =
  "Hello Alish, We have a new task for you. Visit CheckerChain to do your task."

const NotificationItem = ({
  isNotificationRead = false,
  onClick = () => {},
  message = dummyText,
  time = "Jan 12, 2023 at 1:00 am",
  logo = CheckerSmallLogo.src
}: Props) => {
  return (
    <div
      onClick={onClick}
      className="hover:bg-neutral-50 px-8 py-5 cursor-pointer"
    >
      <div className="flex gap-3">
        <div className="imageSection h-8 w-8 relative basis-8 grow-0 shrink-0">
          {!isNotificationRead && (
            <div className="absolute h-2 w-2 rounded-[50%] bg-secondary-500 -top-1 -left-1" />
          )}
          <img
            src={logo}
            alt=""
            className="h-full w-full rounded-full object-cover border-[0.7px] border-neutral-100"
          />
        </div>
        <div className="notificationSection">
          <div className="flex flex-col gap-1">
            <div className="text-xs leading-[18px] font-normal text-neutral-700">
              <ReactMarkdown>{message}</ReactMarkdown>
            </div>
            <div className="text-[10px] leading-[14px] text-neutral-200 font-medium">
              {time}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationItem
