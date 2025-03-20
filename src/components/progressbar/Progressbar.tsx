import { twMerge } from "tailwind-merge"

type Props = {
  progressPercent: number
  className?: string
  progressValueClassname?: string
}

const Progressbar = ({
  progressPercent,
  className = "",
  progressValueClassname = ""
}: Props) => {
  
  return (
    <div
      className={twMerge("w-full bg-[#D9D9D9] h-2 rounded-[4px]", className)}
    >
      <div
        style={{ width: `${progressPercent}%`, maxWidth: "100%" }}
        className={twMerge(
          `h-full bg-[#F25972] rounded-[4px] transition-width duration-300`,
          progressValueClassname
        )}
      />
    </div>
  )
}

export default Progressbar
