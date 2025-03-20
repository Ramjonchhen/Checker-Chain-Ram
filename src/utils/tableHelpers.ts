import { ITrendingProducts, ITrendingReviewers } from "interfaces/trending";

export const sortByReviewCount = <T extends ITrendingProducts | ITrendingReviewers>(
    inputArray: T[],
    ascendingOrder: boolean
): T[] => {
    const sortedArray = inputArray.sort((a, b) => {
        const ratingA = a?.reviewCount || 0
        const ratingB = b?.reviewCount || 0
        const comparison = ascendingOrder ? 1 : -1
        return (ratingA - ratingB) * comparison
    })
    return sortedArray
}


export const sortByRatingScore = (inputArray: ITrendingProducts[], ascendingOrder: boolean) => {
    const sortedArray = inputArray.sort((a, b) => {
        const ratingA = a?.ratingScore || 0
        const ratingB = b?.ratingScore || 0
        const comparison = ascendingOrder ? 1 : -1
        return (ratingA - ratingB) * comparison
    })
    return sortedArray
}


export const sortByProfileScore = (inputArray: ITrendingReviewers[], ascendingOrder: boolean) => {
    const sortedArray = inputArray.sort((a, b) => {
        const ratingA = a?.profileScore || 0
        const ratingB = b?.profileScore || 0
        const comparison = ascendingOrder ? 1 : -1
        return (ratingA - ratingB) * comparison
    })
    return sortedArray
}
