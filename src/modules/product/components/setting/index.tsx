import * as Icons from "assets/icons"
import { Card } from "components"
import { FC, useState } from "react"
import { BasicInformation } from "./BasicInformation"
import { ContactDetails } from "./ContactDetails"
import { TeamsAndOwnership } from "./TeamsAndOwnership"
import { AdditionalDetails } from "./AdditionalDetails"

const settingTabs = [
  {
    name: "Basic Information",
    component: <BasicInformation />
  },
  {
    name: "Contact Details",
    component: <ContactDetails />
  },
  {
    name: "Teams",
    component: <TeamsAndOwnership />
  },
  {
    name: "Additional Information",
    component: <AdditionalDetails />
  }
]

interface ProductSettingProps {
  closeSetting: () => void
}

export const ProductSetting: FC<ProductSettingProps> = ({ closeSetting }) => {
  const [currentTab, setCurrentTab] = useState(0)

  return (
    <Card className="flex flex-wrap mt-10 divide-x divide-separator p-0 border border-separate">
      <div className="lg:w-[296px] p-6">
        <span className="text-neutral-900 font-semibold text-2xl leading-6 flex items-center gap-2">
          <Icons.ArrowRightIcon
            className="hover:cursor-pointer"
            onClick={() => closeSetting()}
          />
          Settings
        </span>

        <div className="mt-4 flex flex-col gap-3 w-full">
          {settingTabs.map((tab, index) => {
            return (
              <div
                onClick={() => setCurrentTab(index)}
                key={index}
                className={`font-normal text-sm w-full rounded-md px-2 flex items-center justify-between cursor-pointer py-1 ${
                  currentTab === index
                    ? "bg-primary-50 text-primary-500"
                    : "bg-transparent text-neutral-700"
                }`}
              >
                {tab.name}
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex-1">{settingTabs[currentTab].component}</div>
    </Card>
  )
}
