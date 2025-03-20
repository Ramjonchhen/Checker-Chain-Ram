import React, { FC } from "react"
import { twMerge } from "tailwind-merge"
import { ButtonProps, ButtonSize, ButtonVariant } from "./index.d"
import { LoadingIcon } from "assets/icons"

const getButtonSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case "large":
      return "px-6 py-2 text-base font-medium gap-x-2 h-[55px]"
    case "medium":
      return `px-6 py-2 text-sm font-medium gap-x-2 h-9`
    case "small":
      return `px-2 text-button-sm font-medium gap-x-1`
    default:
      return null
  }
}

const getButtonIconStyles = (size: ButtonSize) => {
  switch (size) {
    case "medium":
      return `text-base`
    case "small":
      return `text-button-sm text-center`
    default:
      return "text-base"
  }
}

const getButtonVariantStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case "default":
      return `bg-primary text-white`
    case "outlined":
      return `outline outline-1 text-neutral-700 outline-outline outline-offset-[-1px] hover:text-primary hover:outline-primary`
    case "danger":
      return `bg-error focus:outline-0 text-white`
    case "text":
      return `bg-transparent text-primary`
    default:
      return null
  }
}

export const Button: FC<ButtonProps> = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    props: ButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>
  ): JSX.Element => {
    const {
      children,
      title,
      size = "medium",
      variant = "default",
      className,
      startIcon,
      endIcon,
      titleClassName = "",
      isSubmitting = false,
      ...rest
    } = props

    const sizeStyles = getButtonSizeStyles(size)
    const iconSizeStyles = getButtonIconStyles(size)
    const variantStyles = getButtonVariantStyles(variant)

    return (
      <>
        <button
          className={twMerge(
            `flex items-center justify-center ${sizeStyles} rounded-md whitespace-nowrap transition duration-300 text-content-primary ${variantStyles} ${
              size === "small" && "h-fit py-1"
            }`,
            className ?? "",
            rest.disabled ? "opacity-60 cursor-not-allowed" : ""
          )}
          {...rest}
          ref={ref}
        >
          {children ? (
            children
          ) : (
            <div
              className={`flex items-center justify-center ${title && "gap-2"}`}
            >
              {!!startIcon && (
                <span className={`${iconSizeStyles}`}>{startIcon}</span>
              )}
              <span className={titleClassName}> {title}</span>
              {!!endIcon && (
                <span className={`${iconSizeStyles}`}>{endIcon}</span>
              )}
              {isSubmitting && <LoadingIcon className="w-4 h-4 text-white" />}
            </div>
          )}
        </button>
      </>
    )
  }
)

Button.displayName = "Button"
