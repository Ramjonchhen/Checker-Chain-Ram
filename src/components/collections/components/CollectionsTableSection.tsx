import { useEffect, useRef, useState } from "react"
import { TabView } from "components"
import {
  COLLECTION_TABS,
  TimeFilterButtonGroup
} from "components/table/TableItems"
import LandingHotAndTrendingTable from "components/landing/components/landingTables/LandingHotAndTrendingTable"
import {
  ICollectionTabs,
  ITimeFilter
} from "components/landing/components/landingTables/LandingTablesSection"
import { useRouter } from "next/router"
import LandingTopReviewersTable from "components/landing/components/landingTables/LandingTopReviewersTable"
import PaginateBtn from "components/paginationBtns"
import { ITrendingProducts, ITrendingReviewers } from "interfaces/trending"

type Props = {
  timeFilter: ITimeFilter
  selectedTab: ICollectionTabs
  trendingProductsData: ITrendingProducts[]
  trendingReviewersData: ITrendingReviewers[]
}

const CollectionsTableSection = ({
  timeFilter: timeFilterProp,
  selectedTab,
  trendingProductsData,
  trendingReviewersData
}: Props) => {
  const [timeFilter, setTimeFilter] = useState<ITimeFilter>(timeFilterProp)
  const [currentPageNumbers, setCurrentPageNumbers] = useState({
    hotTrending: 1,
    topReviewers: 1
  })
  const router = useRouter()
  const firstMountCheck = useRef(0)
  const pageQueryParams = router.query.page
  const sanitizedSelectedTabQueryParams =
    router.query.selected === COLLECTION_TABS.hotTrending
      ? COLLECTION_TABS.hotTrending
      : COLLECTION_TABS.topReviewers

  useEffect(() => {
    firstMountCheck.current = firstMountCheck.current + 1
  }, [])

  /** @deprecated use when implmenting serverside pagination */
  useEffect(() => {
    setCurrentPageNumbers((curr) => ({
      ...curr,
      [sanitizedSelectedTabQueryParams]: Number(pageQueryParams) ?? 1
    }))
  }, [pageQueryParams, sanitizedSelectedTabQueryParams])

  /** @deprecated use when implmenting serverside pagination */
  const onTabChange = (activeTabNumber: number) => {
    if (firstMountCheck.current === 0) return

    const selectedTab =
      activeTabNumber === 0
        ? COLLECTION_TABS.hotTrending
        : COLLECTION_TABS.topReviewers

    const selectedPageNumber =
      activeTabNumber === 0
        ? currentPageNumbers.hotTrending
        : currentPageNumbers.topReviewers

    router.push(
      {
        query: {
          selected: selectedTab,
          filter: timeFilter,
          page: selectedPageNumber
        }
      },
      undefined,
      { shallow: true }
    )
  }

  /** @deprecated use when implmenting serverside pagination */
  const onPageChange = (pageNo: number) => {
    if (firstMountCheck.current === 0) return
    router.push(
      {
        query: {
          selected: sanitizedSelectedTabQueryParams,
          filter: timeFilter,
          page: pageNo
        }
      },
      undefined,
      { shallow: true }
    )
  }

  /** @deprecated use when implmenting serverside pagination */
  const findCorrectPageOfTabs = (): number => {
    return sanitizedSelectedTabQueryParams === COLLECTION_TABS.hotTrending
      ? currentPageNumbers.hotTrending
      : currentPageNumbers.topReviewers
  }

  return (
    <div>
      {/* <h1 className="text-[40px] leading-[48px] font-bold text-neutral-900 mb-8">
        Collections
      </h1> */}
      <TabView
        tabs={[
          {
            title: "Hot and Trending 🔥",
            componet: (
              <LandingHotAndTrendingTable
                isCollectionPage
                trendingProducts={trendingProductsData}
              />
            )
          },
          {
            title: "Top Reviewers",
            componet: (
              <LandingTopReviewersTable
                trendingReviewersData={trendingReviewersData}
                isCollectionPage
              />
            )
          }
        ]}
        tabClassName="px-0 md:px-2 md:pb-5 text-neutral-100 text-sm md:text-xl tracking-[0.2px] font-semibold mx-2 md:mx-4"
        activeLineClassName=" md:h-[4px] rounded-[0px]"
        activeColorClassName="!text-[#484849]"
        roundedBorder={false}
        scrollBar={false}
        tabBarClassName="flex flex-col md:flex md:flex-row items-start"
        defaultActiveTab={selectedTab === "topReviewers" ? 1 : 0}
        onTabChange={onTabChange}
      >
        <div className="ml-auto py-4 md:py-0 ">
          <TimeFilterButtonGroup
            selectedTimeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
          />
        </div>
      </TabView>
      <div className="mx-auto md:ml-auto md:mr-0 w-fit hidden">
        <PaginateBtn
          totalData={100}
          currentLimit={10}
          onPageChange={onPageChange}
          currentPage={findCorrectPageOfTabs()}
        />
      </div>
    </div>
  )
}

export default CollectionsTableSection
