// import {TabProps} from "./tab/index.d";

interface Tab {
  title: string
  count?: number
  startIcon?: JSX.Element
  componet?: JSX.Element,
  showBadge?: boolean;
  badgeCount?: number
}

export interface TabViewProps {
  tabs: Tab[]
  type?: "profile" | "achievement" | "discussion" | ""
  children?: JSX.Element
  scrollBar?: boolean
  activeLineClassName?: string
  tabClassName?: string
  activeColorClassName?: string
  showTabShadow?: boolean
  onTabChange?: (activeTab: number) => void
  defaultActiveTab?: number
  roundedBorder?: boolean
  tabBarClassName?: string

}
