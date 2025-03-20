import {create} from "zustand"
import { devtools } from "zustand/middleware"

interface CommonData {
  currentNavbarTab: string
  setCurrentNavbarTab: (arg0?: string) => void
}

export const useCommonStore = create<CommonData>()(
  devtools((set, get) => ({
    currentNavbarTab: "Products",
    setCurrentNavbarTab: (arg0) => {
      set({
        currentNavbarTab:
          typeof arg0 !== "undefined" ? arg0 : get().currentNavbarTab
      })
    }
  }))
)
