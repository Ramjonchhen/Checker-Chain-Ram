import { useEffect, useState } from "react"
import { Product } from "stores/product"
import { Input, TextArea, RatingStar, Button } from "components"
import { ListInput } from "./components/ListInput"
import Link from "next/link"
import * as Icons from "assets/icons"
import { twMerge } from "tailwind-merge"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { useReviewStore } from "stores/review"
import { yupResolver } from "@hookform/resolvers/yup"
import { useToastStore } from "stores/toast"
import { useRouter } from "next/router"
import { useFeedbackContract } from "hooks/useFeedbackContract"
import { useUserStore } from "stores"

// import { useUserStore } from "stores"

interface CreateReviewProps {
  product: Product
}

interface FormValues {
  review: string
  title: string
  pros: never[] | string[]
  cons: never[] | string[]
  rating: number
}

const cpCheckListArr = [
  "Feedback length> 200: +100 CP",
  "Feedback Upvote/Downvote: +1 CP",
  "Expert Take - Add Pros +5 CP (Atleast 2)",
  "Expert Take - Add Cons +5 CP (Atleast 2)"
]

export const CreateReview: React.FC<CreateReviewProps> = ({ product }) => {
  const router = useRouter()

  // const [showSidebar, setShowSidebar] = useState<boolean>(true)
  const [agreeTerms, setAgreeTerms] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validationSchema: any = Yup.object().shape({
    title: Yup.string()
      .required("Title is required")
      .max(250, "Title must be less than 250 characters"),
    review: Yup.string()
      .required("Review is required")
      .max(1600, "Review must be less than 1600 characters"),
    pros: Yup.array(),
    cons: Yup.array(),
    rating: Yup.number()
      .min(1, "Rating is required")
      .required("Rating is required")
  })
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
      rating: 0,
      pros: [],
      cons: []
    }
  })

  const { user } = useUserStore()
  const { createReview, getReviews } = useReviewStore()
  const { successToast, errorToast } = useToastStore()

  const { isCancelled, isPending, isSuccessful, isFailed, postFeedback } =
    useFeedbackContract()
  // const { user } = useUserStore()

  useEffect(() => {
    if (isSuccessful) {
      try {
        const data = window.localStorage.getItem("feedbackSubmission")
        if (!data) return
        const subbmisionData = JSON.parse(data)
        createReview({
          data: subbmisionData,
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
          router.push(`/product/${product.slug}`)
        })
        window.localStorage.removeItem("feedbackSubmission")
      } catch (e) {
        console.debug(e)
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
    if (!agreeTerms) {
      errorToast({
        message: "Please agree to the review terms"
      })
      return
    }
    window.localStorage.setItem("feedbackSubmission", JSON.stringify(data))
    await postFeedback({
      feedback: data.title,
      message: data.review,
      productId: product?._id,
      rating: data.rating,
      walletAddress: user?.wallet
    })
  }

  return (
    <>
      {/* {!showSidebar && (
        <div
          onClick={() => setShowSidebar((prev) => !prev)}
          className="absolute top-48 right-0 py-4 px-2 rounded-sm cursor-pointer bg-[#e9e9eb]"
        >
          <Icons.CheckoveRightIcon className="transform rotate-180" />
        </div>
      )} */}
      <div className="px-8 sm:px-0 sm:pl-8 lg:ml-40 gap-28 pt-5 sm:pt-16 bg-[#f7f7f7] flex">
        <div className="sm:max-w-[760px] sm:w-[760px] transition-all ease-in-out duration-200">
          <h2 className="text-[32px] leading-[42px] font-semibold mb-12">
            Review on <span className="text-primary">{product.name}</span>
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex w-full gap-4 flex-col">
              <Input
                type="text"
                label="Title"
                required
                {...register("title")}
                error={!!errors.title}
                helper={errors.title?.message?.toString()}
              />
              <RatingStar
                input
                rating={getValues().rating}
                onChange={(val) => {
                  // console.debug(val)
                  setValue("rating", Number(val))
                  trigger("rating")
                }}
                error={errors.rating?.message}
              />
              <TextArea
                max={1200}
                label="Review"
                required
                {...register("review")}
                error={!!errors.review}
                helper={errors.review?.message?.toString()}
              />

              <ListInput
                label="Pros"
                values={getValues().pros}
                onChange={(val) => {
                  setValue("pros", val)
                  trigger("pros")
                }}
              />
              <ListInput
                label="Cons"
                values={getValues().cons}
                onChange={(val) => {
                  setValue("cons", val)
                  trigger("cons")
                }}
              />
              <div className="my-6">
                <label className="flex items-center gap-[15px]">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={() => setAgreeTerms((curr) => !curr)}
                  />
                  I confirm that this is my own genuine experience and I am
                  eligible to review this product.
                </label>
              </div>
              <div className="flex gap-2 mb-6">
                <Button
                  type="submit"
                  title="Post My Review"
                  disabled={!agreeTerms}
                />
                <Link href={`/product/${product.slug}`}>
                  <Button
                    titleClassName="text-black"
                    className="bg-[#E9E9EB]"
                    title="Cancel"
                  />
                </Link>
              </div>
            </div>
          </form>
        </div>
        <div
          className={twMerge(
            " flex-grow relative h-screen overflow-y-auto border-l-2 pl-12 pr-4 py-4 border-[#e9e9eb] ease-in-out transition-all duration-200",
            // showSidebar ? "block" : "hidden",
            "hidden",
            "hidden lg:flex"
          )}
        >
          <div
            // onClick={() => setShowSidebar((prev) => !prev)}
            onClick={() => {}}
            className="absolute top-4 left-0 py-4 px-2 rounded-sm cursor-pointer bg-[#e9e9eb]"
          >
            <Icons.CheckoveRightIcon />
          </div>
          <div className="flex flex-col gap-10">
            <h2 className="font-medium text-[16px] leading-6">CP Checklist</h2>
            <div className="flex flex-col gap-6 steps-container">
              <ul>
                {cpCheckListArr.map((item) => (
                  <li key={item}>
                    <div className="flex items-center gap-4">
                      <span className="w-2 h-2 bg-black rounded-full block " />
                      {item}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
