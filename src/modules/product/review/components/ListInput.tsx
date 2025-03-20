import React from "react"
import { Input } from "components"

interface ListInputProps {
  label?: string
  required?: boolean
  values?: string[]
  onChange?: (val: string[]) => void
  limit?: number
}

export const ListInput: React.FC<ListInputProps> = ({
  label,
  required,
  values = [],
  limit = 5,
  onChange
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    if (values.length === 0) {
      onChange && onChange([""])
    }
  }, [values, onChange])
  return (
    <div>
      {label !== "" && (
        <label className="block text-content-primary leading-6 text-xs font-semibold mb-1">
          {label} {required && <span className="text-[#ef0000]">*</span>}
        </label>
      )}
      <div className="flex-col gap-4 flex">
        {values.map((each, index) => (
          <Input
            type="text"
            key={`input-${index}`}
            autoFocus={index === values.length - 1 && index !== 0}
            value={each}
            onChange={(e) => {
              onChange &&
                onChange(
                  values.map((item, ind) =>
                    ind === index ? e.target.value : item
                  )
                )
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && values.length < limit && !!each) {
                e.preventDefault()
                onChange && onChange([...values, ""])
              }
              if (e.key === "Backspace" && each === "") {
                e.preventDefault()
                const front = [...values]
                const back = [...values]

                onChange &&
                  onChange(
                    index === values.length - 1
                      ? values.splice(0, index)
                      : [
                          ...front.splice(0, index),
                          ...back.splice(index + 1, values.length - 1)
                        ]
                  )
                inputRef.current && inputRef.current.focus()
              }
            }}
          />
        ))}
      </div>
    </div>
  )
}
