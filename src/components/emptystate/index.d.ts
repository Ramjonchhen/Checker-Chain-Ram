import { ReactNode } from "react"

export interface EmptyDataProps
  extends React.AllHTMLAttributes<HTMLDivElement> {
  message: string
  button?: ReactNode,
  // image?: string,
  title?: string
}
