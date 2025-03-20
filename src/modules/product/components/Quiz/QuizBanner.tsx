import { Dispatch, SetStateAction } from "react"
import { constants } from "constants/common"
import { twMerge } from "tailwind-merge"
import QuizBannerProductCountdDown from "modules/product/components/Quiz/QuizBannerProductCountDown"
import { Button } from "components"

type Props = {
  reviewDeadline: number
  setShowQuizCard: Dispatch<SetStateAction<boolean>>
  setDefaultActiveTab: Dispatch<SetStateAction<number>>
}

function QuizBanner({
  reviewDeadline,
  setShowQuizCard,
  setDefaultActiveTab
}: Props) {
  return (
    <div
      className={twMerge(
        "w-full bg-red fixed top-[72px] left-0 right-0 z-20 md:h-20 gradient-1 py-[6px]"
      )}
    >
      <div className={twMerge("h-full", constants.APP_CONTAINER_WIDTH)}>
        <div className="h-full flex justify-between items-center flex-col md:flex-row gap-4">
          <QuizBannerProductCountdDown
            epochTime={Math.floor(reviewDeadline / 1000)}
          />
          <div className="flex gap-4 md:gap-8 items-center flex-col md:flex-row">
            <div className="text-white font-semibold text-base leading-[14px] text-center">
              Complete your tasks to claim exciting rewards.
            </div>
            <div>
              <Button
                title="Start Reviewing"
                variant="outlined"
                className="text-white tracking-[0.01em] outline-white  hover:text-primary hover:outline-white hover:bg-white"
                onClick={() => {
                  setShowQuizCard(true)
                  setDefaultActiveTab(1)
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizBanner
