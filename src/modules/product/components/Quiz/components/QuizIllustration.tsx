import { TrcmImage1 } from "assets/images/trcm"
import { twMerge } from "tailwind-merge"

type Props = {
  text?: string
  className?: string
}

function QuizIllustration({ text = "", className = "" }: Props) {
  return (
    <div
      className={twMerge(
        "flex items-center justify-center flex-col gap-2",
        className
      )}
    >
      <TrcmImage1 />
      <div className="text-xs leading-[18px] font-medium text-neutral-400 text-center">
        {text}
      </div>
    </div>
  )
}

export default QuizIllustration
