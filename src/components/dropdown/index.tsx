import { Transition } from "@headlessui/react";
import { FC, Fragment, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { DropdownProps, PositionStyle } from "./index.d";

const getPositionStyle = (position: PositionStyle) => {
  switch (position) {
    case "left":
      return `left-0`;
    case "right":
      return `right-0`;
    default:
      return null;
  }
};
const getVariantStyle = (variant: "default" | "light") => {
  switch (variant) {
    case "light":
      return `bg-background-primary`;
    case "default":
      return `bg-background-light`;
    default:
      return null;
  }
};

export const Dropdown: FC<DropdownProps> = (props) => {
  const {
    children,
    show,
    className,
    position = "right",
    variant = "default",
    ...rest
  } = props;

  const [dropDownWrapperRef, setDropdownWrapper] =
    useState<HTMLDivElement | null>(null);

  const isInViewport = (element: HTMLElement) => {
    const clientRect = element.getBoundingClientRect();
    return (
      clientRect.top >= 0 &&
      clientRect.left >= 0 &&
      clientRect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      clientRect.right <=
        (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  useEffect(() => {
    if (show && dropDownWrapperRef) {
      setTimeout(() => {
        const element = dropDownWrapperRef.querySelector(
          ".absolute"
        ) as HTMLDivElement;
        if(element){
          if ( isInViewport(element)) {
            element.style.top = `${
              parseInt(
                element
                  .getAttribute("class")
                  ?.match(/bottom-\d+/)
                  ?.join()
                  .replace("bottom-", "") || "0"
              ) * 4 || "null"
            }`;
  
            element.setAttribute(
              "class",
              element.getAttribute("class")?.replace("bottom", "top") || ""
            );
          } else {
            element.style.bottom = `${
              parseInt(
                element
                  .getAttribute("class")
                  ?.match(/top-\d+/)
                  ?.join()
                  .replace("top-", "") || "0"
              ) * 4
            }px`;
  
            element.setAttribute(
              "class",
              element.getAttribute("class")?.replace("top", "bottom") || ""
            );
          }
        }
      }, 10);
    }
  }, [dropDownWrapperRef, show]);

  const positionStyle = getPositionStyle(position);
  const variantStyles = getVariantStyle(variant);
  const defaultClasses = `divide-y divide-outline-secondary top-10 z-10 ${positionStyle} ${variantStyles}`;

  return (
    <div className="" ref={setDropdownWrapper}>
      <Transition
        as={Fragment}
        show={show}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-75"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-200"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-75"
      >
        <div
          className={twMerge(
            `!z-50 absolute flex  flex-col rounded-lg ${defaultClasses}`,
            className ?? ""
          )}
          {...rest}
        >
          {children}
        </div>
      </Transition>
    </div>
  );
};
