import { CheckTickIcon } from "assets/icons"
import { Card } from "components/card"
import { ReactNode } from "react"
import { useController } from "react-hook-form"
import { twMerge } from "tailwind-merge"

interface CheckboxProps {
  name: string
  label?: string
  disabled?: boolean
  className?: string
  checked: boolean
  logo: ReactNode
}

const Checkbox: React.FC<CheckboxProps> = ({
  name,
  label,
  disabled,
  className,
  checked,
  logo
}) => {
  const { field } = useController({
    name
  })

  return (
    <div
      className={twMerge(
        "flex items-center rounded-[4px] min-w-[160px]",
        className
      )}
    >
      <input
        type="checkbox"
        id={`${name}-input`}
        className="hidden"
        disabled={disabled}
        {...field}
      />
      <label
        htmlFor={`${name}-input`}
        className="cursor-pointer select-none  w-full"
      >
        <Card
          className={twMerge(
            "p-0 h-40 w-full rounded-[4px] overflow-hidden transition-[border] duration-300",
            checked
              ? "border-2 border-primary-900 "
              : "border-2 border-transparent"
          )}
        >
          <div className="flex flex-col h-full relative ">
            <div className="absolute right-2 top-2 h-5 w-5 grid place-items-center  rounded-[50%]  border border-neutral-200">
              <div className="bg-primary-500 overflow-hidden rounded-[50%]">
                {checked && <CheckTickIcon className="text-white scale-75" />}
              </div>
            </div>

            <div className=" flex h-[130px] items-center justify-center rounded-t-[4px]">
              {logo}
            </div>
            <div
              className={twMerge(
                "h-[30px] flex justify-center items-center text-center text-xs font-semibold leading-6 transition-colors duration-300",
                checked
                  ? "bg-primary-900 text-white"
                  : "bg-primary-50 text-primary-900 font-medium"
              )}
            >
              {label}
            </div>
          </div>
        </Card>
      </label>
    </div>
  )
}

export default Checkbox
