// import * as Icons from "assets/icons"
import { Dropdown } from "components/dropdown"
import { useClickOutside } from "hooks/useOutsideClick"
import { FC, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import { DropdownMenuProps } from "./index.d"

export const DropdownMenu: FC<DropdownMenuProps> = ({
  items,
  children,
  className = ""
}) => {
  const dropDownWrapperRef = useRef(null)
  const [showDropdown, setShowDropdown] = useState(false)

  useClickOutside(dropDownWrapperRef, {
    onClickOutside: () => setShowDropdown(false)
  })

  return (
    <div>
      <div className="relative" ref={dropDownWrapperRef}>
        <div onClick={() => setShowDropdown(!showDropdown)}>{children}</div>

        <Dropdown
          className={twMerge("bg-white border border-separate w-[180px] mt-2 rounded-lg p-1 shadow-md", className)}
          show={showDropdown}
          position="right"
        >
          <>
            {items.map((each, index) => {
              return (
                <div
                  key={index}
                  className="hover:bg-background-light bg-white px-5 py-[10px] cursor-pointer text-sm flex items-center"
                  onClick={() => {
                    each.onClick && each.onClick()
                    setShowDropdown(false)
                  }}
                >
                  {each.label}
                </div>
              )
            })}
          </>
        </Dropdown>
      </div>
    </div>
  )
}
