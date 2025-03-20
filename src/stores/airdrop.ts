/* eslint-disable @typescript-eslint/no-explicit-any */
import { AirDrop } from "modules/product/airdrop/AirdropList"
import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { api } from "./user"

interface GetAirdropProps {
  id: string
  wallet: string
}

interface AirdropState {
  loading: boolean
  singleLoading: boolean
  error: string
  airdrops: {
    page: number
    limit: number
    total: number
    airdrops: AirDrop[] | never[]
  }
  createAirdrop: (data: any) => Promise<any>
  getAirdrops: (
    productId?: string,
    page?: number,
    append?: boolean
  ) => Promise<any>
  getAirdrop: (data: GetAirdropProps) => Promise<any>
}

const initialState = {
  singleLoading: false,
  loading: false,
  error: "",
  airdrops: {
    page: 0,
    limit: 10,
    total: 0,
    airdrops: []
  }
}

export const useAirDropStore = create<AirdropState>()(
  devtools((set, get) => ({
    ...initialState,
    createAirdrop: async (data: any) => {
      try {
        set({ loading: true })
        const { data: response } = await api.post("/product-airdrops", data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        set({ loading: false })
        return response
      } catch (err: any) {
        set({ error: err.message, loading: false })
        return false
      }
    },
    getAirdrop: async ({ id, wallet }) => {
      try {
        set({ singleLoading: true })
        const { data: response } = await api.get(`/product-airdrops/${id}`, {
          params: {
            wallet
          }
        })
        // set({ singleLoading: false })
        return response
      } catch (err: any) {
        set({ error: err.message, singleLoading: false })
        return false
      }
    },
    getAirdrops: async (
      productId?: string,
      page?: number,
      append?: boolean
    ) => {
      try {
        set({ loading: true })
        const {
          data: { data: response }
        } = await api.get("/product-airdrops", {
          params: {
            page,
            limit: 10,
            productId
          }
        })
        // console.debug("response airdrop", response)
        set({
          loading: false,
          airdrops: {
            page: response.page,
            limit: response.limit,
            total: response.total,
            airdrops: append
              ? [...get().airdrops.airdrops, ...response.airdrops]
              : response.airdrops
          }
        })
        return response
      } catch (err: any) {
        set({ error: err.message, loading: false })
        return false
      }
    }
  }))
)
