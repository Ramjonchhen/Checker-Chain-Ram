export interface ChipProps {
    selectable?: boolean;
    title: string;
    onChange?: (checked: boolean) => void;
    isSelected?: boolean;
    onClick?: () => void;
}