import { FlagIcon, More, UpvoteIcon } from "assets/icons"
import { Card, DropdownMenu, ConfirmDialog } from "components"
import Link from "next/link"
import { FC, useState } from "react"
import { useUserStore } from "stores"
import { Review, useReviewStore } from "stores/review"
import { useToastStore } from "stores/toast"

interface ReviewCardProps {
  review: Review
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editReviewState: (id: any, data: any) => void
}

export const MyReviewCard: FC<ReviewCardProps> = ({
  review,
  editReviewState
}) => {
  const { voteReview, flagReview, deleteReview, getMyReviews } =
    useReviewStore()
  const { user } = useUserStore()
  const { successToast, errorToast } = useToastStore()
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div>
      <div className="text-neutral-900 font-normal leading-6 text-base mb-4">
        Review on{" "}
        <Link href={`/product/${review.product.slug}`}>
          <span className="font-semibold cursor-pointer">
            {review.product.name}
          </span>
        </Link>
      </div>
      <Card className="w-full p-0 border border-separate shadow-md flex flex-col divide-y divide-separator">
        <span className="py-3 px-6">{review.review}</span>
        <div className="flex items-start px-4 py-3 gap-x-6 font-normal text-xs">
          <span
            className={`${
              review.isUpVoted && "text-primary"
            } hover:text-primary flex items-center gap-2 cursor-pointer`}
            onClick={async () => {
              const res = await voteReview(review._id, review.isUpVoted ? 0 : 1)
              if (res) {
                editReviewState(review._id, {
                  isUpVoted: !review.isUpVoted,
                  upVotes: review.upVotes + (review.isUpVoted ? -1 : 1),
                  isDownVoted: false,
                  downVotes:
                    (review.downVotes || 0) - (review.isDownVoted ? 1 : 0)
                })
              }
            }}
          >
            <UpvoteIcon className={``} />
            {review.upVotes} Upvotes
          </span>
          <span
            className={`${
              review.isDownVoted && "text-primary"
            } hover:text-primary flex items-center gap-2 cursor-pointer`}
            onClick={async () => {
              const res = await voteReview(
                review._id,
                review.isDownVoted ? 0 : -1
              )
              if (res) {
                editReviewState(review._id, {
                  isDownVoted: !review.isDownVoted,
                  downVotes: review.downVotes + (review.isDownVoted ? -1 : 1),
                  isUpVoted: false,
                  upVotes: (review.upVotes || 0) - (review.isUpVoted ? 1 : 0)
                })
              }
            }}
          >
            <UpvoteIcon className={`transform rotate-180`} />
            {review.downVotes} Downvotes
          </span>
          <span
            className={`${
              review.isUserFlagged && "text-primary"
            } hover:text-primary ml-auto flex items-center gap-2 cursor-pointer`}
            onClick={async () => {
              const res = await flagReview(review._id)
              if (res) {
                editReviewState(review._id, {
                  isUserFlagged: !review.isUserFlagged,
                  flagCount:
                    (review.flagCount || 0) + (review.isUserFlagged ? -1 : 1)
                })
              }
            }}
          >
            <FlagIcon className={``} />
            {review.flagCount || 0} Flags
          </span>
          <div className="px-3 flex gap-4 items-center">
            {review.createdBy._id === user._id && (
              <div className="ml-auto">
                <DropdownMenu
                  className="-mt-2"
                  items={[
                    {
                      label: "Delete",
                      onClick: async () => {
                        setShowConfirm(true)
                      }
                    }
                  ]}
                >
                  <More className="cursor-pointer" />
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </Card>
      <ConfirmDialog
        show={showConfirm}
        setShow={(val) => setShowConfirm(val)}
        onConfirm={() => {
          ;(async () => {
            const res = await deleteReview(review._id)
            if (res) {
              successToast({
                message: "Review deleted successfully"
              })
              getMyReviews({
                user: user?._id
              })
            } else {
              errorToast({
                message: "Failed to delete review"
              })
            }
          })()
        }}
      />
    </div>
  )
}
