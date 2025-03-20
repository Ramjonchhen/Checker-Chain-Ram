/* eslint-disable @next/next/no-img-element */
import { FlagIcon, More, UpvoteIcon } from "assets/icons"
import {
  Card,
  DropdownMenu,
  ConfirmDialog,
  RatingStar,
  Button
} from "components"
import dayjs from "lib/dateLib"
import Link from "next/link"
import { FC, useState } from "react"
import { useUserStore } from "stores"
import { Review, useReviewStore } from "stores/review"
import { useToastStore } from "stores/toast"
import { getBaseBackendImageUrl } from "utils"
import * as Icons from "assets/icons"
import { noEmptyStrings } from "utils/helper"
import { abbreviateNumber } from "utils/getLiquidityInfo"
// import ReviewLoadingCard from "./ReviewLoadingCard"

interface ReviewCardProps {
  review: Review
}

export const ReviewCard: FC<ReviewCardProps> = ({ review }) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const [showProsCons, setShowProsCons] = useState(false)

  const { voteReview, editReviewState, flagReview, deleteReview, getReviews } =
    useReviewStore()
  const { user, authorization } = useUserStore()
  const { successToast, errorToast } = useToastStore()

  const toggleProsCons = () => setShowProsCons((curr) => !curr)
  const reviewText = showProsCons ? "Show less" : "See full review"

  const reviewPros = noEmptyStrings(review.pros)
  const reviewCons = noEmptyStrings(review.cons)

  const upvoteHandler = async () => {
    if (!authorization) return
    const res = await voteReview(review._id, review.isUpVoted ? 0 : 1)
    if (res) {
      editReviewState(review._id, {
        isUpVoted: !review.isUpVoted,
        upVotes: review.upVotes + (review.isUpVoted ? -1 : 1),
        isDownVoted: false,
        downVotes: (review.downVotes || 0) - (review.isDownVoted ? 1 : 0)
      })
    }
  }

  const downvoteHandler = async () => {
    {
      if (!authorization) return
      const res = await voteReview(review._id, review.isDownVoted ? 0 : -1)
      if (res) {
        editReviewState(review._id, {
          isDownVoted: !review.isDownVoted,
          downVotes: review.downVotes + (review.isDownVoted ? -1 : 1),
          isUpVoted: false,
          upVotes: (review.upVotes || 0) - (review.isUpVoted ? 1 : 0)
        })
      }
    }
  }

  const flagHandler = async () => {
    if (!authorization) return
    const res = await flagReview(review._id)
    if (res) {
      editReviewState(review._id, {
        isUserFlagged: !review.isUserFlagged,
        flagCount: (review.flagCount || 0) + (review.isUserFlagged ? -1 : 1)
      })
    }
  }

  const confirmReviewDeleteHandler = async () => {
    {
      const res = await deleteReview(review._id)
      if (res) {
        successToast({
          message: "Review deleted successfully"
        })
        getReviews(review.product._id, user._id)
      } else {
        errorToast({
          message: "Failed to delete review"
        })
      }
    }
  }

  // return <ReviewLoadingCard />

  return (
    <>
      <Card className="cursor-default p-0 border border-separate flex flex-col divide-y divide-separator shadow-2 rounded-lg">
        <div className="py-3 px-6 flex gap-4 items-center">
          <Link href={`/user/${review.createdBy.username}`}>
            <img
              src={getBaseBackendImageUrl(
                review.createdBy.profilePicture,
                "avatar"
              )}
              className="w-[40px] h-[40px] rounded-full mt-2 object-cover border border-separate cursor-pointer"
              alt=""
            />
          </Link>
          <div className="flex flex-col">
            <div className="flex flex-row items-center gap-2">
              <span className="font-semibold text-base leading-6  hover:text-primary-700">
                <Link href={`/user/${review.createdBy.username}`}>
                  {review?.createdBy?.name}
                </Link>
              </span>
              {/* <div>
                <Icons.ProfileVerifiedIcon />
              </div> */}
            </div>
            <div className="flex gap-2">
              <div className="flex flex-row justify-center items-center gap-2">
                <Icons.UsersIcon className="w-4 h-4" />
                <span className="font-normal text-xs text-neutral-600">
                  {review?.createdBy.follower} Followers
                </span>
              </div>

              <div className="flex flex-row justify-center items-center gap-2">
                <Icons.FallingStarIcon className="w-4 h-4" />
                <span className="font-normal text-xs text-neutral-600">
                  {abbreviateNumber(review?.createdBy?.profileScore) ?? 0}{" "}
                  Profile Score
                  {/* {review.flagCount} Reputations */}
                  {/* {dayjs(review.createdAt).fromNow()} */}
                </span>
              </div>
            </div>
          </div>
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
        <div className="px-6 py-3">
          <div className="flex flex-row mb-3 gap-2  items-center ">
            <RatingStar rating={review.rating} />
            <div className="flex gap-1 items-center">
              <Icons.TimestampIcon className="w-4 h-4 " />
              <div className="font-normal text-[10px] text-neutral-700 mb-[-3px]">
                {dayjs(review.createdAt).fromNow()}
              </div>
            </div>
          </div>
          {review.title && (
            <div className="text-base leading-6 font-semibold text-neutral-900">
              {review.title ?? "No Title"}
            </div>
          )}
          <div className="text-sm leading-5 text-neutral-700 font-normal tracking-[0.14px] whitespace-pre-wrap">
            {review.review}
          </div>
          {(reviewPros.length > 0 || reviewCons.length > 0) && (
            <Button
              title={reviewText}
              variant="text"
              className="p-0 "
              endIcon={<Icons.CheckoveRightIcon />}
              onClick={toggleProsCons}
            />
          )}

          {showProsCons && (
            <>
              <div className="flex flex-col gap-2">
                {reviewPros.length > 0 && (
                  <>
                    <div className="text-base leading-6 font-semibold text-neutral-900">
                      Pros:
                    </div>
                    {reviewPros.map((pro, index) => (
                      <div
                        key={pro}
                        className="text-sm leading-5 text-neutral-700 font-normal"
                      >
                        {index + 1}. {pro}
                      </div>
                    ))}
                  </>
                )}

                {reviewCons.length > 0 && (
                  <>
                    <div className="text-base leading-6 font-semibold text-neutral-900">
                      Cons:
                    </div>
                    {reviewCons.map((con, index) => (
                      <div
                        key={con}
                        className="text-sm leading-5 text-neutral-700 font-normal"
                      >
                        {index + 1}. {con}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex items-start px-4 py-3 gap-x-6 font-normal text-xs">
          <span
            className={`${
              review.isUpVoted && "text-primary"
            } hover:text-primary flex items-center gap-2 cursor-pointer`}
            onClick={upvoteHandler}
          >
            <UpvoteIcon />
            {review.upVotes} Upvotes
          </span>
          <span
            className={`${
              review.isDownVoted && "text-primary"
            } hover:text-primary flex items-center gap-2 cursor-pointer`}
            onClick={downvoteHandler}
          >
            <UpvoteIcon className={`transform rotate-180`} />
            {review.downVotes} Downvotes
          </span>
          <span
            className={`${
              review.isUserFlagged && "text-primary"
            } hover:text-primary ml-auto flex items-center gap-2 cursor-pointer`}
            onClick={flagHandler}
          >
            <FlagIcon />
            {review.flagCount || 0} Flags
          </span>
        </div>
      </Card>
      <ConfirmDialog
        show={showConfirm}
        setShow={(val) => setShowConfirm(val)}
        onConfirm={confirmReviewDeleteHandler}
      />
    </>
  )
}
