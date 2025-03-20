import { CrossOutlineIcon } from "assets/icons"
import { IconButton } from "components/iconButton"
import { FC, useEffect, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import { ModalProps } from "./index.d"

export const Modal: FC<ModalProps> = ({
  display = false,
  dismissable = false,
  children,
  className = "",
  onHide,
  closeButton = false,
  overlay = true,
  isInModal = false,
  mainClassName = ""
}) => {
  const [show, setShow] = useState(display)
  const [effect, setEffect] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timer = useRef<any>(null)

  const handleChange = (change: boolean) => {
    if (onHide) {
      onHide(change)
    } else {
      setShow(false)
    }
  }
  useEffect(() => {
    if (show) {
      timer.current = setTimeout(() => {
        setAnimateIn(true)
      }, 100)
    } else {
      timer.current = setTimeout(() => {
        setAnimateIn(false)
      }, 100)
    }
  }, [show])

  useEffect(() => {
    setShow(display)
    if (!isInModal) {
      if (display) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = "auto"
      }
    }
    return () => {
      document.body.style.overflow = "auto"
      clearTimeout(timer.current)
    }
  }, [display, isInModal])

  return (
    <>
      {show && (
        <div
          aria-disabled
          onClick={() => {
            if (dismissable) {
              handleChange(false)
            } else {
              setEffect(true)
            }
          }}
          className={twMerge(
            "fixed z-[2147483644] top-0 left-0 w-full h-full flex justify-center items-center overflow-y-auto py-[15vh] pt-[25vh] md:py-0 px-2",
            overlay ? "bg-[#282727cf]" : "",
            mainClassName
          )}
        >
          <div>
            <div
              aria-disabled
              onClick={(event) => {
                event.stopPropagation()
                //   setEffect(true);
              }}
              onAnimationEnd={() => {
                setEffect(false)
              }}
              className={twMerge(
                `${effect && "animate-scale"} ${
                  !animateIn && "-translate-y-[250%]"
                } transition-transform duration-300 relative mx-auto px-4 py-4 border  h-fit max-w-96 md:w-96 shadow-lg rounded-xl bg-white `,
                className
              )}
            >
              {closeButton && (
                <IconButton
                  onClick={() => {
                    handleChange(false)
                  }}
                  className="absolute right-2 top-2"
                  icon={<CrossOutlineIcon className="text-black" />}
                />
              )}
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
