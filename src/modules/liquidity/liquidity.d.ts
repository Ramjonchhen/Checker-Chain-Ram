export interface LiquidityInfo {
  id: number
  name: string
  token0: string
  token1: string
  liquidity: string[]
  apr: string
  volume24h: string
  userPair: string[]
  userLpToken: string
}

export type ILPModalHandler = {
  type: "stake" | "unstake"
  liquidityInfo: LiquidityInfo
  show: boolean
  stakedAmount?: string
}
