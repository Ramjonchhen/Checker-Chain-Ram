import { More, TimestampsIcon, UpvoteIcon } from "assets/icons"
import { Card } from "components/card"
import { Review } from "stores/review"
import { FC } from "react"
import { getBaseBackendImageUrl } from "utils"
import { Button } from "components/button"
import dayjs from "lib/dateLib"

interface ReviewCardProps {
  review: Review
}

export const ReviewCard: FC<ReviewCardProps> = ({ review }) => {
  return (
    <Card className="w-[256px] p-0">
      <img
        src={getBaseBackendImageUrl(review.product.logo)}
        alt="Product Example"
        className="w-full h-[160px] object-contain"
      />
      <div className="flex flex-col p-4 border-b border-separate">
        <div className="flex justify-between">
          <div className="flex flex-col gap-0">
            <span className="text-base font-semibold leading-[30px]">
              {review.product.name}
            </span>
            <span className="text-xs">{review.product.name}</span>
          </div>

          <Button
            variant="outlined"
            title={review.upVotes.toString()}
            titleClassName="text-neutral-700"
            className={`py-1 px-[10px] ${
              review.isUpVoted && "text-primary border-primary"
            }`}
            startIcon={<UpvoteIcon />}
          />
        </div>
        <span className="text-sm text-neutral-700 mt-2">{review.review}</span>
        <div className="flex gap-1 items-center mt-2">
          <TimestampsIcon />
          <span className="text-[11px] text-neutral-700">
            {dayjs(review.createdAt).fromNow()}
          </span>
        </div>
      </div>
      <div className="flex items-start px-4 py-3 gap-x-6 font-normal text-xs">
        <span className="flex items-center gap-2 hover:text-primary cursor-pointer">
          <UpvoteIcon className={`transform rotate-180`} />
          {review.upVotes}
        </span>
        {/* <span className="flex items-center gap-2 hover:text-primary cursor-pointer">
          <CommentIcon />
          15.6k
        </span> */}
        <More className="ml-auto cursor-pointer" />
      </div>
    </Card>
  )
}
