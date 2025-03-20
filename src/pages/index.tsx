import { Landing } from "components/landing"
import Meta from "components/Meta"
import Layout from "layout"
import type { GetServerSideProps, NextPage } from "next"
import axios from "axios"
import { backendUrls } from "constants/backendUrls"
import { ITrendingProducts, ITrendingReviewers } from "interfaces/trending"

type Props = {
  trendingProductsData: ITrendingProducts[]
  trendingReviewersData: ITrendingReviewers[]
}

const Home: NextPage<Props> = ({
  trendingProductsData = [],
  trendingReviewersData = []
}) => {
  return (
    <Layout>
      <Meta
        title="CheckerChain - Crypto Reviews"
        description="CheckerChain is an AI powered trustless review to earn dApp. Read, write and share crypto reviews. Learn how to earn crypto and get paid to write reviews."
        image="https://checkerchain.com/checkerchain.svg"
      />
      <Landing
        trendingProducts={trendingProductsData}
        trendingReviewersData={trendingReviewersData}
      />
    </Layout>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
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
    trendingProductsData = results[0]?.value?.data.data as ITrendingProducts[]
    // @ts-ignore
    trendingReviewersData = results[1]?.value?.data.data as ITrendingProducts[]
  } catch (err) {
    console.log(err)
  } finally {
    return {
      props: {
        trendingProductsData: trendingProductsData ?? [],
        trendingReviewersData: trendingReviewersData ?? []
      }
    }
  }
}
