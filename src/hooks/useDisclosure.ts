import { useCallback, useState } from "react"

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

type UseDisclosureProps = {
  defaultIsOpen?: boolean
  onOpen?: () => void
  onClose?: () => void
}

export const useDisclosure = ({
  defaultIsOpen = false,
  onClose = noop,
  onOpen = noop
}: UseDisclosureProps = {}) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen)

  const open = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true)
      onOpen()
    }
  }, [isOpen, onOpen])

  const close = useCallback(() => {
    if (isOpen) {
      setIsOpen(false)
      onClose()
    }
  }, [isOpen, onClose])

  const toggle = useCallback(() => {
    const action = isOpen ? close : open
    action()
  }, [isOpen, close, open])

  const setState = useCallback(
    (state: boolean) => {
      if (isOpen !== state) {
        toggle()
      }
    },
    [isOpen, toggle]
  )

  return [isOpen, { close, open, setState, toggle }] as const
}
