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
    let walletAddress: string | null = ""
    let trustWalletConnectedWalletType = ""
    switch (connectionItem.walletName) {
      case "MetaMask":
        walletAddress = await connectMetaMask()
        break

      case "Phantom":
        walletAddress = await connectPhantom()
        break

      case "SubWallet":
        walletAddress = await connectSubWallet()
        break

      case "Trust Wallet":
        walletAddress = await connectTrustWallet()
        break

      case "Coinbase":
        walletAddress = await connectCoinbaseWallet()
        break

      case "WalletConnect":
        const walletConnectConnectedObj = await connectWalletConnect()
        console.log("wallet connect connection is: ", walletConnectConnectedObj)
        break

      default:
        console.error("Unsupported wallet provider")
    }
    if (walletAddress && connectionItem.walletName) {
      // For initial login, set as primary wallet; otherwise, add it as an additional wallet.
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
