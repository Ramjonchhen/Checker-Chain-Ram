import { FC } from "react";
import { twMerge } from "tailwind-merge";
import {
    ButtonShape, ButtonSize, IconButtonProps,
    IconButtonVariant
} from "./index.d";

const getIconButtonSizeStyles = (
  size: ButtonSize,
  variant: IconButtonVariant,
) => {
  switch (size) {
    case "medium":
      return `${variant === "plain" ? "text-2xl" : "text-sm"} w-7 h-7`;
    case "small":
      return `w-4 h-4`;
    default:
      return null;
  }
};

const getIconButtonVariantStyles = (variant: IconButtonVariant) => {
  switch (variant) {
    case "default":
      return null;
    case "solid":
      return `border border-outline`;
    case "outlined":
      return `border border-outline bg-transparent`;
    case "plain":
    default:
      return null;
  }
};

const getIconButtonShapeStyles = (shape: ButtonShape) => {
  switch (shape) {
    case "circle":
      return `rounded-full`;
    case "round":
      return `rounded-lg`;
    default:
      return null;
  }
};

export const IconButton: FC<IconButtonProps> = (props)=> {
    const {
      children,
      variant = "default",
      size = "medium",
      shape = "circle",
      className,
      icon,
      buttonRef,
      ...rest
    } = props;
  
    const sizeStyles = getIconButtonSizeStyles(size, variant);
    const variantStyles = getIconButtonVariantStyles(variant);
    const shapeStyles = getIconButtonShapeStyles(shape);
  
    return (
      <>
        <button
          ref={buttonRef}
          className={twMerge(
            `grid place-content-center hover:text-primary text-primary-contrast text-sm focus:outline-0 ${sizeStyles} ${variantStyles} ${shapeStyles}`,
            className ?? "",
          )}
          {...rest}
        >
          {children ? children : icon}
        </button>
      </>
    );
  }