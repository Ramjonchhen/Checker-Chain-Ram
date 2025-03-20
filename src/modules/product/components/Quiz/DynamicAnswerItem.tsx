import RatingSlider from "components/ratingSlider"
import { Dispatch, SetStateAction } from "react"
import { IQuizQuestionData } from "stores/quiz"
import QuizRadioGroup from "./components/QuizRadioGroup"
import { IAnswerType } from "./QuizCard"
import { Select, TextArea } from "components"
import {
  extractPartsSeperatedByColon,
  extractPartsSeperatedByCommas
} from "utils/helper"

export type IInputType = "Select" | "TextArea" | "Rating" | ""

type Props = {
  currentQuestion: IQuizQuestionData
  answers: IAnswerType
  setAnswers: Dispatch<SetStateAction<IAnswerType>>
  handleOneTouchNextQuestion: () => void
}

const radioOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" }
]

function DynamicAnswerItem({
  currentQuestion,
  answers,
  setAnswers,
  handleOneTouchNextQuestion
}: Props) {
  const { inputField, _id } = currentQuestion
  // console.log("currentQuestion", currentQuestion, answers[_id!])
  switch (inputField) {
    case "Rating":
      return (
        <RatingSlider
          value={answers?.[_id!] ?? 0}
          handleChange={(val) => {
            setAnswers((curr) => ({ ...curr, [_id!]: val }))
          }}
        />
      )

    case "TextArea":
      return (
        <div>
          <TextArea
            className="mt-4"
            label=""
            labelClassName="text-neutral-700 text-xs tracking-[0.02em] font-medium leading-6"
            placeholder="Description"
            max={280}
            required
            value={answers?.[_id!] ?? ""}
            onChange={(e) => {
              setAnswers((curr) => ({ ...curr, [_id!]: e.target.value }))
            }}
          />
        </div>
      )

    case "Select": {
      const dirtyChoicesString = extractPartsSeperatedByColon(
        currentQuestion?.question!
      )[1]
      const cleanSelectChoices =
        extractPartsSeperatedByCommas(dirtyChoicesString)
      return (
        <div>
          <Select
            label={""}
            items={cleanSelectChoices}
            onValueChange={(val) =>
              setAnswers((curr) => ({ ...curr, [_id!]: val }))
            }
            value={answers?.[_id!] ?? ""}
          />
        </div>
      )
    }
    default:
      return (
        <QuizRadioGroup
          options={radioOptions}
          onSelect={(val) => {
            setAnswers((curr) => ({ ...curr, [_id!]: val }))
            handleOneTouchNextQuestion()
          }}
          value={answers?.[_id!] ?? undefined}
        />
      )
  }
}
export default DynamicAnswerItem
