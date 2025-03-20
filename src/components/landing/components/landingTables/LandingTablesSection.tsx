import { useState } from "react"
import { TabView } from "components"
import LandingHotAndTrendingTable from "./LandingHotAndTrendingTable"
import LandingTopReviewersTable from "./LandingTopReviewersTable"
import {
  COLLECTION_TABS,
  TIME_FILTERS,
  TimeFilterButtonGroup
} from "../../../table/TableItems"
import { useRouter } from "next/router"
import { ITrendingProducts, ITrendingReviewers } from "interfaces/trending"

export type ITimeFilter = "All Time" | "24h"
export type ICollectionTabs = "hotTrending" | "topReviewers"

type Props = {
  trendingProducts: ITrendingProducts[]
  trendingReviewersData: ITrendingReviewers[]
}

const LandingTablesSection = ({
  trendingProducts,
  trendingReviewersData
}: Props) => {
  const router = useRouter()

  const [timeFilter, setTimeFilter] = useState<ITimeFilter>(
    TIME_FILTERS.twentyFourHour
  )
  const [activeTab, setActiveTab] = useState<ICollectionTabs>(
    COLLECTION_TABS.hotTrending
  )

  const viewAllBtnHandler = () => {
    router.push({
      pathname: "/collections",
      query: { selected: activeTab, filter: timeFilter, page: 1 }
    })
  }

  const onTabChange = (activeTabNumber: number) => {
    setActiveTab(
      activeTabNumber === 0
        ? COLLECTION_TABS.hotTrending
        : COLLECTION_TABS.topReviewers
    )
  }

  return (
    <div className="mt-10 ">
      <TabView
        tabs={[
          {
            title: "Hot and Trending 🔥",
            componet: (
              <LandingHotAndTrendingTable trendingProducts={trendingProducts} />
            )
          },
          {
            title: "Top Reviewers",
            componet: (
              <LandingTopReviewersTable
                trendingReviewersData={trendingReviewersData}
              />
            )
          }
        ]}
        tabClassName=" px-0 md:px-2 md:pb-5 text-neutral-100 text-sm md:text-xl tracking-[0.2px] font-semibold mx-2 md:mx-4 "
        activeLineClassName=" md:h-[4px] rounded-[0px]  " //  !bg-[#484849]
        activeColorClassName="!text-[#484849]"
        roundedBorder={false}
        scrollBar={false}
        tabBarClassName="flex flex-col md:flex md:flex-row items-start "
        onTabChange={onTabChange}
      >
        <div className="ml-auto flex flex-row items-center gap-3 py-4 md:py-0">
          <TimeFilterButtonGroup
            selectedTimeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
          />
          <button
            className=" px-2 py-1 md:px-3 md:py-2 border-[1.5px] border-[#E9E9EB] rounded-lg text-xs md:text-sm font-semibold text-neutral-900 hover:bg-secondary-50 transition-colors duration-300  "
            onClick={viewAllBtnHandler}
          >
            View all
          </button>
        </div>
      </TabView>
    </div>
  )
}

export default LandingTablesSection
