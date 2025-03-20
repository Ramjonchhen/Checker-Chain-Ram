import { useEffect } from "react"

import { EmptyState } from "components/emptystate"
import { PeopleYouKnowSimilarPreferences } from "modules/profile/components/PeopleYouKnowSimilarPreferences"
import { Trending } from "modules/profile/components/Trending"
import { useUserStore } from "stores"
import { useProductStore } from "stores/product"
import { useReviewStore } from "stores/review"
import { twMerge } from "tailwind-merge"
import { constants } from "constants/common"
import ProductCard from "./components/ProductCard"
import LandingCarousel from "./components/LandingCarousel/LandingCarousel"
import RecentReviewsSection from "./components/RecentReviewsSection"
import { Button } from "components/button"

import LandingTablesSection from "./components/landingTables/LandingTablesSection"
import { ITrendingProducts, ITrendingReviewers } from "interfaces/trending"
// import RecentlyUploadedSection from "./components/RecentlyUploaded/RecentlyUploadedSection"

type Props = {
  trendingProducts: ITrendingProducts[]
  trendingReviewersData: ITrendingReviewers[]
}

export const Landing = ({
  trendingProducts = [],
  trendingReviewersData = []
}: Props) => {
  // const { categories, getCategories } = useCategoryStore()
  const { getProducts, products, loading: productLoading } = useProductStore()
  const { getReviews } = useReviewStore()
  // const { user, authorization } = useUserStore()
  const { authorization } = useUserStore()
  // console.log(trendingProducts?.slice(0, 6))

  // const { wallet } = useWallet()

  // const [selectedCategory, setSelectedCategory] = useState<string>("")

  // useEffect(() => {
  //   getCategories()
  // }, [getCategories, user])

  useEffect(() => {
    // if (authorization) {
    // getProducts({ category: selectedCategory })
    getProducts({})
    getReviews()
    // }
  }, [authorization])
  // selectedCategory

  return (
    <div>
      {/* Header */}
      {/* <div className="pt-5 "></div> */}
      {/* <div className="gap-2 my-6 mx-4 flex overflow-x-auto lg:hidden scrollbar-hide">

      {/* <div className="mt-5" /> */}

      <LandingCarousel />
      {/* <div className="mt-96" /> */}

      <div className={twMerge("px-4", constants.APP_CONTAINER_WIDTH)}>
        {/* <RecentlyUploadedSection /> */}
        <LandingTablesSection
          trendingProducts={trendingProducts.slice(0, 6)}
          trendingReviewersData={trendingReviewersData.slice(0, 6)}
        />
        {/* <LandingTopReviewersTable />

        <LandingHotAndTrendingTable /> */}
      </div>
      <RecentReviewsSection />

      {/* Body */}
      <div
        className={twMerge(
          "flex w-full h-full flex-col px-4 ",
          constants.APP_CONTAINER_WIDTH,
          "md:flex-row"
        )}
      >
        <div className="py-4 pt-8 sm:py-8 ">
          <div className="text-2xl font-semibold leading-[30px] ">
            {/* {selectedCategory || "Hot and Trending🔥"} */}
            {"Recently Added"}
          </div>
          {/* review cards */}
          <div className="flex mt-6 flex-wrap gap-6 justify-start">
            {products.products.map((item) => (
              <ProductCard product={item} key={item._id} />
              // <LegacyProductCard index={index} key={item._id} product={item} />
            ))}
            {productLoading &&
              products.products.length === 0 &&
              [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div
                  key={`productloader-${item}`}
                  className=" shadow-default rounded-md p-4 max-w-sm w-[200px]"
                >
                  <div className="animate-pulse flex flex-col space-x-4">
                    <div className="w-full h-[240px] sm:h-[133px] bg-slate-200 mb-4"></div>
                    <div className="flex-1 space-y-6 !ml-0">
                      <div className="h-2 bg-slate-200 rounded"></div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                          <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                        </div>
                        <div className="h-2 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {products.total !== products.products.length && (
            <div className="w-full grid place-content-center mt-10">
              <Button
                title="Load More"
                variant="outlined"
                className="w-[310px] mt-3"
                onClick={() =>
                  getProducts({
                    category: "",
                    // category: "selectedCategory",
                    page: products.page + 1,
                    append: true
                  })
                }
              />
              {/* <span
                className="cursor-pointer font-[500] text-base leading-6"
                onClick={() => {
                  getProducts({
                    category: "",
                    // category: "selectedCategory",
                    page: products.page + 1,
                    append: true
                  })
                }}
              >
                Load More
              </span> */}
            </div>
          )}
          {products.products.length === 0 && (
            <EmptyState title="No products found" message="" />
          )}

          {/** Landing- Recent Reviews */}
        </div>

        <div className=" hidden md:hidden max-w-[336px] col-span-2 xl:col-span-2 2xl:col-span-1 border-separate h-50">
          <Trending
            className="bg-transparent sm:mt-8 px-8"
            title="Trending on checkerChain"
            trendingProductsData={trendingProducts}
          />
          <div className="w-full px-8">
            <div className="bg-separator h-[1px]" />
          </div>
          <PeopleYouKnowSimilarPreferences
            className="bg-transparent sm:mt-8 px-8"
            title="Recommended People"
            hiddenOnSmallDevices
          />
        </div>
      </div>
    </div>
  )
}
