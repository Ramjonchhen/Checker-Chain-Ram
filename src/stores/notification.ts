/* eslint-disable @typescript-eslint/no-explicit-any */
import { backendUrls } from "constants/backendUrls"
import { toast } from "react-hot-toast"
import { api } from "stores"
import { create } from "zustand"
import { devtools } from "zustand/middleware"

export type INotificationData = {
  _id: string;
  walletId: string;
  message: string;
  url: string;
  logo?: string;
  isSeen: boolean;
  type: "productCreated" | "testNotification" | "productReview";
  createdAt: string;
  updatedAt: string;
  __v: number
}
interface INotificationStore {
  notificationData: INotificationData[],
  unseen: number,
  getNotificationData: () => void,
  fetchUnseen: () => void,
  postMarkNotificationsAsRead: (ids: string[]) => void
  resetNotificationData: () => void
  setNotificationData: (message: any) => void
}
export const useNotificationStore = create<INotificationStore>()(
  devtools((set, get) => ({
    unseen: 0,
    notificationData: [] as INotificationData[],
    fetchUnseen: async () => {
      try {
        const res = await api.get(backendUrls.getUnreadNotifications())
        if (res.data.count) {
          set({
            unseen: res.data.count
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    getNotificationData: async () => {
      try {
        const res = await api.get(backendUrls.getNotifications(), {
          params: {
            limit: 100,
            page: 1
          }
        })
        if (res.data.items) {
          set({
            notificationData: res.data.items,
            unseen: res.data.items.filter((item: any) => item.isSeen === false).length
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    postMarkNotificationsAsRead: async (notificationIds: string[]) => {
      try {
        const res = await api.post(backendUrls.postMarkAsReadNotifications, {
          ids: notificationIds
        })

        console.log(res, "here")
        try {
          const res = await api.get(backendUrls.getNotifications(), {
            params: {
              limit: 100,
              page: 1
            }
          })
          if (res.data.items) {
            set({
              notificationData: res.data.items,
              unseen: res.data.items.filter((item: any) => item.isSeen === false).length
            })
          }
        } catch (err) {
          console.log(err)
        }

      }
      catch (err) {
        console.log(err)
      }
    },
    resetNotificationData: () => {
      set({
        unseen: 0,
        notificationData: [],
      })
    },
    setNotificationData: (message: any) => {
      const newData = {
        ...message,
        isSeen: false
      }
      let notificationData = []
      if (get().notificationData.filter((item: any) => item._id === message._id).length === 0) {
        notificationData = [newData, ...get().notificationData]
      } else {
        notificationData = get().notificationData.map((item: any) => {
          if (item._id === message._id) {
            return newData
          }
          return item
        }).sort((a: any, b: any) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
      }
      toast.success(
        notificationData.filter((item: any) => item.isSeen === false).length > 1 ? `${notificationData.filter((item: any) => item.isSeen === false).length} new notifications
        `: `New notification`)
      set({
        unseen: notificationData.filter((item: any) => item.isSeen === false).length,
        notificationData,
      })
    }
  }))
)
