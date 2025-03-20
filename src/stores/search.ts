/* eslint-disable @typescript-eslint/no-explicit-any */
import { cancelRequestAxios } from "utils/cancleRequest"
import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { api } from "./user"

interface Search {
  _id: string
  name: string
  profilePicture?: string
  username?: string
  bio?: string
  type: 'user' | 'product'
  category?: {
    _id: string
    name: string
  }
  description?: string
  slug?: string
  logo?: string
}

interface SearchState {
  loading: boolean
  error: string
  results: {
    page: number
    limit: number
    total: number
    results: Search[] | never[]
  }
  getSearchResults: ({
    query,
    page,
    type,
    append
  }: {
    query?: string
    page?: number
    type?: string
    append?: boolean
  }) => Promise<any>
}

const initialState = {
  loading: false,
  error: "",
  results: {
    page: 0,
    limit: 0,
    total: 0,
    results: []
  }
}

const cancelRequestAxiosObject = new cancelRequestAxios()

export const useSearchStore = create<SearchState>()(
  devtools((set, get) => ({
    ...initialState,
    getSearchResults: async ({
      query = "",
      page = 1,
      type = "all",
      append = false
    }) => {
      try {
        set({ loading: true })
        cancelRequestAxiosObject.cancelAndCreateToken()
        const { data } = await api.get(`/search`, {
          params: {
            query,
            page,
            type,
            limit: 10
          },
          cancelToken: cancelRequestAxiosObject.cancelRequest.token
        })
        cancelRequestAxiosObject.resetCancelToken()
        // console.debug(data)
        set({
          results: {
            ...data.data,
            results: append
              ? [...get().results.results, ...(data?.data?.results || [])]
              : (data?.data?.results || [])
          },
          loading: false
        })
      } catch (error: any) {
        set({ error: error.message, loading: false })
      }
    }
  }))
)
