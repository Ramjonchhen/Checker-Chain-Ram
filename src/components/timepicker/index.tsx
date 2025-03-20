import { ClockOutlineIcon } from "assets/icons"
import React, { useRef, useState } from "react"
import dayjs from "lib/dateLib"
import { useClickOutside } from "hooks/useOutsideClick"
import { useController } from "react-hook-form"

type TimePickerProps = {
  label: string
  name: string
  errorMessage?: string
  onTimeChange?: (val: string) => void
  required?: boolean
}

const TimePicker: React.FC<TimePickerProps> = ({
  label,
  name,
  errorMessage = "",
  onTimeChange = () => {},
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined
  )
  const timePickerRef = useRef<HTMLDivElement>(null)
  // const inputRef = useRef(null)

  const {
    field,
    field: { onChange }
  } = useController({
    name
  })

  useClickOutside(timePickerRef, {
    onClickOutside: () => {
      setIsOpen(false)
    }
  })

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(event.target.value)
    onTimeChange(event.target.value)
  }

  return (
    <div className="relative w-full">
      <div
        className="rounded-lg min-h-[40px] flex w-full items-center gap-2 cursor-pointer bg-neutral-50 px-2 py-1"
        onClick={handleClick}
      >
        <div>
          <ClockOutlineIcon />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] leading-[15px] font-medium text-neutral-200">
            {label} {required && <span className="text-[#ef0000]">*</span>}
          </span>
          <span className="text-neutral-700 font-semibold text-lg leading-[27px]">
            {selectedTime &&
              dayjs(new Date(`2000-01-01T${selectedTime}:00`)).format("h:mm a")}
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-10 " ref={timePickerRef}>
          <input
            type="time"
            // value={selectedTime}
            // onChange={handleTimeChange}
            className="border border-gray-300 rounded-md p-2"
            {...field}
            onChange={(e) => {
              onChange(e)
              handleTimeChange(e)
            }}
            autoFocus
          />
        </div>
      )}
      {errorMessage && (
        <p
          className={`${"text-error"} italic text-xs leading-[18px] ml-3 mt-2`}
        >
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export default TimePicker
