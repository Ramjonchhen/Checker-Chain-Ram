import { Modal } from "components"
import React from "react"
import { QRCodeSVG } from "qrcode.react"
import { CheckerSmallLogo } from "assets/images"
import { LoginHookGenericStateType } from "lib/dApp-core"
import { LoadingIcon } from "assets/icons"

type Props = {
  isXPortalModalOpen: boolean
  onHide: () => void
  qrCodeUrl: string
  xPortalloginStates: LoginHookGenericStateType
}

// not used
const XPortalModal = ({
  isXPortalModalOpen,
  onHide,
  qrCodeUrl,
  xPortalloginStates: { error, isLoading, isLoggedIn }
}: Props) => {
  return (
    <Modal
      display={isXPortalModalOpen}
      onHide={onHide}
      mainClassName="z-[2147483644]"
      dismissable
      closeButton
    >
      <div className="pt-7 pb-10 px-7">
        <div className="text-center text-xs text-neutral-200">
          Scam/ Phishing verification :{" "}
          <a
            href="https://checkerchain.com"
            target="_blank"
            className="text-blue-600"
            rel="noreferrer"
          >
            https://checkerchain.com
          </a>
        </div>

        <div className="text-center text-neutral-900 text-xl font-bold leading-6 tracking-[0.2px] mt-6">
          Login with the xPortal App
        </div>
        <div className="text-center text-neutral-600 text-sm font-normal leading-4 mt-2">
          Scan the QR code using the xPortal App
        </div>
        {isLoading && (
          <div className="flex justify-center mt-4">
            <LoadingIcon className="w-8 h-8 text-primary" />
          </div>
        )}

        <div className="mt-5 flex justify-center">
          <QRCodeSVG
            value={qrCodeUrl}
            size={240}
            imageRendering={"svg"}
            imageSettings={{
              src: CheckerSmallLogo.src,
              height: 40,
              width: 40,
              excavate: false
            }}
          />
        </div>
        {!isLoggedIn && error && (
          <div className="text-center text-error mt-6 text-sm">{error}</div>
        )}
      </div>
    </Modal>
  )
}

export default XPortalModal
