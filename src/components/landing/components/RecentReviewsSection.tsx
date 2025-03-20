import React, { useState } from "react"
import { Review, useReviewStore } from "stores/review"
import { ReviewAnimatedCard } from "./ReviewAnimatedCard"
import { twMerge } from "tailwind-merge"
import { constants } from "constants/common"

const RecentReviewsSection = () => {
  const { reviews } = useReviewStore()
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }
  return (
    <div className="bg-[rgba(230,237,248,0.60)] pt-[38px] pb-[73px]">
      <span
        className={twMerge(
          "px-4",
          constants.APP_CONTAINER_WIDTH,
          "text-2xl font-semibold leading-[30px] mt-6 block",
          constants.APP_CONTAINER_WIDTH
        )}
      >
        Recent Reviews 💬
      </span>
      <div
        className="mt-8 flex flex-col  w-full "
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative flex overflow-x-hidden ">
          <div
            className="animate-marqueeLoop flex flex-nowrap gap-4 py-5"
            style={{
              animationPlayState: isHovered ? "paused" : "running"
            }}
          >
            {reviews.reviews.slice(0, 5).map((review) => (
              <ReviewAnimatedCard
                key={review._id + "1"}
                review={review as Review}
              />
            ))}
          </div>
          <div
            className="absolute left-4 top-0 animate-marqueeLoopReverse flex flex-nowrap gap-4 py-5"
            style={{
              animationPlayState: isHovered ? "paused" : "running"
            }}
          >
            {reviews.reviews.slice(0, 5).map((review) => (
              <ReviewAnimatedCard
                key={review._id + "1"}
                review={review as Review}
              />
            ))}
          </div>
        </div>

        <div className="relative flex overflow-x-hidden ">
          <div
            className="animate-marqueeLoop flex flex-nowrap gap-4 pb-5"
            style={{
              animationPlayState: isHovered ? "paused" : "running"
            }}
          >
            {reviews.reviews.slice(5, 10).map((review) => (
              <ReviewAnimatedCard
                key={review._id + "1"}
                review={review as Review}
              />
            ))}
          </div>
          <div
            className="absolute left-4 top-0 animate-marqueeLoopReverse flex flex-nowrap gap-4 pb-5"
            style={{
              animationPlayState: isHovered ? "paused" : "running"
            }}
          >
            {reviews.reviews.slice(5, 10).map((review) => (
              <ReviewAnimatedCard
                key={review._id + "1"}
                review={review as Review}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecentReviewsSection
