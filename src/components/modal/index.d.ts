import { ReactNode } from "react";

export interface ModalProps {
    display?: boolean;
    dismissable?: boolean;
    children: ReactNode;
    onHide?: (arg0: boolean) => void;
    className?: string;
    closeButton?: boolean
    overlay?: boolean,
    isInModal?: boolean
    mainClassName?: string
}