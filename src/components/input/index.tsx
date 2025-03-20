import { CheckTickIcon } from "assets/icons"
import { IconButton } from "components/iconButton"
import React, { FC, useEffect, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import { InputProps, TextAreaProps } from "./index.d"

export const Input: FC<InputProps> = React.forwardRef<
  HTMLInputElement,
  InputProps
>(
  (
    props: InputProps,
    ref: React.ForwardedRef<HTMLInputElement>
  ): JSX.Element => {
    const {
      error = false,
      helper,
      value,
      label,
      className,
      inputClassName,
      endIcon,
      isNotCopy = false,
      labelClassName = "",
      ...rest
    } = props

    const inputRef = useRef<HTMLInputElement>(null)
    const [iconButtonStyle, setIconButtonState] = useState({
      height: ""
    })
    const [origin, setOrigin] = useState("")
    const [copying, setCopying] = useState(false)
    useEffect(() => setOrigin(window.location.origin), [])
    useEffect(() => {
      if (inputRef) {
        setIconButtonState({
          height: `${inputRef.current?.scrollHeight}px`
        })
      }
    }, [inputRef, ref])
    return (
      <div className={className}>
        {label !== "" && (
          <label
            className={twMerge(
              "block text-content-primary leading-6 text-xs font-semibold mb-1",
              labelClassName
            )}
          >
            {label} {rest.required && <span className="text-[#ef0000]">*</span>}
          </label>
        )}
        <div className={twMerge(`w-full`, "flex")}>
          <input
            className={twMerge(
              `${inputClassName ?? ""} w-full focus:outline-none outline-none`,
              endIcon ? "rounded-tr-none rounded-br-none" : ""
            )}
            value={value}
            {...rest}
            ref={ref ? ref : inputRef}
          />
          {endIcon &&
            (isNotCopy ? (
              endIcon
            ) : (
              <IconButton
                style={iconButtonStyle}
                onClick={() => {
                  setCopying(true)
                  navigator.clipboard.writeText(
                    `${origin}/?referrer=${value ?? ""}`
                  )
                  setTimeout(() => {
                    setCopying(false)
                  }, 2000)
                }}
                className="bg-primary rounded-md rounded-tl-none rounded-bl-none w-20 h-fit"
                icon={
                  copying ? (
                    <CheckTickIcon className="w-6 h-6 text-white animate-scale" />
                  ) : (
                    endIcon
                  )
                }
              />
            ))}
        </div>
        {helper !== "" && (
          <p
            className={`${
              error ? "text-error" : "text-content-secondary"
            } italic text-xs leading-[18px] ml-3 mt-2`}
          >
            {helper
              ?.toString()
              .split("\n")
              .map((item, i) => (
                <span key={i}>
                  {item}
                  <br />
                </span>
              ))}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "InputComponent"

export const TextArea: FC<TextAreaProps> = React.forwardRef<
  HTMLTextAreaElement,
  TextAreaProps
>(
  (
    props: TextAreaProps,
    ref: React.ForwardedRef<HTMLTextAreaElement>
  ): JSX.Element => {
    const {
      error = false,
      helper,
      value,
      label,
      className,
      inputClassName,
      endIcon,
      max,
      rows = 5,
      labelClassName = "",
      ...rest
    } = props

    const inputRef = useRef<HTMLTextAreaElement>(null)
    const [textSize, setTextSize] = useState(value?.length ?? 0)
    const [iconButtonStyle, setIconButtonState] = useState({
      height: ""
    })
    const [origin, setOrigin] = useState("")
    useEffect(() => setOrigin(window.location.origin), [])
    useEffect(() => {
      if (inputRef) {
        setIconButtonState({
          height: `${inputRef.current?.scrollHeight}px`
        })
      }
    }, [inputRef, ref])
    return (
      <div className={className}>
        {label !== "" && (
          <label
            className={twMerge(
              "block text-content-primary leading-6 text-xs font-semibold mb-1",
              labelClassName
            )}
          >
            {label} {rest.required && <span className="text-[#ef0000]">*</span>}
          </label>
        )}
        <div className={twMerge(`${inputClassName ?? ""} w-full`, "flex")}>
          <textarea
            rows={rows}
            className={twMerge(
              `w-full focus:outline-none outline-none min-h-[100px]`,
              endIcon ? "rounded-tr-none rounded-br-none" : "",
              inputClassName ?? ""
            )}
            value={value}
            {...rest}
            ref={ref ? ref : inputRef}
            onKeyDown={(e) => {
              setTextSize((e.target as HTMLTextAreaElement).value.length)
            }}
          />
          {endIcon && (
            <IconButton
              style={iconButtonStyle}
              onClick={() => {
                navigator.clipboard.writeText(
                  `${origin}/?referrer=${value ?? ""}`
                )
              }}
              className="bg-primary rounded-md rounded-tl-none rounded-bl-none w-20 h-fit"
              icon={endIcon}
            />
          )}
        </div>
        <div className="flex justify-between items-center mt-2">
          {helper !== "" && (
            <p
              className={`${
                error ? "text-error" : "text-content-secondary"
              } italic text-xs leading-[18px] ml-3`}
            >
              {helper}
            </p>
          )}
          {max && (
            <span className="text-xs">
              {textSize}/{max}
            </span>
          )}
        </div>
      </div>
    )
  }
)
TextArea.displayName = "TextAreaComponent"
