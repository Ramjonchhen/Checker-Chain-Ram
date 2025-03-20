import { Dispatch, SetStateAction } from "react"
import { TokenIcons } from "assets/icons"
import { TrcmCompletedClapImage } from "assets/images/trcm"
import { Button } from "components"

type Props = {
  setShowQuizCard: Dispatch<SetStateAction<boolean>>
}

function QuizCardCompleted({ setShowQuizCard }: Props) {
  return (
    <div>
      <div className="bg-primary-700 pb-[15px] pt-3 flex flex-col items-center justify-center gap-1">
        <div>
          <TokenIcons.MiniCheckrIcon />
        </div>
        <div className="text-sm leading-[21px] tracking-[0.02em] text-white font-medium">
          Thankyou for your review.
        </div>
      </div>
      <div className="mt-[75px] flex flex-col justify-center items-center text-center px-20">
        <div>
          <TrcmCompletedClapImage />
        </div>
        <div className="font-georgia text-primary-700 text-xl leading-[23px] tracking-[0.01em] font-bold">
          Your Review has been submitted!
        </div>
        <div className="text-xs leading-4 tracking-[0.03em] font-normal text-neutral-600 mt-1">
          We will analyze your review and get back to you when it is complete.
          Your rewards will be airdropped soon.
        </div>
        <div className="mt-5">
          <Button
            title="Back to Products"
            variant="outlined"
            onClick={() => setShowQuizCard(false)}
            type="button"
            className="text-neutral-400"
          />
        </div>
      </div>
    </div>
  )
}

export default QuizCardCompleted
