import React from "react"
import { Modal, Button } from "components"

export const ConfirmDialog: React.FC<{
  children?: JSX.Element
  show?: boolean
  setShow?: (arg0: boolean) => void
  message?: string
  onConfirm?: () => void
}> = ({ children, onConfirm, message, show, setShow }) => {
  const [showDialog, setShowDialog] = React.useState(false)

  React.useEffect(() => {
    setShowDialog(!!show)
  }, [show])

  return (
    <div className="relative">
      <Modal
        closeButton
        display={showDialog}
        onHide={() => {
          setShow ? setShow(false) : setShowDialog(false)
        }}
        className="!min-w-[340px] min-h-[120px] px-5"
      >
        <div className="flex gap-6 flex-col">
          <div className="text-md font-semibold">
            {message || "Are you sure ?"}{" "}
          </div>
          <div className="flex gap-2 justify-end items-center">
            <Button
              title="Confirm"
              onClick={() => {
                if (onConfirm) {
                  onConfirm()
                }
                setShow ? setShow(true) : setShowDialog(true)
              }}
            />
            <Button
              title="Cancel"
              variant="outlined"
              onClick={() => {
                setShow ? setShow(false) : setShowDialog(false)
              }}
            />
          </div>
        </div>
      </Modal>
      {children &&
        React.cloneElement(children, {
          onClick: () => {
            setShowDialog(true)
          }
        })}
    </div>
  )
}
