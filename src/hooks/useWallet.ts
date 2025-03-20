/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { logout, useGetAccountInfo, useGetLoginInfo } from "lib/dApp-core"
import axios from "axios"
import { getNetwork } from "config"
import { useEffect, useState } from "react"

const network = getNetwork()

export const useWallet = () => {
  const [wallet, setWallet] = useState({
    connected: false,
    address: ""
  })
  const [fetchingBalance, setFetchingBalance] = useState(false)
  const [userBalance, setUserBalance] = useState(0)
  const [hasTokens, setHasTokens] = useState(true)
  const userCheckerBalance = () => {
    setFetchingBalance(true)
    axios
      .get(
        `https://${network.id === "devnet" ? "devnet-" : ""
        }api.multiversx.com/accounts/${wallet.address}/tokens/${network.tokenId
        }`
      )
      .then((res) => {
        if (res.status === 200) {
          const remaining = res.data.balance ? Number(res.data.balance) : 0
          setUserBalance(remaining / 10 ** 5)
          setFetchingBalance(false)
        } else {
          setHasTokens(false)
        }
      })
      .catch(() => {
        setFetchingBalance(false)
      })
  }
  useEffect(() => {
    if (!wallet.address && hasTokens) {
      return
    }
    userCheckerBalance()
  }, [wallet, hasTokens])
  const { isLoggedIn } = useGetLoginInfo()
  const { account } = useGetAccountInfo()

  const handleLogout = () => logout(`${window.location.pathname}`)
  const trimWallet = (wallet: any) =>
    wallet &&
    `${String(wallet).substring(0, 5)}
      ...
      ${String(wallet).substring(wallet.length - 5, wallet.length)}`
  const trimWalletLarge = (wallet: any) =>
    wallet &&
    `${String(wallet).substring(0, 12)}
      ...
      ${String(wallet).substring(wallet.length - 12, wallet.length)}`

  useEffect(() => {
    setWallet({
      connected: isLoggedIn,
      address: account.address
    })
  }, [isLoggedIn, account])
  const SI_SYMBOL = ["", "K", "M", "B", "T", "P", "E"]

  const abbreviateNumber = (number: any) => {
    const tier = (Math.log10(Math.abs(number)) / 3) | 0
    if (tier == 0) {
      if (!number) return "0"

      if (isNaN(number)) return 0

      return Number(number).toFixed(3).slice(0, -1)
    }
    const suffix = SI_SYMBOL[tier]
    const scale = Math.pow(10, tier * 3)
    const scaled = number / scale
    return scaled.toFixed(1) + suffix
  }

  return {
    wallet,
    handleLogout,
    trimWallet,
    abbreviateNumber,
    fetchingBalance,
    userBalance,
    trimWalletLarge
  }
}
