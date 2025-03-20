import { twMerge } from "tailwind-merge"

type Props = {
  options: { value: string; label: string }[]
  onSelect: (val: string) => void
  value: string | undefined
}

function QuizRadioGroup({ options, onSelect, value }: Props) {
  return (
    <div className="flex flex-col mt-4 gap-4">
      {options.map((option) => (
        <div key={`${option.label}-${option.value}`}>
          <div
            className={twMerge(
              "px-3 py-1 rounded-lg cursor-pointer border  flex justify-center items-center hover:bg-primary-50 hover:border-primary-700 hover:text-primary-900 transition-colors ",
              value === option.value
                ? "bg-primary-50 border-primary-700 text-primary-900 font-semibold"
                : "bg-white"
            )}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </div>
        </div>
      ))}
    </div>
  )
}

export default QuizRadioGroup
