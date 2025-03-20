import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from "react"
import TimeRangePicker from "./TimeRangePicker"
import { twMerge } from "tailwind-merge"

const OperationType = {
  Online: "online",
  Onsite: "onsite"
}

type IOperationData = {
  availableAllTime: boolean
  days?: { openTime: string; closeTime: string; day: number }[]
}

export interface HoursOfOperationRef {
  finalData: () => void
  hasErrors: boolean
}

export const OperationTabs = ({
  isSelected,
  operationType,
  onClick
}: {
  isSelected: boolean
  operationType: string
  onClick: (operationType: string) => void
}) => {
  const label = operationType === OperationType.Online ? "(24/7)" : "(UTC)"
  return (
    <div
      role="button"
      className={twMerge(
        "h-9  shadow-sm flex-1 text-[10px] flex items-center justify-center capitalize ",
        isSelected
          ? "bg-primary-500 text-white"
          : " bg-neutral-50 text-neutral-900"
      )}
      onClick={() => onClick(operationType)}
    >
      {operationType + " " + label}
    </div>
  )
}

export type IDays = 0 | 1 | 2 | 3 | 4 | 5 | 6

const initialState: Record<IDays, { openTime: string; closeTime: string }> = {
  0: { openTime: "", closeTime: "" },
  1: { openTime: "", closeTime: "" },
  2: { openTime: "", closeTime: "" },
  3: { openTime: "", closeTime: "" },
  4: { openTime: "", closeTime: "" },
  5: { openTime: "", closeTime: "" },
  6: { openTime: "", closeTime: "" }
}

const HoursOfOperation = forwardRef<HoursOfOperationRef | any>((props, ref) => {
  const [selectedOperation, setSelectedOperation] = useState<string>(
    OperationType.Online
  )
  const [operationTimes, setOperationTimes] =
    useState<Record<IDays, { openTime: string; closeTime: string }>>(
      initialState
    )

  const [hasErrors, setHasErrors] = useState<boolean>(false)

  const handleOperationTabClick = (operation: string) => {
    setSelectedOperation(operation)
  }

  const handleTimeChange = (
    day: IDays,
    openTime: string,
    closeTime: string
  ) => {
    setOperationTimes((prevTimes) => ({
      ...prevTimes,
      [day]: { openTime, closeTime }
    }))
  }

  const finalData = (): IOperationData => {
    let operation: IOperationData = {
      availableAllTime: selectedOperation === OperationType.Online
    }

    if (selectedOperation === OperationType.Onsite) {
      const finallArray = Object.keys(operationTimes).map((day) => {
        const { openTime, closeTime } = operationTimes[Number(day) as IDays]
        return {
          openTime,
          closeTime,
          day: parseInt(day, 10)
        }
      })
      operation = { ...operation, days: finallArray }
    }
    return operation
  }

  const validateTimeRange = (start: string, end: string): boolean => {
    const openTimeDate = new Date(`2000-01-01T${start}`)
    const closeTimeDate = new Date(`2000-01-01T${end}`)
    return !!start && !!end && openTimeDate < closeTimeDate
  }

  const validateAllTimeRanges = (
    times: Record<IDays, { openTime: string; closeTime: string }>
  ) => {
    let hasError = false

    Object.keys(times).forEach((day) => {
      const { openTime, closeTime } = times[Number(day) as IDays]
      if (!validateTimeRange(openTime, closeTime)) {
        hasError = true
      }
    })
    setHasErrors(hasError)
  }

  useEffect(() => {
    validateAllTimeRanges(operationTimes)
  }, [operationTimes])

  useImperativeHandle(ref, () => ({
    finalData,
    hasErrors
  }))

  return (
    <div className="mt-4" ref={ref}>
      <div className="text-xs leading-6 tracking-[0.02em] font-medium text-neutral-700">
        Hours of Operation <span className="text-[#ef0000]">*</span>
      </div>
      <div className="flex rounded-[5px] overflow-hidden">
        <OperationTabs
          operationType={OperationType.Online}
          isSelected={selectedOperation === OperationType.Online}
          onClick={() => handleOperationTabClick(OperationType.Online)}
        />
        <OperationTabs
          operationType={OperationType.Onsite}
          isSelected={selectedOperation === OperationType.Onsite}
          onClick={() => handleOperationTabClick(OperationType.Onsite)}
        />
      </div>
      {selectedOperation === OperationType.Onsite && (
        <div>
          {Object.keys(initialState).map((day) => (
            <TimeRangePicker
              key={day}
              day={Number(day) as IDays}
              onTimeChange={handleTimeChange}
            />
          ))}
        </div>
      )}
      {hasErrors && selectedOperation === OperationType.Onsite && (
        <div
          className={`${"text-error"} italic text-xs leading-[18px] ml-3 mt-2`}
        >
          One or more time ranges have errors.
        </div>
      )}
    </div>
  )
})

HoursOfOperation.displayName = "HoursOfOperation"
export default HoursOfOperation
