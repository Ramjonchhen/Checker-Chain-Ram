import { Dispatch, SetStateAction } from "react"
import { BronzeMedal, GoldMedal, SilverMedal } from "assets/icons/medals"
import RatingStarView from "components/ratingStar/RatingStarView"
import {
  RankDecrease,
  RankIncrease,
  RankNoChange,
  UsersIcon,
  ReviewStarIcon,
  PositiveStockIcon,
  NegativeStockIcon
} from "assets/icons"
import { twMerge } from "tailwind-merge"
import { ITimeFilter } from "../landing/components/landingTables/LandingTablesSection"
import { getBaseBackendImageUrl } from "utils"
import { abbreviateNumber } from "utils/getLiquidityInfo"
import { getOrdinalSuffix } from "utils/helper"

export const COLLECTION_TABS = {
  hotTrending: "hotTrending",
  topReviewers: "topReviewers"
} as const

export const TIME_FILTERS = {
  allTime: "All Time",
  twentyFourHour: "24h"
} as const

const getMedals = (rank: number) => {
  switch (rank) {
    case 0:
      return <GoldMedal />
    case 1:
      return <SilverMedal />
    case 2:
      return <BronzeMedal />
    default:
      return ""
  }
}

// up down icons // unsued
export const getIconsBasedOnRank = (rankDifference: number) => {
  if (rankDifference > 0) {
    return <RankIncrease />
  } else if (rankDifference < 0) {
    return <RankDecrease />
  } else {
    return <RankNoChange />
  }
}

const MedalTableItem = ({ index }: { index: number }) => {
  return <div className="flex justify-end">{getMedals(index)}</div>
}

const RankTableItem = ({ value }: { value: number }) => {
  return (
    <div className="flex justify-start md:justify-center flex-row gap-1 md:gap-3 items-center">
      {/* {<div> {getIconsBasedOnRank(3 - 2)}</div>} */}
      {/* <div> {getIconsBasedOnRank(data.previousRank - data.rank)}}</div> */}
      <div className="text-xs md:text-base font-semibold text-neutral-600">
        {value + getOrdinalSuffix(value)}
      </div>
    </div>
  )
}

const ProductNameTableItem = ({
  className = "",
  name = "",
  subcategories = [],
  image = ""
}: {
  className?: string
  name?: string
  subcategories?: string[]
  image?: string
}) => {
  return (
    <div
      className={twMerge(
        // "flex flex-grow-0 flex-row items-center gap-1 md:gap-3  ",
        "flex flex-grow-0 flex-row items-center gap-1 md:gap-3  w-[190px] min-[470px]:w-[210px] min-[550px]:w-[310px] lg:w-[380px]",
        className
      )}
    >
      <div className="h-10 md:h-12 aspect-square rounded-lg overflow-hidden flex-shrink-0">
        <img
          alt=""
          src={getBaseBackendImageUrl(image)}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="w-full truncate">
        <div className="text-xs md:text-base font-semibold text-neutral-700 w-full truncate flex-grow-0">
          {name}
        </div>
        <div className="text-[9px] md:text-[10px] font-medium tracking-[0.2px] text-neutral-200 truncate">
          {subcategories.slice(0, 2).map((subCategoryItem) => (
            <span className="mr-1" key={subCategoryItem}>
              {subCategoryItem}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

const findRatingBgColor = (
  score = 0,
  variant: "ratingScore" | "profileScore" = "ratingScore"
) => {
  if (variant === "ratingScore") {
    if (score >= 4 && score <= 5) {
      return "bg-[#009B68]"
    } else if (score >= 3 && score < 4) {
      return "bg-[#73CF11]"
    } else if (score >= 2 && score < 3) {
      return "bg-[#EBBE00]"
    } else if (score >= 1 && score < 2) {
      return "bg-[#FF8622]"
    } else return "bg-[#FF3722]"
  } else {
    if (score >= 80 && score <= 100) {
      return "bg-[#009B68]"
    } else if (score >= 60 && score < 80) {
      return "bg-[#73CF11]"
    } else if (score >= 40 && score < 60) {
      return "bg-[#EBBE00]"
    } else if (score >= 20 && score < 40) {
      return "bg-[#FF8622]"
    } else return "bg-[#FF3722]"
  }
}

const NumberValueTableItem = ({
  value = 0,
  hideDecimals = false,
  variant = "none"
}: {
  value?: number
  hideDecimals?: boolean
  showBgColor?: boolean
  variant?: "none" | "ratingScore" | "profileScore"
}) => {
  return (
    <div
      className={twMerge(
        "text-xs md:text-base font-semibold text-neutral-900",
        variant != "none" && "w-fit ml-auto px-2 py-1 text-white rounded-md",
        variant != "none" && findRatingBgColor(value, variant)
      )}
    >
      {hideDecimals ? parseInt(`${value}`) : abbreviateNumber(value)}
    </div>
  )
}

const RewardsTableItem = ({
  rewards = 0,
  basePrice = 0
}: {
  rewards?: number
  basePrice?: number
}) => {
  return (
    <div className="flex flex-col">
      <div className="text-base font-semibold text-neutral-900">
        ${abbreviateNumber(basePrice * rewards)}
      </div>
      <div className="text-xs font-medium text-neutral-200">
        ≈{abbreviateNumber(rewards)} CHECKR
      </div>
    </div>
  )
}

const ProductRatingTableItem = ({ ratings = 0 }: { ratings?: number }) => {
  return (
    <div className="flex justify-center " title={ratings?.toFixed(2)}>
      <RatingStarView
        rating={ratings}
        noBackground
        activeStarClassName="text-[#FFCE00] h-4 w-4 md:h-5 md:w-5"
        disabledStarClassName="text-[#BABABA]  h-4 w-4 md:h-5 md:w-5"
        containerClassName="gap-0 md:gap-1"
      />
    </div>
  )
}

const ReviewerNameTableItem = ({
  actualReviewCount = 0,
  name = "",
  following = 0,
  profilePicture = ""
}: {
  following?: number
  name?: string
  actualReviewCount?: number
  profilePicture?: string
}) => {
  return (
    <div className="flex flex-row items-center gap-2 md:gap-3  w-[190px] min-[470px]:w-[210px] min-[550px]:w-[310px] lg:w-[380px]">
      <div className="h-10 md:h-12 aspect-square rounded-lg overflow-hidden flex-shrink-0">
        <img
          alt=""
          src={getBaseBackendImageUrl(profilePicture, "avatar")}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="truncate ">
        <div className="text-xs md:text-base font-semibold text-neutral-700 truncate">
          {name}
        </div>
        <div className="flex flex-row items-center gap-1 md:gap-2">
          <div className="flex items-center gap-[2px] md:gap-[6px]">
            <div>
              <UsersIcon className="w-3 h-3 md:w-4 md:h-4" />
            </div>
            <div className="text-[9px] md:text-[10px] leading-[14px] tracking-[0.2px] font-normal text-neutral-400">
              <span className="font-semibold">{following}</span> Following
            </div>
          </div>
          <div className="flex items-center gap-[2px] md:gap-[6px]">
            <div>
              <ReviewStarIcon className="w-3 h-3 md:w-4 md:h-4 text-[#484848]" />
            </div>
            <div className="text-[9px] md:text-[10px] leading-[14px] tracking-[0.2px] font-normal text-neutral-400">
              <span className="font-semibold">{actualReviewCount}</span>{" "}
              Feedbacks
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

//not used
export const getUpvotesStyle = (isPositive: boolean) => {
  if (isPositive)
    return {
      icon: <PositiveStockIcon />,
      textColor: "text-[#009B68]",
      bgColor: "bg-[#E2F8E8]"
    }
  return {
    icon: <NegativeStockIcon />,
    textColor: "text-[#FF3722]",
    bgColor: "bg-primary-50"
  }
}

//refactor later
type Props = {
  isPositive?: boolean
  value?: number
}
const ProfileUpvoteTableItem = ({ value = 0 }: Props) => {
  // const { icon, bgColor, textColor } = getUpvotesStyle(isPositive)
  return (
    <div className="flex justify-end ">
      <div className="flex flex-row items-center gap-2">
        <div className="text-sm md:text-base font-semibold text-neutral-900 leading-normal">
          {value > 1000 ? abbreviateNumber(value) : value}
        </div>
        {/* <div
          className={twMerge(
            "flex flex-row items-center px-3 py-[2px] rounded-2xl gap-1",
            bgColor
          )}
        >
          <div
            className={twMerge(
              "text-[11px] font-medium leading-normal",
              textColor
            )}
          >
            12%
          </div>
          <div>{icon}</div>
        </div> */}
      </div>
    </div>
  )
}

const filters: ITimeFilter[] = [
  TIME_FILTERS.allTime,
  TIME_FILTERS.twentyFourHour
]

const TimeFilterButtonGroup = ({
  selectedTimeFilter,
  setTimeFilter
}: {
  selectedTimeFilter: ITimeFilter
  setTimeFilter: Dispatch<SetStateAction<ITimeFilter>>
}) => {
  return (
    <div className="flex flex-row hidden">
      {filters.map((filter, idx) => {
        return (
          <div
            key={filter}
            className={twMerge(
              "px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm font-semibold border cursor-pointer grid place-items-center text-center",
              selectedTimeFilter === filter
                ? "text-neutral-700 bg-secondary-50"
                : "text-neutral-600 opacity-80",
              idx === 0 ? "rounded-s-lg" : "rounded-e-lg"
            )}
            onClick={() => setTimeFilter(filter)}
          >
            {filter}
          </div>
        )
      })}
    </div>
  )
}

export {
  MedalTableItem,
  ProductNameTableItem,
  NumberValueTableItem,
  RewardsTableItem,
  ProductRatingTableItem,
  RankTableItem,
  ReviewerNameTableItem,
  ProfileUpvoteTableItem,
  TimeFilterButtonGroup
}
