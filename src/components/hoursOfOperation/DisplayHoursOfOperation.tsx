import { ChevronDownIcon } from "assets/icons"
import React, { useState } from "react"

interface OperatingHour {
  openTime: string
  closeTime: string
  day: number
}

export interface OperatingHoursData {
  availableAllTime: boolean
  days: OperatingHour[]
  _id: string
}

const DaysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]

const OperatingHoursAccordion: React.FC<{ data: OperatingHoursData }> = ({
  data
}) => {
  const [expanded, setExpanded] = useState(false)

  const toggleAccordion = () => {
    setExpanded((prevExpanded) => !prevExpanded)
  }

  const getCurrentDayInfo = () => {
    const currentDay = new Date().getUTCDay()
    const currentDayInfo = data?.days[currentDay]

    if (currentDayInfo?.openTime && currentDayInfo?.closeTime) {
      const currentTime = new Date()
      const openTimeParts = currentDayInfo.openTime.split(":")
      // const closeTimeParts = currentDayInfo.closeTime.split(":")
      const openHour = parseInt(openTimeParts[0], 10)
      const openMinute = parseInt(openTimeParts[1], 10)
      // const closeHour = parseInt(closeTimeParts[0], 10)
      // const closeMinute = parseInt(closeTimeParts[1], 10)

      if (
        currentTime.getUTCHours() > openHour ||
        (currentTime.getUTCHours() === openHour &&
          currentTime.getUTCMinutes() >= openMinute)
      ) {
        return (
          <div className="text-success  text-sm leading-[18px] font-medium">
            Open now -{" "}
            <span className="text-error">
              Closes at {currentDayInfo?.closeTime}
            </span>
          </div>
        )
      } else {
        return (
          <div className="text-error  text-sm leading-[18px] font-medium">
            Closed now
          </div>
        )
      }
    } else {
      return (
        <div className="text-error  text-sm leading-[18px] font-medium">
          Closed now
        </div>
      )
    }
  }

  return (
    <div className="">
      <div className="h-[2px] w-full bg-separator my-6" />
      <h2 className="text-neutral-900 text-base font-semibold leading-6 mb-2">
        Operating Hours (UTC)
      </h2>
      {data?.availableAllTime ? (
        <p className="text-success text-sm leading-[18px] font-medium">
          Open 24/7
        </p>
      ) : (
        <div>
          <div
            className="cursor-pointer flex justify-between items-center"
            onClick={toggleAccordion}
            role="button"
          >
            {getCurrentDayInfo()}
            <ChevronDownIcon
              className={`transition-all duration-200 w-4 h-4 ml-2 text-neutral-600 ${
                expanded && "transform rotate-180"
              }`}
            />
          </div>
          {expanded && (
            <ul className="mt-2 space-y-2">
              {data?.days?.map((day) => (
                <li
                  key={day?.day}
                  className="flex justify-between items-center"
                >
                  <span className="font-semibold text-neutral-900 text-sm">
                    {DaysOfWeek[day?.day]}:
                  </span>
                  {day?.openTime && day?.closeTime ? (
                    <span className="text-success text-sm">
                      {day.openTime} - {day.closeTime}
                    </span>
                  ) : (
                    <span className="text-red-500">Closed</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default OperatingHoursAccordion
