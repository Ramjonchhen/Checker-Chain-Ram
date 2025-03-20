import React, { ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import { WalletIcon } from "assets/icons"

export type supportingWallets =
  | "MetaMask"
  | "Phantom"
  | "Trust Wallet"
  | "Coinbase"
  | "WalletConnect"
  | "SubWallet"
  | "MultiversX"
  | "Ledger"
  | "Web Wallet"
  | "xPortal"

export type IConnectionItem = {
  isComingSoon?: boolean
  walletName?: supportingWallets
  walletType?: string
  icon?: ReactNode
  isPrimary: boolean
}

export interface ISocailLogin {
  name: "X" | "Google"
  icon?: ReactNode
}

type Props = {
  handleItemCick?: (walletName: string) => void
}

function ConnectionItem({
  isComingSoon = false,
  icon = <WalletIcon />,
  walletName = "MultiversX",
  handleItemCick = () => {}
}: IConnectionItem & Props) {
  return (
    <div
      className={twMerge(
        "connection-item min-w-[84px] max-w-[98px] flex-1  bg-[#ECF2FA] flex flex-col items-center  rounded-lg py-[10px] px-1 h-full  group/connectionItem ",
        isComingSoon
          ? "pointer-events-none cursor-not-allowed opacity-[45%]"
          : "cursor-pointer hover:bg-primary-500 transition-colors duration-400"
      )}
      onClick={() => handleItemCick(walletName)}
    >
      <div className="w-[37px]  flex-shrink-0 h-[37px]  rounded-lg  grid place-items-center">
        {icon}
      </div>
      <div className="mt-2  text-[11px] font-bold text-neutral-900 text-center leading-3 group-hover/connectionItem:text-white transition-colors duration-400">
        {walletName}
      </div>
      <div className="text-[10px] mt-2 font-normal leading-3 text-neutral-600 group-hover/connectionItem:text-white transition-colors duration-400 ">
        {isComingSoon ? "Coming Soon" : "Web"}
      </div>
    </div>
  )
}
export default ConnectionItem
