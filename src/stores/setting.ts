import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { api } from "./user"

export interface Setting {
  wallet: string
  maxNumOfReviewPerDay: number
  isPrivate: boolean
  notificationMode: {
    email: string
  }
}

interface SettingState {
  loading: boolean
  error: string
  settings: Setting
  wallet: string
  authorization: string
  fetchSettings: (wallet: string, authorization: string) => void
  setPersonalGoals: (tasks: number) => void
  setNotificationMode: (mode: { email: string }) => void,
  reset: () => void
}

const initialState = {
  loading: false,
  error: "",
  wallet: "",
  authorization: "",
  settings: {
    wallet: "",
    maxNumOfReviewPerDay: 0,
    isPrivate: false,
    notificationMode: {
      email: ""
    }
  }
}
export const useSettingStore = create<SettingState>()(
  devtools((set, get) => ({
    ...initialState,
    fetchSettings: async (wallet, authorization) => {
      set({ loading: true, wallet, authorization })
      try {
        const { data } = await api.get(`/mySettings/${wallet}`, {
          headers: {
            Authorization: `Bearer ${authorization}`
          }
        })
        set({ loading: false, settings: data?.user || {} })
      }
      catch (err) {
        console.error(err)
        set({ loading: false, })
      }
    },
    setPersonalGoals: async (tasks) => {
      set({ loading: true })
      try {
        const { data } = await api.post(
          `/editSettings/personalGoals`,
          {
            walletId: get().wallet,
            maxNumOfReviewPerDay: tasks
          }
        )
        set({ loading: false, settings: data?.user || {} })
      }
      catch (err) {
        console.error(err)
        set({ loading: false })
      }
    },
    setNotificationMode: async (mode) => {
      set({ loading: true })
      try {
        const { data } = await api.post(
          `/editSettings/notificationMode`,
          {
            walletId: get().wallet,
            notificationMode: mode
          }
        )
        set({ loading: false, settings: data?.user || {} })
      }
      catch (err) {
        console.error(err)
        set({ loading: false })
      }

    },
    reset: () => set(initialState),
  }))
)