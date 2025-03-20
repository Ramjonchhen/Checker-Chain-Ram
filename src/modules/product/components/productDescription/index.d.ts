export interface AboutProductProps {
  description?: string
  isCreateProduct?: boolean
}

export type IContactLinks = {
  value: string
  hrefLink: string
  icon: JSX.Element
  placeHolder?: string
  name: string
}
