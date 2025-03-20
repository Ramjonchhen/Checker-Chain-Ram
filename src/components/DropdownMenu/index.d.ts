import React from "react";

interface DynamicObject {
    label: string
    onClick?: ()=>void
}

export type DynamicValues = DynamicObject

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
    items: DynamicValues[],
    children: React.ReactNode
}