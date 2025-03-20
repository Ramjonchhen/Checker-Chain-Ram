import { Dispatch, SetStateAction } from "react"
import { IQuizQuestionData } from "stores/quiz"
import DynamicAnswerItem from "./DynamicAnswerItem"
import { IAnswerType } from "./QuizCard"
import { extractPartsSeperatedByColon } from "utils/helper"

type Props = {
  currentQuestion: IQuizQuestionData
  answers: IAnswerType
  setAnswers: Dispatch<SetStateAction<IAnswerType>>
  handleOneTouchNextQuestion: () => void
}

function QuestionAnswer({
  currentQuestion,
  setAnswers,
  answers,
  handleOneTouchNextQuestion
}: Props) {
  return (
    <div className="px-5 pt-4">
      <div className="text-primary-500 text-sm font-semibold leading-6">
        {currentQuestion.type}
      </div>
      <div className="text-neutral-700 text-xs font-normal italic mb-4">
        {currentQuestion.prompt}
      </div>
      <div className="text-base leading-6 text-neutral-900 font-medium">
        {currentQuestion?.inputField === "Select"
          ? extractPartsSeperatedByColon(currentQuestion?.question!)[0]
          : currentQuestion.question}
      </div>
      <div>
        <DynamicAnswerItem
          currentQuestion={currentQuestion}
          answers={answers}
          setAnswers={setAnswers}
          handleOneTouchNextQuestion={handleOneTouchNextQuestion}
        />
      </div>
    </div>
  )
}

export default QuestionAnswer
