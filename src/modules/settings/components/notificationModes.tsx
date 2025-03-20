import EmailImage from "assets/images/email.svg"
import { Card, Toggle } from "components"
import { useUserStore } from "stores"

export const NotificationModes = () => {
  const { user, editProfile } = useUserStore()
  const editNotification = async (notificationMode: boolean) => {
    await editProfile({
      emailNotification: notificationMode, 
    })
  }

  return (
    <Card className="p-0">
      <div className="px-7 flex justify-between pt-5 pb-2 text-content-primary text-2xl font-medium border-b border-outline-secondary">
        Email Notification
        <Toggle checked={user.emailNotification} onChange={() => {
          editNotification(!user.emailNotification)
        }} text="" />
      </div>
      <div className="px-7 py-6 flex md:flex-nowrap flex-wrap md:gap-20 divide-x divide-outline-secondary">
        <div
          className={`flex flex-col w-full mt-5 md:mt-0 items-center justify-center`}
        >
          <EmailImage />
          <p className="mt-4 text-sm text-content-primary text-center w-[234px] font-normal">
            Turn on Notification to receive notifications about any happenings
            on CheckerChain on your mail.
          </p>
        </div>
      </div>
    </Card>
  )
}
