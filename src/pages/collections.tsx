import axios from "axios"
import Meta from "components/Meta"
import CollectionsPage from "components/collections"
import {
  ICollectionTabs,
  ITimeFilter
} from "components/landing/components/landingTables/LandingTablesSection"
import { COLLECTION_TABS, TIME_FILTERS } from "components/table/TableItems"
import { backendUrls } from "constants/backendUrls"
import { constants } from "constants/common"
import { ITrendingProducts, ITrendingReviewers } from "interfaces/trending"
import Layout from "layout"
import type { GetServerSideProps, NextPage } from "next"
import { twMerge } from "tailwind-merge"

type Props = {
  timeFilter: ITimeFilter
  selectedTab: ICollectionTabs
  trendingProductsData: ITrendingProducts[]
  trendingReviewersData: ITrendingReviewers[]
}

const Collections: NextPage<Props> = ({
  selectedTab,
  timeFilter,
  trendingProductsData,
  trendingReviewersData
}) => {
  return (
    <Layout>
      <Meta
        title="Collections | CheckerChain - Crypto Reviews"
        url="/collections"
      />
      <div className={twMerge(constants.APP_CONTAINER_WIDTH, "px-4")}>
        <CollectionsPage
          selectedTab={selectedTab}
          timeFilter={timeFilter}
          trendingProductsData={trendingProductsData}
          trendingReviewersData={trendingReviewersData}
        />
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    filter = TIME_FILTERS.twentyFourHour,
    selected = COLLECTION_TABS.hotTrending
  } = context.query

  const sanitizedFilter =
    filter === TIME_FILTERS.allTime
      ? TIME_FILTERS.allTime
      : TIME_FILTERS.twentyFourHour

  const sanitizedSelectedTab =
    selected === COLLECTION_TABS.topReviewers
      ? COLLECTION_TABS.topReviewers
      : COLLECTION_TABS.hotTrending

  let trendingProductsData: ITrendingProducts[] = [] as ITrendingProducts[]
  let trendingReviewersData: ITrendingReviewers[] = [] as ITrendingReviewers[]
  try {
    const productsPromise = axios.get(
      backendUrls.getTrendingItems("products"),
      {
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
      }
    )
    const reviewersPromise = axios.get(
      backendUrls.getTrendingItems("reviewers"),
      {
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
      }
    )
    const results = await Promise.allSettled([
      productsPromise,
      reviewersPromise
    ])
    // @ts-ignore
    trendingProductsData = results[0]?.value?.data?.data as ITrendingProducts[]
    // @ts-ignore
    trendingReviewersData = results[1]?.value?.data?.data as ITrendingProducts[]
  } catch (err) {
    console.log(err)
  } finally {
    return {
      props: {
        trendingProductsData: trendingProductsData ?? [],
        trendingReviewersData: trendingReviewersData ?? [],
        timeFilter: sanitizedFilter,
        selectedTab: sanitizedSelectedTab,
        page: 1
      }
    }
  }
}

// export const getServerSideProps: GetServerSideProps = async () => {

// }

export default Collections
