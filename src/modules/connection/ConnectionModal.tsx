import React, { useState } from "react"

import { Modal } from "components"
import {
  allConnectionItems,
  mainConnectionItems,
  socialLoginItems
} from "./connectionItems"
import { useWalletDialogStore } from "stores"

import ConnectionItemWrapper from "./ConnectionItemWrapper"
import SocialConnectButton from "./SocialConnectionItem"

const ConnectionModal = () => {
  const { loginDialog, setLoginDialog } = useWalletDialogStore((state) => state)
  const [showAllWallets, setShowAllWallets] = useState(false)

  return (
    <>
      <Modal
        display={loginDialog}
        className="max-w-[448px] md:w-[448px] bg-[#F7F7F7]"
        onHide={() => setLoginDialog(false)}
        mainClassName="z-[2147483642] pt-10"
        dismissable
      >
        <div className="pb-10 pt-6">
          <div className="text-center">
            <div className="text-neutral-900 text-xl font-bold leading-6 tracking-[0.2px]">
              Connect Wallet
            </div>
            <div className="text-neutral-600 text-sm font-normal leading-4 mt-2">
              Please connect your wallet for using CheckerChain Platform.
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mt-10">
            {/* // refactor this */}
            {(showAllWallets ? allConnectionItems : mainConnectionItems).map(
              (connectionItem) => {
                return (
                  <ConnectionItemWrapper
                    connectionItem={connectionItem}
                    key={connectionItem.walletName}
                    mode={"login"}
                  />
                )
              }
            )}
          </div>
          {!showAllWallets && (
            <button
              onClick={() => setShowAllWallets(true)}
              className="min-w-[84px] max-w-[98px] flex-1 bg-[#ECF2FA] flex flex-col items-center rounded-lg py-[10px] px-1 h-full cursor-pointer hover:bg-primary-500 transition-colors duration-400 group"
            >
              <div className="w-[37px] h-[37px] rounded-lg grid place-items-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 5V19M5 12H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="mt-2 text-[11px] font-bold text-neutral-900 text-center leading-3 group-hover:text-white">
                View All
              </div>
              <div className="text-[10px] mt-2 font-normal leading-3 text-neutral-600 group-hover:text-white">
                Wallets
              </div>
            </button>
          )}

          {/* Divider */}
          <div className="w-full flex items-center gap-4 my-2">
            <div className="flex-1 h-[1px] bg-neutral-200"></div>
            <div className="text-sm text-neutral-600">Or Continue With</div>
            <div className="flex-1 h-[1px] bg-neutral-200"></div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {socialLoginItems.map((connectionItem) => (
            <SocialConnectButton
              name={connectionItem.name}
              icon={connectionItem.icon}
            />
          ))}
        </div>
      </Modal>
    </>
  )
}

export default ConnectionModal
