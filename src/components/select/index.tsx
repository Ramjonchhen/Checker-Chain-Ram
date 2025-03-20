import * as Icons from "assets/icons"
import { Dropdown } from "components/dropdown"
import { Input } from "components/input"
import { useClickOutside } from "hooks/useOutsideClick"
import { FC, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import { SelectProps } from "./index.d"

export const Select: FC<SelectProps> = ({
  label,
  value,
  items,
  placeholder = "",
  onValueChange,
  required = false,
  labelClassName = ""
}) => {
  const dropDownWrapperRef = useRef(null)
  const [showDropdown, setShowDropdown] = useState(false)

  useClickOutside(dropDownWrapperRef, {
    onClickOutside: () => setShowDropdown(false)
  })

  return (
    <div>
      {label !== "" && (
        <label
          className={twMerge(
            "block text-content-primary leading-6 text-xs font-semibold mb-1",
            labelClassName
          )}
        >
          {label} {required && <span className="text-[#ef0000]">*</span>}
        </label>
      )}
      <div className="relative" ref={dropDownWrapperRef}>
        <div onClick={() => setShowDropdown(!showDropdown)}>
          <Input
            type="text"
            inputClassName="cursor-pointer"
            readOnly
            value={value}
            placeholder={placeholder}
          />
          <Icons.ChevronDownIcon className="absolute right-3 top-2.5 cursor-pointer h-6 w-6" />
        </div>

        <Dropdown
          className="mt-6 border border-outline-secondary w-full"
          show={showDropdown}
          position="left"
        >
          {items.map((each, index) => {
            return (
              <div
                key={index}
                className="hover:bg-background-light bg-white px-5 py-[10px] cursor-pointer text-sm flex items-center"
                onClick={() => {
                  onValueChange && onValueChange(each)
                  setShowDropdown(false)
                }}
              >
                {each}
              </div>
            )
          })}
        </Dropdown>
      </div>
    </div>
  )
}
