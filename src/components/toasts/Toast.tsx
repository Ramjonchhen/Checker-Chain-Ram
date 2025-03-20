import React, { FC, Fragment, useEffect, useState } from "react"
import { Transition } from "@headlessui/react"
import { twMerge } from "tailwind-merge"
import * as Icons from "assets/icons"
import {
  useToastStore,
  ToastPropertiesProps,
  ToastProps,
  defaultAutoCloseTime
} from "stores/toast"

interface ActiveTostProps extends ToastProps {
  position: ToastPropertiesProps["position"]
}

const getPositionStyle = (position: ToastPropertiesProps["position"]) => {
  switch (position) {
    case "bottom-right":
      return `translate-x-full`
    case "top-right":
      return `translate-x-full`
    case "bottom-left":
      return `-translate-x-full`
    case "top-left":
      return `-translate-x-full`
    default:
      return ``
  }
}

export const Toast: FC<ActiveTostProps> = ({ position, ...toast }) => {
  const [showToast, setShowToast] = useState(false)
  const { type, id, title, message, autoClose } = toast

  const { removeToast } = useToastStore((state) => state)

  useEffect(() => {
    //set showToast to true for animation on load
    setShowToast(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      removeToast(id)
    }, toast?.autoClose ?? defaultAutoCloseTime)

    const intervalShowToast = setInterval(
      () => {
        setShowToast(false)
      },
      autoClose ? autoClose - 500 : defaultAutoCloseTime - 500
    )

    return () => {
      clearInterval(interval)
      clearInterval(intervalShowToast)
    }
    // eslint-disable-next-line
  }, [])

  const positionStyle = getPositionStyle(position)

  // const progressBarStyle = {
  //   animationDuration: `${
  //     autoClose
  //       ? (autoClose - 500) / 1000 + "s"
  //       : (defaultAutoCloseTime - 500) / 1000 + "s"
  //   }`
  // }

  const typeClasses = {
    background: type === "info" ? `bg-primary` : `bg-${type}`,
    color: type === "info" ? `text-primary` : `text-${type}`
  }
  return (
    <>
      <Transition
        as={Fragment}
        show={showToast}
        enter="transition-all ease-out duration-500"
        enterFrom={`transform opacity-100 ${positionStyle}`}
        enterTo="transform opacity-100 translate-x-0"
        leave="transition ease-in duration-500"
        leaveFrom="transform opacity-100 translate-x-0"
        leaveTo={`transform opacity-100 ${positionStyle}`}
      >
        <div className="rounded-t-md shadow-2xl overflow-hidden border border-separate">
          <div className="px-4 pt-4 pb-5 flex items-center gap-x-3 bg-white">
            <div
              className={twMerge(
                `h-6 w-6 rounded-full grid place-content-center text-white flex-shrink-0`,
                typeClasses.background
              )}
            >
              {type === "success" ? (
                <Icons.CheckTickIcon />
              ) : type === "error" ? (
                <Icons.CrossOutlineIcon />
              ) : type === "info" ? (
                <Icons.ImageGallerySolidIcon className="w-4.5 h-4.5" />
              ) : (
                ""
              )}
            </div>
            <div className="flex-1 flex flex-col">
              <div
                className={twMerge(
                  `"text-content-primary text-subtitle font-semibold`,
                  typeClasses.color
                )}
              >
                {title ?? <div className=" capitalize">{type}</div>}
              </div>
              <div className="text-content-secondary text-body">
                {typeof message === "string" && message}
              </div>
            </div>
            {/* {transactionHash && (
              <a
                href={`https://solana.fm/tx/${transactionHash}?-solana`}
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  size="small"
                  title="View Explorer"
                  endIcon={<Icons.CheckTickIcon />}
                />
              </a>
            )} */}
          </div>
          {/* <div className="w-full h-0.5 bg-content-contrast relative">
            <div
              className={twMerge(
                `absolute h-full w-0 bg-success animate-progress`,
                typeClasses.background
              )}
              style={progressBarStyle}
            ></div>
          </div> */}
        </div>
      </Transition>
    </>
  )
}
