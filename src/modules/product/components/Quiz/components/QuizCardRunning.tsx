import { Dispatch, SetStateAction } from "react"
import { Button } from "components"
import { CrossOutlineIcon, ArrowRightIcon } from "assets/icons"
import QuizIllustration from "modules/product/components/Quiz/components/QuizIllustration"
import QuestionAnswer from "modules/product/components/Quiz/QuestionAnswer"
import { IQuizQuestionData } from "stores/quiz"
import { IAnswerType } from "modules/product/components/Quiz/QuizCard"
import ErrorText from "components/errorText"
import { LoadingIcon } from "assets/icons"

type Props = {
  isQuizEntryDesc: boolean
  setShowQuizCard: Dispatch<SetStateAction<boolean>>
  quizQuestions: IQuizQuestionData[]
  currentQuestionIndex: number
  answers: IAnswerType
  setAnswers: Dispatch<SetStateAction<IAnswerType>>
  formError: string
  handleNextQuestion: () => void
  isFirstQuestion: boolean
  handlePreviousQuestion: () => void
  productName: string
  handleOneTouchNextQuestion: () => void
  isFinalQuestion: boolean
  quizPageText: string[]
  isSubmitting: boolean
}

function QuizCardRunning({
  isQuizEntryDesc,
  setShowQuizCard,
  quizQuestions,
  currentQuestionIndex,
  answers,
  setAnswers,
  formError,
  handleNextQuestion,
  handlePreviousQuestion,
  isFirstQuestion,
  productName,
  handleOneTouchNextQuestion,
  isFinalQuestion,
  quizPageText,
  isSubmitting
}: Props) {
  const disabledBtnCondition = isSubmitting
    ? true
    : isQuizEntryDesc
    ? false
    : quizQuestions?.[currentQuestionIndex]?.inputField === "Rating"
    ? false
    : !answers?.[quizQuestions?.[currentQuestionIndex]?._id!]

  return (
    <div className="flex flex-col justify-between  h-full">
      <div>
        <div className="px-5 pt-7">
          <div className="flex justify-between items-center">
            <div className="text-netural-900 font-semibold text-xl leading-[42px]">
              {isQuizEntryDesc
                ? "Review Questionaires"
                : `Review for ${productName}`}
            </div>
            <Button
              startIcon={<CrossOutlineIcon className="text-black" />}
              onClick={() => setShowQuizCard(false)}
              variant="text"
              className="p-0"
            />
          </div>
        </div>
        <div className="formsection">
          {isQuizEntryDesc ? (
            <div className="px-5">
              <div className="text-neutral-600 text-xs leading-[18px] tracking-[0.01em] ">
                Before you begin, make sure you have a good internet connection.
              </div>
              <QuizIllustration className="items-start" />
            </div>
          ) : (
            <>
              <QuestionAnswer
                currentQuestion={quizQuestions[currentQuestionIndex]}
                answers={answers}
                setAnswers={setAnswers}
                handleOneTouchNextQuestion={handleOneTouchNextQuestion}
              />
              <ErrorText text={formError} className="ml-10" />
            </>
          )}

          <div className="px-5 mt-8">
            <div className="flex justify-between items-center">
              <Button
                type="button"
                onClick={handleNextQuestion}
                disabled={disabledBtnCondition}
                endIcon={
                  isSubmitting ? (
                    <LoadingIcon className="w-5 h-5 text-white" />
                  ) : (
                    <ArrowRightIcon className="text-white rotate-180 scale-75" />
                  )
                }
                title={
                  isQuizEntryDesc
                    ? "Start Reviewing"
                    : isFinalQuestion
                    ? "Submit Review"
                    : "Continue"
                }
              />
              {!isFirstQuestion && !isQuizEntryDesc && (
                <Button
                  title="Go Back"
                  variant="text"
                  onClick={handlePreviousQuestion}
                  type="button"
                  className="text-neutral-400"
                  startIcon={
                    <ArrowRightIcon className="text-neutral-400 scale-75" />
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {currentQuestionIndex >= 0 && (
        <div className="mt-auto px-2">
          <QuizIllustration text={quizPageText?.[currentQuestionIndex] ?? ""} />
        </div>
      )}
    </div>
  )
}

export default QuizCardRunning
