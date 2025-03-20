/* eslint-disable @typescript-eslint/no-explicit-any */
import { backendUrls } from "constants/backendUrls"
import { UserMeta } from "interfaces/user"
import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { api } from "./user"
interface ProductMeta {
  _id: string
  slug: string
  name: string
  category: string
  description: string
  logo?: string
}

export interface Review {
  _id: string
  review: string
  title?: string
  createdBy: UserMeta
  isFlagged: boolean
  isUpVoted: boolean
  isDownVoted: boolean
  isUserFlagged: boolean
  upVotes: number
  downVotes: number
  flagCount: number
  createdAt: string
  updatedAt: string
  product: ProductMeta
  rating: number
  pros: string[]
  cons: string[]
}

interface IReviewFieldData {
  page: number
  limit: number
  total: number
  reviews: Review[] | never[]
}

interface IGenericReviewActionProps {
  page?: number
  append?: boolean
  user?: string
}

interface ReviewState {
  loading: boolean
  error: string
  reviews: IReviewFieldData
  myReviews: IReviewFieldData
  myVotes: IReviewFieldData
  myFlags: IReviewFieldData
}

interface ReviewActions {
  createReview: (data: any) => Promise<any>
  getReviews: (
    productId?: string,
    currentUser?: string,
    page?: number,
    append?: boolean
  ) => Promise<any>
  getMyReviews: (props: IGenericReviewActionProps) => Promise<any>
  getMyVotes: (props: IGenericReviewActionProps) => Promise<any>
  getMyFlags: (props: IGenericReviewActionProps) => Promise<any>
  voteReview: (reviewId: string, vote: number) => Promise<boolean>
  editReviewState: (reviewId: string, data: any) => void
  editMyReviewState: (reviewId: string, data: any) => void
  editMyVoteState: (reviewId: string, data: any) => void
  editMyFlagState: (reviewId: string, data: any) => void
  flagReview: (reviewId: string) => Promise<boolean>
  deleteReview: (reviewId: string) => Promise<boolean>
}

const initialFieldData: IReviewFieldData = {
  page: 0,
  limit: 0,
  total: 0,
  reviews: []
}

const initialState = {
  loading: false,
  error: "",
  reviews: initialFieldData,
  myReviews: initialFieldData,
  myVotes: initialFieldData,
  myFlags: initialFieldData
}

export const useReviewStore = create<ReviewState & ReviewActions>()(
  devtools((set, get) => ({
    ...initialState,
    createReview: async ({
      data,
      productId
    }: {
      data: any
      productId: string
    }) => {
      try {
        set({ loading: true })
        const { data: response } = await api.post(
          backendUrls.postProductReviews(productId),
          data
        )
        set({ loading: false })
        return response
      } catch (err: any) {
        set({ error: err.message, loading: false })
        return false
      }
    },
    getReviews: async (
      productId,
      currentUser = "",
      page = 1,
      append = false
    ) => {
      try {
        set({ loading: true })
        const { data: response } = await api.get(
          productId
            ? backendUrls.getProductReviews(productId)
            : backendUrls.getReviews,
          {
            params: {
              currentUser,
              page,
              limit: 10
            }
          }
        )
        // console.debug(response)
        set({
          reviews: {
            ...response.data,
            reviews: append
              ? [...get().reviews.reviews, ...response.data.reviews]
              : response.data.reviews
          },
          loading: false
        })
      } catch (err: any) {
        set({ error: err.message, loading: false })
      }
    },
    getMyReviews: async (props) => {
      try {
        set({ loading: true })
        const { data: response } = await api.get(backendUrls.getMyReviews, {
          params: {
            page: props?.page || 1,
            limit: 9,
            user: props?.user || ""
          }
        })
        // console.debug(response)
        set({
          myReviews: {
            ...response.data,
            reviews: props?.append
              ? [...get().myReviews.reviews, ...response.data.reviews]
              : response.data.reviews
          },
          loading: false
        })
      } catch (err: any) {
        set({ error: err.message, loading: false })
      }
    },
    getMyVotes: async (props) => {
      try {
        set({ loading: true })
        const { data: response } = await api.get(backendUrls.getMyVotes, {
          params: {
            page: props?.page || 1,
            limit: 9,
            user: props?.user || ""
          }
        })
        // console.debug(response)
        set({
          myVotes: {
            ...response.data,
            reviews: props?.append
              ? [...get().myVotes.reviews, ...response.data.reviews]
              : response.data.reviews
          },
          loading: false
        })
      } catch (err: any) {
        set({ error: err.message, loading: false })
      }
    },
    getMyFlags: async (props) => {
      try {
        set({ loading: true })
        const { data: response } = await api.get(backendUrls.getMyFlags, {
          params: {
            page: props?.page || 1,
            limit: 9,
            user: props?.user || ""
          }
        })
        // console.debug(response)
        set({
          myFlags: {
            ...response.data,
            reviews: props?.append
              ? [...get().myFlags.reviews, ...response.data.reviews]
              : response.data.reviews
          },
          loading: false
        })
      } catch (err: any) {
        set({ error: err.message, loading: false })
      }
    },
    voteReview: async (reviewId: string, vote: number) => {
      try {
        set({ loading: true })
        await api.post(
          backendUrls.postVoteReview(reviewId),
          {
            vote
          }
        )
        // console.debug(response)
        set({ loading: false })
        return true
      } catch (err: any) {
        set({ error: err.message, loading: false })
        return false
      }
    },
    editReviewState: (reviewId: string, data: any) => {
      let review = get().reviews.reviews.find(
        (review) => review._id === reviewId
      )
      review = { ...review, ...data }
      set({
        reviews: {
          ...get().reviews,
          reviews: get().reviews.reviews.map((item) =>
            item._id !== reviewId ? item : review || item
          )
        }
      })
    },
    editMyReviewState: (reviewId: string, data: any) => {
      let review = get().myReviews.reviews.find(
        (review) => review._id === reviewId
      )
      review = { ...review, ...data }
      set({
        myReviews: {
          ...get().myReviews,
          reviews: get().myReviews.reviews.map((item) =>
            item._id !== reviewId ? item : review || item
          )
        }
      })
    },
    editMyVoteState: (reviewId: string, data: any) => {
      let review = get().myVotes.reviews.find(
        (review) => review._id === reviewId
      )
      review = { ...review, ...data }
      set({
        myVotes: {
          ...get().myVotes,
          reviews: get().myVotes.reviews.map((item) =>
            item._id !== reviewId ? item : review || item
          )
        }
      })
    },
    editMyFlagState: (reviewId: string, data: any) => {
      let review = get().myFlags.reviews.find(
        (review) => review._id === reviewId
      )
      review = { ...review, ...data }
      set({
        myFlags: {
          ...get().myFlags,
          reviews: get().myFlags.reviews.map((item) =>
            item._id !== reviewId ? item : review || item
          )
        }
      })
    },
    flagReview: async (reviewId: string) => {
      try {
        set({ loading: true })
        await api.post(
          backendUrls.postFlagReview(reviewId)
        )
        // console.debug(response)
        set({ loading: false })
        return true
      } catch (err: any) {
        set({ error: err.message, loading: false })
        return false
      }
    },
    deleteReview: async (reviewId: string) => {
      try {
        set({ loading: true })
        await api.delete(
          backendUrls.deleteReview(reviewId)
        )
        // console.debug(response)
        set({ loading: false })
        return true
      } catch (err: any) {
        set({ error: err.message, loading: false })
        return false
      }
    }
  }))
)