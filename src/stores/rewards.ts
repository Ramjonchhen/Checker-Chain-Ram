/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { api } from "./user"
import { backendUrls } from "constants/backendUrls"

export interface Reward {
  index: number
  epoch: number
  amount: number
  proof: string[]
  wallet: string
  name: string
  points: number
  claimed: boolean
  _id: string
}

export type IRewardV2 = {
  nextEpochIn?: number;
  totalReward?: IDetailEpochRewards;
  potentialReward?: IDetailEpochRewards;
  previousEpochRewards?: IDetailEpochRewards;
  percentageChange?: IDetailEpochRewards;
  history?: IRewardHistory[];
}

export type IRewardHistory = {
  epoch?: number;
  rewards?: IRewardType[];
  date?: Date;
}

export type IRewardType = {
  reward?: number;
  type?: string;
  epoch?: number;
  updatedAt?: Date;
}

export type IDetailEpochRewards = {
  reviewerReward?: number;
  posterReward?: number;
  influencerReward?: number;
}

type RewardState = {
  loading: boolean
  airdropLoading: boolean
  error: string
  rewards: Reward[]
  rewardsV2: IRewardV2
  wallet: string

}

type RewardFunctions = {
  fetchRewards: (wallet: string) => void
  fetchRewardsV2: (wallet: string) => void
  airdropToken: (wallet: string, isLp?: boolean) => Promise<any>
  reset: () => void
}

const initialDetailEpochRewards = {
  influencerReward: 0,
  posterReward: 0,
  reviewerReward: 0
}

const initialState: RewardState = {
  loading: false,
  airdropLoading: false,
  error: "",
  rewards: [
    {
      wallet: "",
      index: 1,
      epoch: 1,
      amount: 0,
      proof: [],
      name: "",
      claimed: false,
      points: 0,
      _id: ""
    }
  ],
  rewardsV2: {
    history: [],
    nextEpochIn: 0,
    percentageChange: { ...initialDetailEpochRewards },
    potentialReward: { ...initialDetailEpochRewards },
    previousEpochRewards: { ...initialDetailEpochRewards },
    totalReward: { ...initialDetailEpochRewards }
  },
  wallet: ""
}

type IRewardStore = RewardState & RewardFunctions;

export const useRewardStore = create<IRewardStore>()(
  devtools((set) => ({
    ...initialState,
    fetchRewards: async (wallet: string) => {
      set({ loading: true, wallet })
      const { data } = await api.get(`/rewards/${wallet}`)
      set({ loading: false, rewards: data?.data || {} })
    },
    airdropToken: async (wallet: string, isLp = false) => {
      try {
        set({ airdropLoading: true })
        const { data } = await api.post("/airdrop", {
          wallet,
          isLp
        })
        set({ airdropLoading: false })
        return data
      } catch (e) {
        set({ airdropLoading: false })
        return false
      }
    },
    reset: () => set(initialState),
    fetchRewardsV2: async (wallet: string) => {
      set({ loading: true, wallet })
      const { data } = await api.get(backendUrls.getRewardData(wallet))
      set({ loading: false, rewardsV2: data?.data || {} })
    }
  }))
)
