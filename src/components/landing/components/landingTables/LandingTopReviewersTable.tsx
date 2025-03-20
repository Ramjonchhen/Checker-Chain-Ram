import SortOrderIcon from "assets/icons/SortOrderIcon"
import {
  NumberValueTableItem,
  RewardsTableItem,
  MedalTableItem,
  RankTableItem,
  ProfileUpvoteTableItem,
  ReviewerNameTableItem
} from "components/table/TableItems"
import { ITrendingReviewers } from "interfaces/trending"
import { useRouter } from "next/router"
import { useState } from "react"
import { usePriceRatesStore } from "stores/priceRatesData"
import { twMerge } from "tailwind-merge"
import { sortByProfileScore, sortByReviewCount } from "utils/tableHelpers"

type Props = {
  trendingReviewersData: ITrendingReviewers[]
  isCollectionPage?: boolean
}

type ITableOrders = "none" | "asc" | "desc"

const LandingTopReviewersTable = ({
  trendingReviewersData = [],
  isCollectionPage = false
}: Props) => {
  const router = useRouter()
  const {
    pairData: { basePrice }
  } = usePriceRatesStore()
  const navigateToProfilePage = (profileSlug = "") => {
    if (profileSlug) router.push(`/user/${profileSlug}`)
  }

  const [trendingReviewersState, setTrendingReviewersState] = useState<
    ITrendingReviewers[]
  >(trendingReviewersData)

  const [profileScoreOrder, setProfileScoreOrder] =
    useState<ITableOrders>("none")
  const [reviewCountOrder, setReviewCountOrder] = useState<ITableOrders>("none")

  const onProfileScoreHeaderClick = () => {
    const sortedArray = sortByProfileScore(
      trendingReviewersState,
      profileScoreOrder === "desc"
    )
    setTrendingReviewersState(sortedArray)
    setProfileScoreOrder((curr) => (curr === "desc" ? "asc" : "desc"))
  }

  const onReviewCountHeaderClick = () => {
    const sortedArray = sortByReviewCount(
      trendingReviewersState,
      reviewCountOrder === "desc"
    )
    setTrendingReviewersState(sortedArray)
    setReviewCountOrder((curr) => (curr === "desc" ? "asc" : "desc"))
  }

  return (
    <div className="overflow-x-auto pb-5">
      <table className="min-w-full table-auto landingTables">
        <thead>
          <tr className="h-[50px] md:h-[80px] text-xs  font-medium text-neutral-400">
            <th className="hidden md:w-[4%] min-[800px]:table-cell"></th>

            <th className="w-[1%] md:w-[7.6%]">Rank</th>
            <th className="w-[45%] pl-2  md:pl-6 text-left md:w-[20%]">
              Reviewer Name
            </th>
            <th
              className={twMerge(
                "w-[9%] text-center ",
                isCollectionPage
                  ? "cursor-pointer pointer-events-auto"
                  : "pointer-events-none"
              )}
              onClick={onProfileScoreHeaderClick}
            >
              <div className="flex flex-row gap-2 justify-end items-center">
                <div>Profile Score</div>
                {isCollectionPage && (
                  <SortOrderIcon selectedFilterVariant={profileScoreOrder} />
                )}
              </div>
            </th>
            <th
              className={twMerge(
                "w-[12%] text-right  hidden min-[930px]:table-cell cursor-pointer",
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
            <th className="w-[12%] text-right hidden min-[800px]:table-cell ">
              Earnings
            </th>
            <th className="w-[10%] text-right hidden min-[1150px]:table-cell ">
              Follower Count
            </th>
            <th className="w-[10%]  text-right pr-4 hidden min-[850px]:table-cell ">
              Upvotes
            </th>
            {/* <th className="w-[14%] md:w-[25%]  text-center pr-4">Upvotes</th> */}
          </tr>
        </thead>
        <tbody>
          {trendingReviewersState?.map((reviewerItem, idx) => (
            <tr
              key={`landingTable-${idx}`}
              className="h-[60px] md:h-[80px]  hover:bg-white hover:shadow-md  transition-all cursor-pointer overflow-hidden"
              onClick={() => navigateToProfilePage(reviewerItem?.username)}
            >
              <td className="hidden min-[800px]:table-cell ">
                <MedalTableItem index={idx} />
              </td>
              <td className="text-center">
                <RankTableItem value={reviewerItem?.rank ?? 0} />
              </td>
              <td className="md:pl-6 overflow-hidden">
                <ReviewerNameTableItem
                  actualReviewCount={reviewerItem?.actualReviewCount}
                  following={reviewerItem?.following}
                  name={reviewerItem?.name}
                  profilePicture={reviewerItem?.profilePicture}
                />
              </td>
              <td className="text-right  ">
                {
                  <NumberValueTableItem
                    value={reviewerItem?.profileScore}
                    variant="profileScore"
                  />
                }
              </td>
              <td className="text-right hidden  min-[930px]:table-cell">
                <NumberValueTableItem
                  value={reviewerItem?.reviewCount}
                  hideDecimals
                />
              </td>
              {/* <td className="text-center hidden min-[1150px]:table-cell ">
                {<NumberValueTableItem />}
              </td> */}
              <td className="text-right hidden min-[800px]:table-cell">
                <RewardsTableItem
                  rewards={reviewerItem?.reward}
                  basePrice={basePrice}
                />
              </td>
              <td className="text-right  hidden min-[1150px]:table-cell ">
                {
                  <NumberValueTableItem
                    value={reviewerItem?.follower}
                    hideDecimals
                  />
                }
              </td>
              <td className="text-right w-fit pr-4 hidden min-[850px]:table-cell ">
                <ProfileUpvoteTableItem value={reviewerItem?.totalVotes} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LandingTopReviewersTable
