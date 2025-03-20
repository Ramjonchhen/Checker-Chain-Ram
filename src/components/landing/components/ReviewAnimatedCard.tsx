import { FallingStarIcon, TimestampIcon, UsersIcon } from "assets/icons"
import { Card } from "components/card"
import { Review } from "stores/review"
import { FC } from "react"
import { getBaseBackendImageUrl } from "utils"
import Image from "next/image"
import Link from "next/link"
import RatingStarView from "components/ratingStar/RatingStarView"
import dayjs from "lib/dateLib"
import { abbreviateNumber } from "utils/getLiquidityInfo"

interface ReviewCardProps {
  review: Review
}

export const ReviewAnimatedCard: FC<ReviewCardProps> = ({ review }) => {
  return (
    <Card className="w-[342px] p-4 border border-separate h-[200px] px-0 rounded-lg">
      <div className="flex items-center gap-2 border-b border-[#E9E9EB] px-4 pb-3">
        <Link href={`/user/${review.createdBy.username}`}>
          <Image
            src={getBaseBackendImageUrl(
              review.createdBy.profilePicture,
              "avatar"
            )}
            alt="Product Example"
            className="object-cover rounded-full border cursor-pointer  !w-10 !h-10"
            width={40}
            height={40}
          />
        </Link>
        <div
          className="line-clamp-1"
          title={`${review.createdBy.name} on ${review.product.name} `}
        >
          <div className="text-neutral-900">
            <Link href={`/user/${review.createdBy.username}`}>
              <span className="text-sm font-semibold leading-[16px] cursor-pointer hover:text-primary-700">
                {review.createdBy.name}{" "}
              </span>
            </Link>
            <span className="text-sm font-normal"> on </span>
            <Link href={`/product/${review.product.slug}`}>
              <span className="text-sm font-semibold leading-[16px] cursor-pointer hover:text-primary-700">
                {review.product.name}
              </span>
            </Link>
          </div>
          <div className="flex gap-4 text-xs text-neutral-600">
            <div className="flex flex-row justify-center items-center gap-2">
              <UsersIcon className="w-4 h-4" />
              <span className="font-normal text-xs">
                {review?.createdBy.follower} Followers
              </span>
            </div>
            <div className="flex flex-row justify-center items-center gap-2">
              <FallingStarIcon className="w-4 h-4" />
              <span className="font-normal text-xs">
                {abbreviateNumber(review?.createdBy?.profileScore) ?? 0}
                {" Profile Score"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="px-6">
        <div className="mt-4 h-[20px] flex gap-[10px] items-center">
          <RatingStarView rating={review?.rating} />
          <div className="flex items-center gap-[5px]">
            <TimestampIcon className="w-3 h-3" />
            <span className="text-[10px] font-normal leading-[15px] text-neutral-600">
              {dayjs(review.createdAt).fromNow()}
            </span>
          </div>
        </div>
        <div className="mt-3 font-semibold text-xs leading-4 text-neutral-900 line-clamp-1">
          {review.title}
        </div>
        <div className="text-xs leading-4 text-neutral-700 mt-1 line-clamp-3">
          {review.review}
        </div>
      </div>
    </Card>
  )
}
