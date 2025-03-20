export type IRatingOverview = {
  status: string
  avg: number
  categoryRating: ICategoryRating[]
}

export type ICategoryRating = {
  _id: number
  ratingSum: number
  count: number
}

export const initialRatingData: IRatingOverview = {
  status: "init",
  avg: 0,
  categoryRating: []
}
