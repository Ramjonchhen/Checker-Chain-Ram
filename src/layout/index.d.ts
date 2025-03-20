import React from "react"

export type LayoutProps = {
    children: React.ReactNode
    meta?: {
        title: string
        description: string
        url: string
        image: string
    }
}
