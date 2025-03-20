import useCountdownTimer from "hooks/useCountdownTimer"

type ICountDownItem = {
  label: string
  value: number
}

type IQuizBannerProductCountdDown = {
  epochTime: number
}

function CountDownItem({ label = "", value = 0 }: ICountDownItem) {
  return (
    <div className="flex flex-col items-center h-full w-full">
      <div className="min-w-[36px] rounded-lg bg-white min-h-[40px] p-[4px] ">
        <div className=" grid place-items-center rounded-md bg-white quizBanner__countDownTimer-innerShadow px-1 min-h-[32px] h-full w-full">
          <span className="text-base font-semibold leading-[14px] text-neutral-600">
            {value}
          </span>
        </div>
      </div>
      <div className="text-[11px] leading-[14px] gap-[2px] text-white tracking-[0.01em] font-medium p-0 h-fit">
        {label}
      </div>
    </div>
  )
}

// add props for bg
function QuizBannerProductCountdDown({
  epochTime
}: IQuizBannerProductCountdDown) {
  const { hours, minutes, seconds } = useCountdownTimer(epochTime)
  return (
    <div className="flex gap-2 h-full min-w-[251px] px-4 pt-2 pb-[5px] rounded-lg bg-[rgba(255,255,255,0.2)] border border-[rgba(255,255,255,0.4)]">
      <div className="max-w-[90px] text-xs leading-[14px] font-semibold text-white">
        Product Review Ends in:
      </div>
      <div className="h-full flex gap-[2px]">
        <CountDownItem label={"Hour"} value={hours} />
        <div className="text-white mt-[7px] text-xl font-semibold">:</div>
        <CountDownItem label={"Mins"} value={minutes} />
        <div className="text-white mt-[7px] text-xl font-semibold">:</div>
        <CountDownItem label={"Sec"} value={seconds} />
      </div>
    </div>
  )
}

export default QuizBannerProductCountdDown
