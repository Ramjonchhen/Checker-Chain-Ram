import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Card, TextArea } from "components"
import { FC } from "react"
import { twMerge } from "tailwind-merge"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { useReviewStore } from "stores/review"
import { useProductStore } from "stores/product"
import { useToastStore } from "stores/toast"
import { useUserStore } from "stores"
import { getBaseBackendImageUrl } from "utils"

interface ReviewFormProps {
  className?: string
}

interface FormValues {
  review: string
}

export const ReviewForm: FC<ReviewFormProps> = ({ className }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validationSchema: any = Yup.object().shape({
    review: Yup.string()
      .required("Review is required")
      .max(250, "Review must be less than 250 characters")
  })
  const {
    formState: { errors },
    handleSubmit,
    setValue,
    trigger,
    getValues,
    reset
  } = useForm<FormValues>({
    mode: "all",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      review: ""
    }
  })

  const { createReview, getReviews } = useReviewStore()
  const { product } = useProductStore()
  const { successToast, errorToast } = useToastStore()
  const { user } = useUserStore()

  const onSubmit = (data: FormValues) => {
    // console.debug(data)
    createReview({
      data,
      productId: product?._id
    }).then((response) => {
      if (!response) {
        errorToast({
          message: "Error creating review"
        })
        return
      }
      reset()
      getReviews(product?._id)
      successToast({
        message: "Review created successfully"
      })
    })
  }

  return (
    <Card
      className={twMerge(
        "flex flex-col border border-separate shadow-sm",
        className
      )}
    >
      <span className="text-neutral-900 font-[500] text-base leading-4">
        Want to drop a review?
      </span>
      <span className="text-neutral-700 text-xs leading-4 mt-2">
        We really appreciate your reviews.
      </span>
      <div className="flex gap-2 items-start mt-5">
        <img
          src={getBaseBackendImageUrl(user.profilePicture, "avatar")}
          className="w-[40px] h-[40px] rounded-full mt-2 border border-separate object-cover"
        />
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <TextArea
            className="w-full"
            inputClassName="resize-none"
            max={250}
            placeholder="Write a Review"
            rows={3}
            error={!!errors.review}
            helper={errors.review?.message?.toString()}
            value={getValues().review}
            onChange={(e) => {
              setValue("review", e.target.value)
              trigger("review")
            }}
          />
          <Button
            disabled={
              !!product.status && ["draft", "removed"].includes(product.status)
            }
            type="submit"
            className="mt-2 w-full"
          >
            Submit
          </Button>
        </form>
      </div>
    </Card>
  )
}
