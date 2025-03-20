import { FC } from "react"
import { TextProps, TextVariant } from "./index.d"
import { twMerge } from "tailwind-merge"

const getClassesBasedOnVariant = (variant: TextVariant) => {
  switch (variant) {
    case "body":
      return "text-body"
    case "title":
      return "text-heading-1"
    case "subtitle":
      return "text-heading-3"
    case "modal-header":
      return "font-bold leading-8 text-[25px] block"
    default:
      return ""
  }
}

export const Text: FC<TextProps> = ({ variant = "", children, ...rest }) => {
  const classes = getClassesBasedOnVariant(variant)

  return (
    <span
      {...rest}
      className={twMerge(`${classes}, ${rest.className ? rest.className : ""}`)}
    >
      {children}
    </span>
  )
}
