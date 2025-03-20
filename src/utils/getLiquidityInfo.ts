/* eslint-disable @typescript-eslint/no-explicit-any */
import { Address, ContractFunction, Query } from "lib/dApp-js"
import { getPairs } from "api/pairs/pairs"
import { getWalletTokenInfo } from "api/wallet/wallet"
import axios from "axios"
import config from "config/config.json"

import { proxyNetworkProvider as proxy } from "lib/dApp-network-js"
import BigNumber from "bignumber.js"
import { getNetwork } from "config"

const network = getNetwork()

const getPairData = async (pairAddress: string) => {
  const pairQuery = new Query({
    address: new Address(pairAddress),
    func: new ContractFunction("getReservesAndTotalSupply")
  })
  try {
    const { returnData } = await proxy.queryContract(pairQuery)
    return returnData
  } catch (err) {
    console.log(err)
    return ["AZhzCRC2", "Cn2jIait2Ub", "VVXT3Ws="] // dummy copied from mainnet
  }
}
const SI_SYMBOL = ["", "K", "M", "B", "T", "P", "E", "Q", "Q", "Q"]

export const abbreviateNumber = (number: any): string => {
  const tier = (Math.log10(Math.abs(number)) / 3) | 0
  if (number < 1) {
    return BigNumber(number).toFixed(3).slice(0, -1)
  }
  if (tier == 0) {
    if (isNaN(number)) return "0"
    if (!number) return "0"
    return BigNumber(number).toFixed(3).slice(0, -1)
  }
  const suffix = SI_SYMBOL[tier]
  const scale = Math.pow(10, tier * 3)
  const scaled = number / scale
  return scaled.toFixed(1) + (suffix ? suffix : "")
}

const token0 = config.mainnet.tokenId
const token1 = config.network.egldToken

const pairToken = network.pairToken
export const pairTokenDev = config.devnet.pairToken

const pairAddress = 'erd1qqqqqqqqqqqqqpgqn8nsu24g9lca74fw0lus2garvhg2alfe2jpsqlysng'
// const adminWallet = "erd1etc40u484jry3wtu0ch5hzndhs87xuvd6wwcu92wnleau3vgp8dsg77rmm"
const totalRewardAmount = 1500000 * 12 * 10 ** 5

export const getLiquidityInfo = async (wallet?: string) => {
  const pairInfo: any = await getPairs(token0, token1)
  const volume24h = `$${abbreviateNumber(pairInfo?.volume24h?.toFixed(2))}`
  const tokenPairInfo = await getPairData(pairAddress)
  const checkrReserve = parseInt(
    Buffer.from(tokenPairInfo[0], "base64").toString("hex"),
    16
  )
  const egldReserve = parseInt(
    Buffer.from(tokenPairInfo[1], "base64").toString("hex"),
    16
  )
  const totalSupply = parseInt(
    Buffer.from(tokenPairInfo[2], "base64").toString("hex"),
    16
  )
  const liquidity = {
    checkr: abbreviateNumber((checkrReserve / 10 ** 5)?.toFixed(3)),
    egld: abbreviateNumber((egldReserve / 10 ** 18)?.toFixed(3))
  }

  // const adminTokenBalance: any = await getWalletTokenInfo(
  //   adminWallet,
  //   pairToken
  // )

  let apr = "0%"
  // if (adminTokenBalance) {
  // const adminBalance = adminTokenBalance.balance as number
  apr = `${(
    parseFloat(
      (totalRewardAmount / (checkrReserve)).toFixed(2)
    ) * 100
  ).toFixed(0)}%`
  // }

  const userPair = {
    checkr: abbreviateNumber("0"),
    egld: abbreviateNumber("0")
  }
  let userLpToken: any = 0
  if (wallet && totalSupply !== 0) {
    let pairTokenBalance: any
    if (process.env.NEXT_PUBLIC_NETWORK === "devnet") {
      const { data } = await axios.get(
        `${network.apiAddress}/accounts/${wallet}/tokens/${pairTokenDev}`
      )
      pairTokenBalance = data
    } else {
      pairTokenBalance = await getWalletTokenInfo(wallet, pairToken)
    }

    // console.log(pairTokenBalance)
    if (pairTokenBalance) {
      userPair.checkr = abbreviateNumber(
        (
          ((pairTokenBalance.balance / totalSupply) * checkrReserve) /
          10 ** 5
        ).toFixed(3)
      )
      userPair.egld = abbreviateNumber(
        (
          ((pairTokenBalance.balance / totalSupply) * egldReserve) /
          10 ** 18
        ).toFixed(3)
      )
      userLpToken = pairTokenBalance.balance
        / 10 ** pairTokenBalance.decimals
    }
  }

  return {
    volume24h,
    liquidity,
    apr,
    userPair,
    userLpToken
  }
}
