import { FC } from "react"

interface ToggleProps {
  text: string
  onChange: () => void
  checked?: boolean
}

export const Toggle: FC<ToggleProps> = (props) => {
  const { text } = props
  return (
    <>
      <div>
        <label
          htmlFor="toggle"
          className="w-max flex items-center cursor-pointer relative"
        >
          <input
            type="checkbox"
            id="toggle"
            className="sr-only"
            onChange={props.onChange}
            checked={props.checked}
          />
          <div className="toggle-bg bg-background-light h-[10px] w-[50px] rounded-full"></div>
          <span className="ml-[10px] text-sm font-medium text-content-primary">
            {text}
          </span>
        </label>
      </div>
    </>
  )
}
