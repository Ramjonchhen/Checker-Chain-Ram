import SortOrderIcon from "assets/icons/SortOrderIcon"
import {
  ProductNameTableItem,
  NumberValueTableItem,
  RewardsTableItem,
  ProductRatingTableItem,
  MedalTableItem,
  RankTableItem
  // ProfileUpvoteTableItem
} from "components/table/TableItems"
import { ITrendingProducts } from "interfaces/trending"
import { useRouter } from "next/router"
import { useState } from "react"
import { usePriceRatesStore } from "stores/priceRatesData"
import { twMerge } from "tailwind-merge"
import { sortByRatingScore, sortByReviewCount } from "utils/tableHelpers"

type Props = {
  isCollectionPage?: boolean
  trendingProducts?: ITrendingProducts[]
}

export type ITableOrders = "none" | "asc" | "desc"

const LandingHotAndTrendingTable = ({
  isCollectionPage = false,
  trendingProducts = []
}: Props) => {
  const router = useRouter()

  const [trendingProductsState, setTrendingProductsState] =
    useState<ITrendingProducts[]>(trendingProducts)

  const [ratingScoreOrder, setRatingScoreOrder] = useState<ITableOrders>("none")
  const [reviewCountOrder, setReviewCountOrder] = useState<ITableOrders>("none")

  const {
    pairData: { basePrice }
  } = usePriceRatesStore()

  const navigateToDetailsPage = (productSlug = "") => {
    if (productSlug) router.push(`/product/${productSlug}`)
  }

  const onRatingScoreHeaderClick = () => {
    const sortedArray = sortByRatingScore(
      trendingProductsState,
      ratingScoreOrder === "desc"
    )
    setTrendingProductsState(sortedArray)
    setRatingScoreOrder((curr) => (curr === "desc" ? "asc" : "desc"))
  }

  const onReviewCountHeaderClick = () => {
    const sortedArray = sortByReviewCount(
      trendingProductsState,
      reviewCountOrder === "desc"
    )
    setTrendingProductsState(sortedArray)
    setReviewCountOrder((curr) => (curr === "desc" ? "asc" : "desc"))
  }

  return (
    <div className="overflow-x-auto pb-5">
      <table className="min-w-full table-auto landingTables">
        <thead>
          <tr className="h-[50px] md:h-[80px] text-xs  font-medium text-neutral-400">
            <th className="hidden md:w-[5%] min-[800px]:table-cell"></th>
            <th className="w-[1%] md:w-[10%]">Rank</th>
            <th className="w-[45%] pl-2  md:pl-6 text-left md:w-[20%]">
              Product Name
            </th>
            <th
              className={twMerge(
                "w-[9%] text-center  min-[850px]:table-cell cursor-pointer",
                isCollectionPage
                  ? "cursor-pointer pointer-events-auto"
                  : "pointer-events-none"
              )}
              onClick={onRatingScoreHeaderClick}
            >
              <div className="flex flex-row gap-2 justify-end items-center">
                <div>Rating Score</div>
                {isCollectionPage && (
                  <SortOrderIcon selectedFilterVariant={ratingScoreOrder} />
                )}
              </div>
            </th>

            <th
              className={twMerge(
                "w-[12%] text-right  hidden  min-[930px]:table-cell cursor-pointer",
                isCollectionPage
                  ? "cursor-pointer pointer-events-auto"
                  : "pointer-events-none"
              )}
              onClick={onReviewCountHeaderClick}
            >
              <div className="flex flex-row gap-2 justify-end items-center">
                <div>Review Count</div>
                {isCollectionPage && (
                  <SortOrderIcon selectedFilterVariant={reviewCountOrder} />
                )}
              </div>
            </th>
            {/* <th className="w-[10%] text-center hidden min-[1150px]:table-cell ">
              Reviewers
            </th> */}
            <th className="w-[12%] text-right hidden md:table-cell ">
              Earnings
            </th>
            <th className="w-[12%] text-right hidden min-[1150px]:table-cell ">
              Subscriber Count
            </th>
            <th className="w-[20%] md:w-[25%] hidden min-[850px]:table-cell">
              Stars
            </th>
          </tr>
        </thead>
        <tbody>
          {trendingProductsState?.map((productItem, idx) => (
            <tr
              key={`landingTable-${idx}`}
              className="h-[60px] md:h-[80px]  hover:bg-white hover:shadow-md  transition-all cursor-pointer overflow-hidden"
              onClick={() => navigateToDetailsPage(productItem?.slug)}
            >
              <td className="hidden min-[800px]:table-cell ">
                <MedalTableItem index={idx} />
              </td>
              <td className="text-center">
                <RankTableItem value={productItem.rank ?? idx} />
              </td>
              <td className="md:pl-6 overflow-hidden">
                <ProductNameTableItem
                  name={productItem?.name}
                  subcategories={productItem?.subcategories}
                  image={productItem?.logo}
                />
              </td>
              <td className="text-right">
                {
                  <NumberValueTableItem
                    value={productItem?.ratingScore}
                    variant="ratingScore"
                  />
                }
              </td>

              <td className="text-right hidden min-[930px]:table-cell ">
                {/* <ProfileUpvoteTableItem /> */}
                {
                  <NumberValueTableItem
                    value={Math.round(productItem?.reviewCount ?? 0)}
                    hideDecimals
                  />
                }
              </td>
              {/* <td className="text-center hidden min-[1150px]:table-cell ">
                {<NumberValueTableItem />}
              </td> */}
              <td className="text-right hidden md:table-cell">
                <RewardsTableItem
                  rewards={productItem?.rewards}
                  basePrice={basePrice}
                />
              </td>
              <td className="text-right  hidden min-[1150px]:table-cell ">
                {
                  <NumberValueTableItem
                    hideDecimals
                    value={productItem?.subscriberCount}
                  />
                }
              </td>
              <td className="text-center hidden min-[850px]:table-cell">
                <ProductRatingTableItem ratings={productItem?.ratings} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LandingHotAndTrendingTable
