import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { IQuizQuestionData, useQuizesStore } from "stores/quiz"
import { twMerge } from "tailwind-merge"
import ErrorText from "components/errorText"
import QuizProgress from "./components/QuizProgress"
import { useUserStore } from "stores"
import { Product, useProductStore } from "stores/product"
import QuizCardRunning from "./components/QuizCardRunning"
import QuizCardCompleted from "./components/QuizCardCompleted"
import { useToastStore } from "stores/toast"
import { Button } from "components"
import { generateQuizPageTexts } from "utils/quizTexts"
import { useReviewContract } from "hooks/useReviewContract"

type Props = {
  setShowQuizCard: Dispatch<SetStateAction<boolean>>
  quizQuestions: IQuizQuestionData[]
  product: Product,
}

export type IAnswerType = {
  [key: string]: any
}

export type IScoringResponse = {
  question_id: string
  yes_response: 0 | 1
  no_response: 0 | 1
  qn?: number
}
export type INonScoringResponse = {
  question_id: string
  response: string
}

function QuizCard({ setShowQuizCard, quizQuestions, product }: Props) {
  const { user: currentUser } = useUserStore()
  const { postQuizResponse } = useQuizesStore()
  const { getProduct } = useProductStore()
  const [subbmisionData, setSubmissionData] = useState<any>({})
  const { errorToast } = useToastStore()
  const {
    postReview,
    getUserReview,
    isCancelled,
    isPending,
    isSuccessful,
    isFailed
  } = useReviewContract()

  const { _id: productId, name } = product

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1)
  const [answers, setAnswers] = useState<IAnswerType>({})
  const [formError, setFormError] = useState("")
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isQuizEntryDesc = currentQuestionIndex === -1
  const isFirstQuestion = currentQuestionIndex === 0
  const isFinalQuestion = currentQuestionIndex === quizQuestions.length - 1
  const totalQuestionsCount = quizQuestions.length

  useEffect(() => {
    if (isSuccessful) {
      postQuizResponse(subbmisionData).then(() => {
        setIsQuizSubmitted(true)
        getProduct(productId, currentUser._id)
        setIsSubmitting(false)
      })
        .catch((err) => {
          setIsQuizSubmitted(false)
          setIsSubmitting(false)
          errorToast({
            message: err?.response?.data?.message ?? "Failed to submit review"
          })
        })
    }
    if (isFailed) {
      errorToast({
        message: "Review submission failed"
      })
      setIsSubmitting(false)
    }
    if (isCancelled) {
      errorToast({
        message: "Review submission transaction cancelled"
      })
      setIsSubmitting(false)
    }
  }, [isSuccessful, isCancelled, isPending, isFailed])

  useEffect(() => {
    if (currentUser.wallet && productId) {
      getUserReview({
        productId,
        walletAddress: currentUser?.wallet
      }).then((reviews) => {
        if (reviews.status) {
          // console.log("reviews", reviews, quizQuestions)
          const answersMaps: IAnswerType = {}
          reviews.data.question_id.forEach(
            (questionNumber: string, index: number) => {
              const question = quizQuestions.find(
                (q) => q.qn === Number(questionNumber)
              )
              if (question) {
                answersMaps[question._id!] = reviews.data.answer_id[index] === 1 ? 'yes' : 'no'
              }
            }
          )
          setAnswers((prev) => ({ ...prev, ...answersMaps }))
        }
      })
    }
  }, [currentUser.wallet, productId])

  const quizPageTexts = useMemo(
    () => generateQuizPageTexts(totalQuestionsCount),
    [totalQuestionsCount]
  )

  const handleNextQuestion = () => {
    if (isQuizEntryDesc) {
      setCurrentQuestionIndex((curr) => curr + 1)
    } else if (isFinalQuestion) {
      handleSubmit()
    } else {
      const ratingId =
        quizQuestions?.find((item) => item.inputField === "Rating")?._id ??
        "ratingId"
      if (
        answers?.[quizQuestions[currentQuestionIndex]._id!] ||
        answers?.[quizQuestions[currentQuestionIndex]._id!] === 0
      ) {
        setCurrentQuestionIndex((curr) => curr + 1)
        setFormError("")
      } else if (
        quizQuestions?.[currentQuestionIndex]._id === ratingId &&
        !(ratingId in answers!)
      ) {
        setAnswers((curr) => ({ ...curr, [ratingId!]: 0 }))
        setCurrentQuestionIndex((curr) => curr + 1)
      } else {
        setFormError("Please select a choice")
      }
    }
  }
  const handleOneTouchNextQuestion = () => {
    setCurrentQuestionIndex((curr) => curr + 1)
  }

  const handlePreviousQuestion = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((curr) => curr - 1)
      setFormError("")
    }
  }

  const handleSubmit = async () => {
    let feedback = ""
    let rating = 0
    let scoringResponse: IScoringResponse[] = []
    let nonScoringResponse: INonScoringResponse[] = []

    quizQuestions.forEach((question) => {
      if (question.inputField === "Rating") {
        rating = Number(answers?.[question._id!]) + 1 ?? 0
      } else if (
        question.inputField === "TextArea" &&
        question.question?.includes("Write a review")
      ) {
        feedback = answers?.[question._id!] ?? ""
      } else if (question.isScoring) {
        const scoringAnsObj: IScoringResponse = {
          question_id: question._id!,
          qn: question.qn!,
          yes_response: answers?.[question._id!] === "yes" ? 1 : 0,
          no_response: answers?.[question._id!] === "no" ? 1 : 0
        }
        scoringResponse = [...scoringResponse, scoringAnsObj]
      } else if (!question.isScoring) {
        const nonScoringAnsObj: INonScoringResponse = {
          question_id: question._id!,
          response: answers?.[question._id!]
        }
        nonScoringResponse = [...nonScoringResponse, nonScoringAnsObj]
      }
    })

    const submitData = {
      product: productId,
      scoringResponse,
      nonScoringResponse,
      feedback,
      rating
    }
    setSubmissionData(submitData)
    localStorage.setItem("quizData", JSON.stringify(submitData))
    setIsSubmitting(true)
    // add try catches
    try {
      const reviewResult = await postReview({
        productId,
        walletAddress: currentUser.wallet,
        postFeeAmount: process.env.NEXT_PUBLIC_NETWORK === "mainnet" ? 0 : 10,
        reviewCycleId: product.currentReviewCycle ?? 0,
        results: scoringResponse.map((item) => ({
          qn: item.qn,
          answer: item.yes_response === 1 ? 1 : 0
        })),
      })
      // console.log("posting quiz")
      if (typeof reviewResult === "object") {
        if (reviewResult.status) {
          // console.log("data", reviewResult.data)
          await postQuizResponse(submitData)
          setIsQuizSubmitted(true)
          // console.log("out", result)
          getProduct(productId, currentUser._id)
          return
        }
      }
      // return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err)
      setIsQuizSubmitted(false)
      setIsSubmitting(false)
      errorToast({
        message: err?.response?.data?.message ?? "Failed to submit review"
      })
    }
  }

  if (!quizQuestions.length)
    return (
      <div className="flex items-center justify-center h-full flex-col gap-4">
        <ErrorText text="No questions are available at this time" />

        <Button
          type="button"
          onClick={() => setShowQuizCard(false)}
          title={"Take me back"}
        />
      </div>
    )

  return (
    <div
      className={twMerge("p-0 m-0 h-full w-full flex flex-col justify-between")}
    >
      {isQuizSubmitted ? (
        <QuizCardCompleted setShowQuizCard={setShowQuizCard} />
      ) : (
        <QuizCardRunning
          isQuizEntryDesc={isQuizEntryDesc}
          setShowQuizCard={setShowQuizCard}
          quizQuestions={quizQuestions}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          setAnswers={setAnswers}
          formError={formError}
          handleNextQuestion={handleNextQuestion}
          handleOneTouchNextQuestion={handleOneTouchNextQuestion}
          isFirstQuestion={isFirstQuestion}
          handlePreviousQuestion={handlePreviousQuestion}
          productName={name}
          isFinalQuestion={isFinalQuestion}
          quizPageText={quizPageTexts}
          isSubmitting={isSubmitting}
        />
      )}
      <QuizProgress
        totalQuestionsCount={totalQuestionsCount}
        currentQuestionIndex={currentQuestionIndex}
        epochTime={(product.reviewDeadline ?? 0) / 1000}
      />
    </div>
  )
}

export default QuizCard
