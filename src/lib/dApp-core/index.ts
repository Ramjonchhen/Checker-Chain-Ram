// import {
//   useGetLoginInfo,
//   sendTransactions,
//   transactionServices
//   logout,
//   useGetAccountInfo,
//   DappProvider,
//   DappUI
// } from "@elrondnetwork/dapp-core"
import dynamic from "next/dynamic"
import { sendTransactions } from "@multiversx/sdk-dapp/services"
import { logout } from "@multiversx/sdk-dapp/utils"
import {
  useGetAccountInfo,
  useGetLoginInfo,
  useTrackTransactionStatus,
  useGetActiveTransactionsStatus
} from "@multiversx/sdk-dapp/hooks"
import { DappProvider } from "@multiversx/sdk-dapp/wrappers/DappProvider"
import { LoginHookGenericStateType } from "@multiversx/sdk-dapp/types"

import {
  useExtensionLogin,
  useWalletConnectV2Login,
  useLedgerLogin,
  useWebWalletLogin
} from '@multiversx/sdk-dapp/hooks';

const ExtensionLoginButton = dynamic(
  async () => {
    return (
      await import("@multiversx/sdk-dapp/UI/extension/ExtensionLoginButton")
    ).ExtensionLoginButton
  },
  { ssr: false }
)
const LedgerLoginButton = dynamic(
  async () => {
    return (await import("@multiversx/sdk-dapp/UI/ledger/LedgerLoginButton"))
      .LedgerLoginButton
  },
  { ssr: false }
)
const WalletConnectLoginButton = dynamic(
  async () => {
    return (
      await import(
        "@multiversx/sdk-dapp/UI/walletConnect/WalletConnectLoginButton"
      )
    ).WalletConnectLoginButton
  },
  { ssr: false }
)
const WebWalletLoginButton = dynamic(
  async () => {
    return (
      await import("@multiversx/sdk-dapp/UI/webWallet/WebWalletLoginButton")
    ).WebWalletLoginButton
  },
  { ssr: false }
)
const TransactionsToastList = dynamic(
  async () => {
    return (await import("@multiversx/sdk-dapp/UI/TransactionsToastList"))
      .TransactionsToastList
  },
  { ssr: false }
)
const SignTransactionsModals = dynamic(
  async () => {
    return (await import("@multiversx/sdk-dapp/UI/SignTransactionsModals"))
      .SignTransactionsModals
  },
  { ssr: false }
)
const NotificationModal = dynamic(
  async () => {
    return (await import("@multiversx/sdk-dapp/UI/NotificationModal"))
      .NotificationModal
  },
  { ssr: false }
)

export {
  useGetLoginInfo,
  sendTransactions,
  logout,
  useGetAccountInfo,
  DappProvider,
  ExtensionLoginButton,
  LedgerLoginButton,
  WalletConnectLoginButton,
  WebWalletLoginButton,
  TransactionsToastList,
  SignTransactionsModals,
  NotificationModal,
  useTrackTransactionStatus,
  useGetActiveTransactionsStatus,
  useExtensionLogin,
  useWalletConnectV2Login,
  useLedgerLogin,
  useWebWalletLogin,

}

export type { LoginHookGenericStateType }

// import "@elrondnetwork/dapp-core/dist/index.css" ->app.tsx ma
