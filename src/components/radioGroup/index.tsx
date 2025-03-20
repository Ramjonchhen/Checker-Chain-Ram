import { useFormContext, Controller } from "react-hook-form"

type Props = {
  label?: string
  name: string
  options: { value: string; label: string }[]
  // control: Control<FieldValues, any>
}

const RadioGroup = ({ name, options }: Props) => {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: true
      }}
      defaultValue={undefined}
      render={({ field: { onChange, value } }) => {
        return (
          <div className="flex gap-6">
            {options.map((option) => (
              <div key={`${name} ${option.value}`}>
                <input
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  className={
                    "checked:text-primary-500 focus:ring-0 cursor-pointer"
                  }
                  name={name}
                />
                <label
                  htmlFor={option.value}
                  className="ml-3 text-sm leading-5 text-neutral-900"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        )
      }}
    />
  )
}

export default RadioGroup
