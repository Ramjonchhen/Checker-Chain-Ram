import { getPairs } from "api/pairs/pairs"
import { create } from "zustand"
import { devtools } from "zustand/middleware"

export type PairData = {
  address?: string
  id?: string
  symbol?: string
  name?: string
  price?: number
  baseId?: string
  basePrice?: number
  baseSymbol?: string
  baseName?: string
  quoteId?: string
  quotePrice?: number
  quoteSymbol?: string
  quoteName?: string
  totalValue?: number
  volume24h?: number
  state?: string
  type?: string
}

interface WalletDialogData {
  pairData: PairData
  getPairs: (firstToken: string, secondToken: string) => void
}

export const usePriceRatesStore = create<WalletDialogData>()(
  devtools((set) => ({
    pairData: {
      address: "",
      id: "",
      symbol: "",
      name: "",
      price: 0,
      baseId: "",
      basePrice: 0,
      baseSymbol: "",
      baseName: "",
      quoteId: "",
      quotePrice: 0,
      quoteSymbol: "",
      quoteName: "",
      totalValue: 0,
      volume24h: 0,
      state: "",
      type: ""
    },
    getPairs: async (firstToken, secondToken) => {
      const res = await getPairs(firstToken, secondToken)
      set({
        pairData: res as PairData
      })
    }
  }))
)

// config.mainnet.tokenId,
// config.network.egldToken
