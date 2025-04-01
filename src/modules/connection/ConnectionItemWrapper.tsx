import React, { useEffect } from "react"
import ConnectionItem, { IConnectionItem } from "./ConnectionItem"
import {
  ExtensionLoginButton,
  LedgerLoginButton,
  useGetAccountInfo,
  WalletConnectLoginButton,
  WebWalletLoginButton
} from "lib/dApp-core"
import { useToastStore } from "stores/toast"
import { useUserStore } from "stores/user"
import {
  connectCoinbaseWallet,
  connectMetaMask,
  connectPhantom,
  connectSubWallet,
  connectTrustWallet,
  connectWalletConnect
} from "./walletProviders"

type Props = {
  connectionItem: IConnectionItem
}

const WalletExtensionConnection = ({ connectionItem }: Props) => {
  return (
    <ExtensionLoginButton
      className={
        "!p-0 !m-0 !bg-[#F7F7F7] !border-none !text-black !rounded-none flex-1"
      }
      callbackRoute="/"
      nativeAuth
    >
      <ConnectionItem
        isPrimary={connectionItem.isPrimary}
        walletName={connectionItem.walletName}
        icon={connectionItem.icon}
      />
    </ExtensionLoginButton>
  )
}

const WebWalletConnection = ({ connectionItem }: Props) => {
  return (
    <WebWalletLoginButton
      key={connectionItem.walletName}
      className={
        "!p-0 !m-0 !bg-[#F7F7F7] !border-none !text-black !rounded-none flex-1"
      }
      callbackRoute="/"
      nativeAuth
    >
      <ConnectionItem
        walletName={connectionItem.walletName}
        isPrimary={connectionItem.isPrimary}
      />
    </WebWalletLoginButton>
  )
}

const LedgerConnection = ({ connectionItem }: Props) => {
  return (
    <LedgerLoginButton
      className={
        "!p-0 !m-0 !bg-[#F7F7F7] !border-none !text-black !rounded-none flex-1"
      }
      callbackRoute="/"
      loginButtonText={"Ledger"}
      nativeAuth
    >
      <ConnectionItem
        walletName={connectionItem.walletName}
        icon={connectionItem.icon}
        isPrimary={connectionItem.isPrimary}
      />
    </LedgerLoginButton>
  )
}
const XPortalConnection = ({ connectionItem }: Props) => {
  return (
    <WalletConnectLoginButton
      key={connectionItem.walletName}
      className={
        "!p-0 !m-0 !bg-[#F7F7F7] !border-none !text-black !rounded-none flex-1"
      }
      callbackRoute="/"
      nativeAuth
      isWalletConnectV2
    >
      <ConnectionItem
        walletName={connectionItem.walletName}
        icon={connectionItem.icon}
        isPrimary={connectionItem.isPrimary}
      />
    </WalletConnectLoginButton>
  )
}

const ConnectionItemWrapper = ({
  connectionItem,
  mode
}: {
  connectionItem: IConnectionItem
  mode: "login" | "add"
}) => {
  const { signInWithWallet, connectAdditionalWallet } = useUserStore()
  const { infoToast } = useToastStore()

  const handleMissingLoginClick = (walletName: string) => {
    infoToast({
      message: `${walletName} login is coming soon.`
    })
  }

  console.log("connecting wallet: ", connectionItem.walletName)

  const { account } = useGetAccountInfo()

  useEffect(() => {
    if (account && account.address) {
      if (mode === "login") {
        signInWithWallet({
          provider: "MultiversX",
          account: account.address,
          isPrimary: true
        })
      } else {
        connectAdditionalWallet({
          provider: "MultiversX",
          account: account.address,
          isPrimary: true
        })
      }
    }
  }, [account])

  const handleConnect = async () => {
    console.log(`Attempting to connect with ${connectionItem.walletName}`)
    let walletAddress: string | null = ""
    let trustWalletConnectedWalletType = ""

    try {
      switch (connectionItem.walletName) {
        case "MetaMask":
          walletAddress = await connectMetaMask()
          console.log("MetaMask connection result:", walletAddress)
          break

        case "Phantom":
          walletAddress = await connectPhantom()
          console.log("Phantom connection result:", walletAddress)
          break

        case "SubWallet":
          walletAddress = await connectSubWallet()
          console.log("SubWallet connection result:", walletAddress)
          break

        case "Trust Wallet":
          walletAddress = await connectTrustWallet()
          console.log("Trust Wallet connection result:", walletAddress)
          break

        case "Coinbase":
          walletAddress = await connectCoinbaseWallet()
          console.log("Coinbase connection result:", walletAddress)
          break

        case "WalletConnect":
          try {
            const walletConnectResult = await connectWalletConnect()
            console.log("WalletConnect connection result:", walletConnectResult)
            if (walletConnectResult?.walletAddress) {
              const address: string = walletConnectResult.walletAddress


              // Sign in immediately after successful connection
              if (mode === "login") {
                await signInWithWallet({
                  provider: connectionItem.walletName,
                  account: walletAddress,
                  isPrimary: false
                })
              } else {
                await connectAdditionalWallet({
                  provider: connectionItem.walletName,
                  account: walletAddress,
                  isPrimary: false
                })
              }
            }
          } catch (wcError) {
            console.error("WalletConnect error:", wcError)
            infoToast({
              message: "Failed to connect with WalletConnect"
            })
          }
        default:
          console.error("Unsupported wallet provider:", connectionItem.walletName)
      }

      if (walletAddress && connectionItem.walletName && connectionItem.walletName !== "WalletConnect") {
        console.log(`Successfully connected ${connectionItem.walletName}:`, walletAddress)
        if (mode === "login") {
          signInWithWallet({
            provider: connectionItem.walletName,
            account: walletAddress,
            isPrimary: false
          })
        } else {
          connectAdditionalWallet({
            provider: connectionItem.walletName,
            account: walletAddress,
            isPrimary: false
          })
        }
      }
    } catch (error) {
      console.error(`Error connecting ${connectionItem.walletName}:`, error)
    }
  }

  if (connectionItem.walletName === "MultiversX") {
    return <WalletExtensionConnection connectionItem={connectionItem} />
  } else if (connectionItem.walletName === "Web Wallet") {
    return <WebWalletConnection connectionItem={connectionItem} />
  } else if (connectionItem.walletName === "xPortal") {
    return <XPortalConnection connectionItem={connectionItem} />
  } else if (connectionItem.walletName === "Ledger") {
    return <LedgerConnection connectionItem={connectionItem} />
  }

  return <ConnectionItem {...connectionItem} handleItemCick={handleConnect} />
}

export default ConnectionItemWrapper
