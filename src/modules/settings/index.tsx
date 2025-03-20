import * as Icons from "assets/icons"
import { constants } from "constants/common"
import { useEffect, useState } from "react"
import { useSettingStore, useUserStore } from "stores"
import { twMerge } from "tailwind-merge"
// import { AccountVerification } from "./components/accountVerification";
import { NotificationModes } from "./components/notificationModes"
import { PersonalGoals } from "./components/personalGoals"
// import { Preferences } from "./components/preferences"

const settingTabs = [
  // {
  //   name: "Preferences settings",
  //   component: <Preferences />
  // },
  {
    name: "Personal goals",
    component: <PersonalGoals />
  },
  {
    name: "Email Notification",
    component: <NotificationModes />
  }
  // {
  //   name: "Account Verification",
  //   component: <AccountVerification />,
  // },
]
export const Settings = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const { wallet, authorization } = useUserStore((state) => state)
  const { fetchSettings } = useSettingStore((state) => state)

  useEffect(() => {
    if (authorization && wallet) {
      fetchSettings(wallet, authorization)
    }
  }, [fetchSettings, authorization, wallet])

  return (
    <div
      className={twMerge(
        "flex flex-wrap gap-[41px] px-3 md:px-[47px] py-11",
        "min-h-[calc(100vh-316px)]",
        constants.APP_CONTAINER_WIDTH
      )}
    >
      <div className="w-full lg:w-max">
        <span className="text-content-primary font-medium text-3xl">
          Settings
        </span>
        <p className="text-content-secondary text-sm">
          This is the section to customize your settings.
        </p>
        <div className="mt-8">
          {settingTabs.map((tab, index) => {
            return (
              <div
                onClick={() => setCurrentTab(index)}
                key={index}
                className={`rounded-md pl-5 pr-4 flex items-center justify-between cursor-pointer h-[50px]  ${
                  currentTab === index
                    ? "bg-secondary-contrast"
                    : "bg-transparent"
                }`}
              >
                {tab.name}
                <Icons.ChevronRightIcon />
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex-1">{settingTabs[currentTab].component}</div>
    </div>
  )
}
