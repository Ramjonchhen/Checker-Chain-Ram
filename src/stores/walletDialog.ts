import {create} from "zustand"
import { devtools } from "zustand/middleware"

interface WalletDialogData {
  loginDialog: boolean
  setLoginDialog: (arg0?: boolean) => void
}

export const useWalletDialogStore = create<WalletDialogData>()(
  devtools((set, get) => ({
    loginDialog: false,
    setLoginDialog: (arg0) => {
      set({
        loginDialog: typeof arg0 !== "undefined" ? arg0 : !get().loginDialog
      })
    }
  }))
)
