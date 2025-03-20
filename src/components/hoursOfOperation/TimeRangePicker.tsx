import React, { useState } from "react"
import { IDays } from "./HoursOfOperation"

interface TimeRangePickerProps {
  day: IDays
  onTimeChange: (day: IDays, openTime: string, closeTime: string) => void
}

const daysMapper: Record<IDays, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday"
}

const TimeRangePicker: React.FC<TimeRangePickerProps> = ({
  day,
  onTimeChange
}) => {
  const [openTime, setOpenTime] = useState<string>("")
  const [closeTime, setCloseTime] = useState<string>("")
  const [error, setError] = useState<string>("")

  const validateTimeRange = (start: string, end: string): boolean => {
    if (!start || !end) {
      setError("Please select both start and end times.")
      return false
    } else if (start >= end) {
      setError("Start time must be earlier than end time.")
      return false
    } else {
      setError("")
      return true
    }
  }

  const handleStartTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newOpenTime = event.target.value
    setOpenTime(newOpenTime)
    if (validateTimeRange(newOpenTime, closeTime)) {
      setError("")
      onTimeChange(day, newOpenTime, closeTime)
    }
  }

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCloseTime = event.target.value
    setCloseTime(newCloseTime)
    if (validateTimeRange(openTime, newCloseTime)) {
      setError("")
      onTimeChange(day, openTime, newCloseTime)
    }
  }

  const currentDay = daysMapper[day]

  return (
    <div className="mt-2">
      <div className="text-[12px] text-neutral-200 leading-5">{currentDay}</div>
      <div className="rounded-lg  flex w-full items-center gap-2 cursor-pointer ">
        <div className="flex-1">
          {/* <label
            htmlFor={`openTime-${day}`}
            className="text-[10px] text-neutral-200"
          >
            Open Time
          </label> */}
          <input
            type="time"
            id={`openTime-${day}`}
            value={openTime}
            onChange={handleStartTimeChange}
            className="border-0 rounded p-2 flex-1 bg-neutral-50 w-full"
          />
        </div>
        <div>-</div>
        <div className="flex-1 ">
          {/* <label
            htmlFor={`closeTime-${day}`}
            className="text-[10px] text-neutral-200"
          >
            Close Time
          </label> */}
          <input
            type="time"
            id={`closeTime-${day}`}
            value={closeTime}
            onChange={handleEndTimeChange}
            className="border-0 rounded p-2 flex-1 bg-neutral-50 w-full"
          />
        </div>
      </div>
      {error && (
        <div
          className={`${"text-error"} italic text-xs leading-[18px] ml-3 mt-2`}
        >
          {error}
        </div>
      )}
    </div>
  )
}

export default TimeRangePicker
