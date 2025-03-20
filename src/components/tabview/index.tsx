/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useState } from "react"
import { Tab } from "./tab"
import { TabViewProps } from "./index.d"
import { twMerge } from "tailwind-merge"

const getTabStyle = (type: string) => {
  switch (type) {
    case "profile":
      return "px-2 mx-4"
    case "achievement":
      return "ml-4 mr-10"
    case "discussion":
      return "px-2 mx-4"
    default:
      return "default"
  }
}

export const TabView: React.FC<TabViewProps> = ({
  tabs,
  type = "profile",
  children,
  scrollBar = true,
  activeLineClassName = "",
  tabClassName = "",
  activeColorClassName = "",
  showTabShadow = false,
  onTabChange = () => {},
  defaultActiveTab = 0,
  roundedBorder = true,
  tabBarClassName = ""
}) => {
  const [activeTab, setActiveTab] = useState<number>(0)

  useEffect(() => {
    onTabChange(activeTab)
  }, [activeTab])

  useEffect(() => {
    setActiveTab(defaultActiveTab)
  }, [defaultActiveTab])

  return (
    <div
      className={`w-full ${type === "profile" && "divide-y"} overflow-hidden`}
    >
      <div
        className={twMerge(
          `flex ${showTabShadow && "shadow-lg"} ${
            type !== "discussion" ? "overflow-x-auto" : ""
          } items-center ${!scrollBar && "scrollbar-hide"} `,
          tabBarClassName
        )}
      >
        <div className="flex flex-row">
          {tabs.map((tab, index) => {
            return (
              <Tab
                key={tab.title}
                isActive={activeTab === index}
                title={tab.title.toLowerCase()}
                count={tab.count}
                startIcon={tab.startIcon}
                onClick={() => setActiveTab(index)}
                className={`${getTabStyle(type)} ${tabClassName}`}
                roundedBorder={roundedBorder}
                showActiveLine={type !== "discussion"}
                activeLineClassName={activeLineClassName}
                activeColorClassName={activeColorClassName}
                showBadge={tab?.showBadge}
                badgeCount={tab?.badgeCount}
              />
            )
          })}
        </div>
        {children}
      </div>
      <div>{tabs[activeTab].componet}</div>
    </div>
  )
}
