import {create} from "zustand"
import { devtools } from "zustand/middleware"

type ToastType = "success" | "error" | "info"

export interface ToastObjectProps {
  title?: string
  message: string | Error
  transactionHash?: string
  autoClose?: number
}

export interface ToastProps extends ToastObjectProps {
  type: ToastType
  id: number
}

export interface ToastPropertiesProps {
  position?: "bottom-right" | "top-right" | "bottom-left" | "top-left"
}

export interface ToastsProps {
  toasts: ToastProps[]
}

export const defaultAutoCloseTime = 4000

interface ToastState {
  toasts: ToastProps[],
  // Toast: {
  //   success: (data: ToastObjectProps) => void
  //   error: (data: ToastObjectProps) => void
  //   info: (data: ToastObjectProps) => void
  //   remove: (id: number) => void
  // }
  successToast: (data: ToastObjectProps) => void,
  errorToast: (data: ToastObjectProps) => void,
  infoToast: (data: ToastObjectProps) => void,
  removeToast: (id: number) => void,
}

export const useToastStore = create<ToastState>()(
  devtools((set, get) => ({
    toasts: [],
    // Toast: {
    //   success: get().successToast,
    //   error: get().errorToast,
    //   info: get().infoToast,
    //   remove: get().removeToast,
    // },
    successToast: (data: ToastObjectProps) => {
      const currentTime = Date.now()

      set({
        toasts: [
          ...get().toasts,
          {
            type: "success",
            id: currentTime,
            ...data
          }
        ]
      })
    },
    errorToast: (data: ToastObjectProps) => {
      const currentTime = Date.now()

      set({
        toasts: [
          ...get().toasts,
          {
            type: "error",
            id: currentTime,
            ...data
          }
        ]
      })
    },
    infoToast: (data: ToastObjectProps) => {
      const currentTime = Date.now()

      set({
        toasts: [
          ...get().toasts,
          {
            type: "info",
            id: currentTime,
            ...data
          }
        ]
      })
    },
    removeToast: (toastId: number) => {
      set({
        toasts: get().toasts.filter((item) => item.id !== toastId)
      })
    }
  }))
)
