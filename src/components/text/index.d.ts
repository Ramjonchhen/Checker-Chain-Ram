import React from "react"

export type TextVariant = "body" | "title" | "subtitle" | "modal-header" | ""

export interface TextProps extends React.HTMLProps<HTMLElement> {
  variant?: TextVariant
  children: React.ReactNode | string
}
