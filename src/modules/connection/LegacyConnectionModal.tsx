import React from "react"
import {
  ExtensionLoginButton,
  LedgerLoginButton,
  WalletConnectLoginButton,
  WebWalletLoginButton
} from "lib/dApp-core"
import { Modal, Text } from "components"
import { useWalletDialogStore } from "stores"
import WalletImage from "assets/images/wallet.png"

// OLD LOGIN MODAL, REMOVE LATER

const LegacyConnectionModal = () => {
  const { loginDialog, setLoginDialog } = useWalletDialogStore((state) => state)

  return (
    <Modal
      closeButton
      display={loginDialog}
      onHide={() => setLoginDialog(false)}
    >
      <div className="flex gap-2 flex-col items-center justify-center">
        <img src={WalletImage.src} className="w-32 h-32 my-4" />
        <Text variant="modal-header" className="!text-[16px] block text-center">
          {" "}
          Oops! No wallet connections.{" "}
        </Text>
        <div className="text-content-tertiary mb-6 text-center">
          <span>
            Please connect your wallet for using CheckerChain Platform.
          </span>
        </div>
        {/* <Text variant="modal-header" className="!text-[16px] !text-content-secondary self-start !font-medium"> Connect Using </Text> */}

        <div className="flex flex-col w-[90%] items-center">
          <ExtensionLoginButton
            buttonClassName="p-2 w-full rounded-lg !bg-primary text-white !border-none"
            // @ts-ignore
            callbackRoute="/"
            loginButtonText={"Extension"}
          />
          <WebWalletLoginButton
            buttonClassName="p-2 w-full rounded-lg !bg-primary text-white !border-none"
            callbackRoute="/"
            loginButtonText={"Web Wallet"}
          />
          <LedgerLoginButton
            buttonClassName="p-2 w-full rounded-lg !bg-primary text-white !border-none"
            callbackRoute="/"
            loginButtonText={"Ledger"}
          />
          <WalletConnectLoginButton
            buttonClassName="p-2 w-full rounded-lg !bg-primary text-white !border-none"
            // @ts-ignore
            callbackRoute="/"
            loginButtonText={"xPortal App"}
            isWalletConnectV2
          />
        </div>
      </div>
    </Modal>
  )
}

export default LegacyConnectionModal
