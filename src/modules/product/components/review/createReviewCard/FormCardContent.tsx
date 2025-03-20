import { Dispatch, SetStateAction, useEffect } from "react"
import { CrossIcon, FallingStarIcon, UsersIcon } from "assets/icons"
import Image from "next/image"
import { useUserStore } from "stores"
import NoProfileImage from "assets/images/avatar/no_profile.png"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { Button, Input, RatingStar, TextArea } from "components"
import { useToastStore } from "stores/toast"
import { useReviewStore } from "stores/review"
import Link from "next/link"
import { useFeedbackContract } from "hooks/useFeedbackContract"
import LandingCardContent from "./LandingCardContent"

type Props = {
  setIsExpanded: Dispatch<SetStateAction<boolean>>
  productId: string
  productSlug: string
  isExpanded: boolean
}

interface FormValues {
  review: string
  title: string
  rating: number
}

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .max(250, "Title must be less than 250 characters"),
  review: Yup.string()
    .required("Review is required")
    .max(1600, "Review must be less than 1600 characters"),
  rating: Yup.number()
    .min(1, "Rating is required")
    .required("Rating is required")
})

const FormCardContent = ({
  setIsExpanded,
  productId,
  productSlug,
  isExpanded
}: Props) => {
  const { user } = useUserStore()
  const { createReview, getReviews } = useReviewStore()
  const { successToast, errorToast } = useToastStore()

  const { isCancelled, isPending, isSuccessful, isFailed, postFeedback } =
    useFeedbackContract()

  const {
    formState: { errors },
    handleSubmit,
    setValue,
    trigger,
    getValues,
    register,
    reset
  } = useForm<FormValues>({
    mode: "all",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      review: "",
      title: "",
      rating: 0
    }
  })

  useEffect(() => {
    if (isSuccessful) {
      try {
        let feedbackSubmissionData = localStorage.getItem("feedbackSubmission")
        if (!feedbackSubmissionData) return
        feedbackSubmissionData = JSON.parse(feedbackSubmissionData)
        createReview({
          data: feedbackSubmissionData,
          productId: productId
        }).then((response) => {
          if (!response) {
            errorToast({
              message: "Feedback submission failed"
            })
            return
          }
          reset()
          getReviews(productId)
          successToast({
            message: "Feedback submitted successfully"
          })
        })
        localStorage.removeItem("feedbackSubmission")
      } catch (e) {
        console.log(e)
      }
    }
    if (isFailed) {
      errorToast({
        message: "Feedback submission failed"
      })
    }
    if (isCancelled) {
      errorToast({
        message: "Feedback submission transaction cancelled"
      })
    }
  }, [isSuccessful, isCancelled, isPending, isFailed])

  const onSubmit = async (data: FormValues) => {
    // console.debug(data)
    // TODO: refactor reuse
    await postFeedback({
      feedback: data.title,
      message: data.review,
      productId: productId,
      rating: data.rating,
      walletAddress: user?.wallet
    })
    localStorage.setItem("feedbackSubmission", JSON.stringify(data))
  }
  if (!isExpanded) return <LandingCardContent setIsExpanded={setIsExpanded} />
  return (
    <div className="">
      <div className="px-6 flex justify-between items-center">
        <div>Write a feedback</div>
        <div onClick={() => setIsExpanded(false)} className="cursor-pointer">
          <CrossIcon className="scale-75" />
        </div>
      </div>
      <div className="h-[1px] bg-[#E9E9EB] w-full my-4" />
      <div className="px-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between md:items-center flex-col md:flex-row">
            <div className="flex gap-3">
              <div>
                <Image
                  src={
                    user?.profilePicture
                      ? `${process.env.NEXT_PUBLIC_SPACE_BASE}${user.profilePicture}`
                      : NoProfileImage.src
                  }
                  className="object-cover rounded-full h-10 w-10"
                  width={40}
                  height={40}
                  alt="profile"
                  unoptimized
                />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-neutral-900 text-base leading-6 font-semibold">
                  {user.name}
                </div>
                <div className="flex gap-2">
                  <div className="flex flex-row justify-center items-center gap-2">
                    <UsersIcon className="w-4 h-4" />
                    <span className="font-normal text-xs">
                      {user.follower} Followers
                    </span>
                  </div>

                  <div className="flex flex-row justify-center items-center gap-2">
                    <FallingStarIcon className="w-4 h-4" />
                    <span className="font-normal text-xs">
                      {user?.profileScore} Profile Score
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <RatingStar
                input
                rating={getValues().rating}
                onChange={(val) => {
                  // console.debug(val)
                  setValue("rating", Number(val))
                  trigger("rating")
                }}
                error={errors.rating?.message}
                className="border border-[rgba(186,186,186,0.85)] rounded"
              />
            </div>
          </div>
          <div className="mt-5">
            <div className="flex w-full gap-3 flex-col">
              <Input
                type="text"
                {...register("title")}
                error={!!errors.title}
                helper={errors.title?.message?.toString()}
                placeholder="Title Here..."
                autoFocus
              />

              <TextArea
                max={1200}
                {...register("review")}
                error={!!errors.review}
                helper={errors.review?.message?.toString()}
                placeholder="Write a feedback..."
              />
            </div>
            <div className="flex justify-between flex-col md:flex-row ">
              <div className="flex gap-8">
                <Button type="submit" title="Submit Feedback" />
                <Button
                  title="Cancel"
                  variant="text"
                  className="text-neutral-200"
                  onClick={() => reset()}
                  type="reset"
                />
              </div>
              <div>
                <Link href={`${productSlug}/create-review`}>
                  <Button
                    title="More Detailed Review"
                    variant="text"
                    className="text-neutral-200 px-0 mt-4 md:mt-0"
                    type="button"
                  />
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormCardContent
