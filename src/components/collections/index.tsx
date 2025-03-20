import {
  ICollectionTabs,
  ITimeFilter
} from "components/landing/components/landingTables/LandingTablesSection"
import CollectionsTableSection from "./components/CollectionsTableSection"
import { ITrendingProducts, ITrendingReviewers } from "interfaces/trending"

type Props = {
  timeFilter: ITimeFilter
  selectedTab: ICollectionTabs
  trendingProductsData: ITrendingProducts[]
  trendingReviewersData: ITrendingReviewers[]
}

const CollectionsPage = ({
  timeFilter,
  selectedTab,
  trendingProductsData,
  trendingReviewersData
}: Props) => {
  return (
    <div className="pt-[66px] pb-[243px]">
      <CollectionsTableSection
        timeFilter={timeFilter}
        selectedTab={selectedTab}
        trendingProductsData={trendingProductsData}
        trendingReviewersData={trendingReviewersData}
      />
    </div>
  )
}

export default CollectionsPage
