import { IUserStatus } from "modules/profile/components/BasicInformation/ProfileStatus"
import { ICategoryRating } from "modules/product/components/ratingOverview"
import { Address } from "lib/dApp-js"
import keccak256 from "keccak256"
import { Reward } from "stores/rewards"

export const findUserCompletedSteps = (userStatus: IUserStatus[]): number => {
  return userStatus.reduce((total, currentVal) => {
    if (currentVal.value) return (total = total + 1)
    else total = total
    return total
  }, 0)
}

export const findUserCompletedPercentage = (
  userStatus: IUserStatus[]
): number =>
  Math.ceil((findUserCompletedSteps(userStatus) / userStatus.length) * 100)

export const ascendingOrderCompletedUserStatus = (userStatus: IUserStatus[]) =>
  [...userStatus].sort((a, b) => (b.value ? 1 : -1))

export const noEmptyStrings = (arr: string[]) => {
  return arr.filter((str) => /\S/.test(str))
}

export const getCategoryRatingArray = (categoryRating: ICategoryRating[]) => {
  const starsNumber = [5, 4, 3, 2, 1] as const

  let returnArray: ICategoryRating[] = [] as ICategoryRating[]

  starsNumber.forEach((starNumber) => {
    returnArray = [
      ...returnArray,
      {
        _id: starNumber,
        ratingSum:
          categoryRating.find((item) => item._id === starNumber)?.ratingSum ??
          0,
        count:
          categoryRating.find((item) => item._id === starNumber)?.count ?? 0
      }
    ]
  })
  return returnArray
}

export const caluclateTotalCountSum = (categoryRating: ICategoryRating[]) => {
  let totalCountSum = 0
  categoryRating?.forEach((rating) => {
    // _id:0, we don't count those ratings
    if (rating._id !== 0) totalCountSum = totalCountSum + rating?.count ?? 0
  })
  return totalCountSum
}

export const calculateRatingAvg = (categoryRating: ICategoryRating[]) => {
  let totalCount = 0
  let totalSum = 0

  categoryRating?.forEach((rating) => {
    // _id:0, we don't count those ratings
    if (rating._id !== 0) {
      totalCount = totalCount + rating.count
      totalSum = totalSum + rating.ratingSum
    }
  })

  const ratingAvg = totalSum / totalCount

  return isNaN(ratingAvg) ? 0 : ratingAvg
}

export const cutAfterInputDecimalPlaces = (
  str: string | number,
  inputDecimalPlace: number
) => {
  str = str.toString()
  str = str.indexOf(".") >= 0 ? str.slice(0, str.indexOf(".") + inputDecimalPlace + 1) : str
  return Number(str)
}

export const largeNumberFormater = (numData: number) =>
  Intl.NumberFormat("en", {
    notation: "compact"
  }).format(numData)

export const extractXcharactersFromText = ({
  text = "",
  startCount = 0,
  endCount = 0
}: {
  text: string
  startCount: number
  endCount: number
}) => text.slice(startCount, endCount)

export function getMultipleUniqueRandomItemsFromArray<T>(
  arr: T[] = [],
  count: number
): T[] {
  if (arr.length < 1) return []
  let sortCount = count;

  if (arr.length < count) {
    sortCount = arr.length
  }

  const shuffled = [...arr].sort(() => 0.5 - Math.random())

  return shuffled.slice(0, sortCount)
}

export function findHighestRatingObject(
  arr: ICategoryRating[]
): ICategoryRating {
  let highestCategoryRating: ICategoryRating = {
    _id: 0,
    ratingSum: 0,
    count: 0
  }

  for (const obj of arr) {
    if (
      obj.count > 0 &&
      (highestCategoryRating === null || obj._id > highestCategoryRating._id)
    ) {
      highestCategoryRating = obj
    }
  }

  return highestCategoryRating
}

export function numberToHex(el: string) {
  const h = Number(el).toString(16)
  if (h === "0") return '0'
  return h.length % 2 === 0 ? h : `0${h}`
}

export function getVestingIdHashedData({
  wallet,
  index
}: {
  wallet: string
  index: string
}) {
  const buf = Buffer.concat([
    Buffer.from(new Address(wallet).hex(), "hex"),
    Buffer.from(numberToHex(index), "hex")
  ])
  const uint8Array = keccak256(buf);
  return uint8Array.toString("hex")
  // return Buffer.from(keccak256(buf), "hex")
}

export const calculateUnlockedAmountVesting = (
  cliff: number,
  amount_total: number,
  duration: number,
  released: number
) => {
  const epochData = JSON.parse(localStorage.getItem("epochData") || "{}") || {
    shards: 3,
    blocks: 22576288,
    accounts: 141054,
    transactions: 22801451,
    scResults: 15449845,
    refreshRate: 6000,
    epoch: 4695,
    roundsPassed: 1152,
    roundsPerEpoch: 1200,
    currentTimestamp: Date.now()
  }
  const { roundsPerEpoch, roundsPassed, refreshRate, currentTimestamp } =
    epochData

  const currentEpochStartTimestamp =
    currentTimestamp - roundsPassed * refreshRate

  const epochDuration = roundsPerEpoch * refreshRate

  const unlockedTimestamp =
    currentEpochStartTimestamp > cliff ? currentEpochStartTimestamp - cliff : 0

  let unlockedAmount =
    (unlockedTimestamp / (epochDuration * 200)) * amount_total
  if (unlockedAmount > amount_total) unlockedAmount = amount_total

  let unlockedDaysDiff = Math.floor(unlockedTimestamp / epochDuration)
  if (unlockedDaysDiff > duration) unlockedDaysDiff = duration

  let progressPercent = (unlockedDaysDiff / duration) * 100
  if (progressPercent > 100) progressPercent = 100
  unlockedAmount = unlockedAmount > released ? unlockedAmount - released : 0
  if (progressPercent < 100) unlockedAmount = unlockedAmount - 0.01
  if (unlockedAmount < 0) unlockedAmount = 0
  return {
    unlockedAmount,
    progressPercent,
    currentEpoch: unlockedDaysDiff,
    epochDuration
  }
}

export const calculateOrdinal = (epoch: number) => {
  const j = epoch % 10,
    k = epoch % 100
  if (j === 1 && k !== 11) {
    return `${epoch}st`
  }
  if (j === 2 && k !== 12) {
    return `${epoch}nd`
  }
  if (j === 3 && k !== 13) {
    return `${epoch}rd`
  }
  return `${epoch}th`
}

export function extractPartsSeperatedByColon(text: string) {
  const colonIndex = text.indexOf(":")
  if (colonIndex === -1) {
    return ["", ""] // if there's no colon in the string, return an array with two empty strings
  }
  const beforeColon = text.slice(0, colonIndex).trim() // extract the text before the colon and trim any leading or trailing whitespace
  const afterColon = text.slice(colonIndex + 1).trim() // extract the text after the colon and trim any leading or trailing whitespace
  return [beforeColon, afterColon]
}

export function extractPartsSeperatedByCommas(text: string) {
  return text.split(",").map((item) => item.trim())
}


export function getOrdinalSuffix(i: number) {
  const j = i % 10;
  const k = i % 100;
  if (j == 1 && k != 11) {
    return "st";
  }
  if (j == 2 && k != 12) {
    return "nd";
  }
  if (j == 3 && k != 13) {
    return "rd";
  }
  return "th";
}


export const findTotalClaimableRewards = (allRewards: Reward[], basePrice = 0) => {
  let totalClaimableCheckr = 0
  let totalAmountInDollars = 0;


  allRewards?.forEach((rewardItem) => {
    if (!rewardItem.claimed) {
      totalClaimableCheckr = totalClaimableCheckr + rewardItem.amount / 1e5
    }
  })
  totalAmountInDollars = totalAmountInDollars + Number(basePrice * totalClaimableCheckr)

  return { totalClaimableCheckr, totalAmountInDollars }
}


export const noOp = () => { }