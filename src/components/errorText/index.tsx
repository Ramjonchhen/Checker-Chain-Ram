import { twMerge } from "tailwind-merge"

type Props = {
  text: string
  className?: string
}

function ErrorText({ text, className = "" }: Props) {
  if (!text) return null

  return (
    <p
      className={twMerge(
        `text-error italic text-xs leading-[18px] ml-3 mt-2`,
        className
      )}
    >
      {text}
    </p>
  )
}

export default ErrorText
