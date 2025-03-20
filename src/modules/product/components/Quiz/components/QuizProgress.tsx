import Progressbar from "components/progressbar/Progressbar"
import useCountdownTimer from "hooks/useCountdownTimer"
import QuizBannerProductCountdDown from "../QuizBannerProductCountDown"
import { ClockImage } from "assets/images/trcm"

type Props = {
  totalQuestionsCount: number
  currentQuestionIndex: number
  epochTime: number
}

function QuizStartPageProgress({ epochTime }: { epochTime: number }) {
  return (
    <div className="w-full bg-primary-700 mt-14 px-5 py-4 md:py-2">
      <div className="flex items-center justify-between h-full gap-1 flex-col min-[400px]:flex-row">
        <div>
          <ClockImage />
        </div>
        <div className="h-[67px] w-[281px]">
          <QuizBannerProductCountdDown epochTime={epochTime} />
        </div>
      </div>
    </div>
  )
}

function QuizRunningProgress({
  currentQuestionIndex = 0,
  totalQuestionsCount = 0,
  epochTime = 0
}: Props & { epochTime: number }) {
  const currentQuestionNumber = currentQuestionIndex + 1
  const progressValue = (currentQuestionNumber / totalQuestionsCount) * 100
  const { hours, minutes } = useCountdownTimer(epochTime)

  return (
    <div className="w-full bg-primary-700 mt-8 pr-2 pl-8 pt-4 min-[400px]:pt-0">
      <div className="h-full w-full flex justify-between items-center flex-col min-[400px]:flex-row">
        <div className="flex items-center gap-3">
          <div className="text-white text-xs leading-[18px] font-medium">
            {currentQuestionNumber} of {totalQuestionsCount} answered
          </div>
          <div>
            <Progressbar
              progressPercent={progressValue}
              progressValueClassname="bg-white"
              className="w-[164px] bg-transparent border mr-1"
            />
          </div>
        </div>
        <div className="h-full min-[400px]:border-l-[1px] border-[rgba(255,255,255,0.5)] py-4 pl-2 text-white text-[10px] leading-[15px] tracking-[0.01em font-semibold] text-right">
          Time left: {hours}h {minutes}min
        </div>
      </div>
    </div>
  )
}

function QuizProgress({
  currentQuestionIndex = 0,
  totalQuestionsCount = 0,
  epochTime = 0
}: Props) {
  if (currentQuestionIndex === -1)
    return <QuizStartPageProgress epochTime={epochTime} />

  return (
    <QuizRunningProgress
      totalQuestionsCount={totalQuestionsCount}
      currentQuestionIndex={currentQuestionIndex}
      epochTime={epochTime}
    />
  )
}

export default QuizProgress
