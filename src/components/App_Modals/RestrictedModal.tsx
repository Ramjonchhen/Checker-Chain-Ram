import React, { useState } from "react"
import { Button, Modal, Text } from "components"
import StopProceedImage from "assets/images/stopproceed.svg"
import { logout } from "lib/dApp-core"

const RestrictedModal = () => {
  const [displayRestricted, showRestrictedDialog] = useState<boolean>(false)

  return (
    <Modal
      display={displayRestricted}
      onHide={() => showRestrictedDialog(false)}
    >
      <div className="flex gap-2 flex-col items-center justify-center">
        <StopProceedImage />
        <Text
          variant="modal-header"
          className="!text-[16px] block text-center text-primary-tertiary"
        >
          Sorry, You cannot Proceed.{" "}
        </Text>
        <div className="text-content-tertiary mb-6 text-center">
          <span>
            Only DCA have initial access.
            <br />
            It will be available for all soon.
          </span>
        </div>
        <Button
          onClick={() => {
            logout("/")
          }}
          title="Change Wallet"
        />
      </div>
    </Modal>
  )
}

export default RestrictedModal
