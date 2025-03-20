import React, { FC } from "react"
import { EmptyState, Input } from "components"
import { SearchIcon } from "assets/icons"
import { useReviewStore } from "stores/review"
import { User, useUserStore } from "stores/user"
import { MyReviewCard } from "./MyReviewCard"

interface Props {
  user?: User
}

export const MyReviews: FC<Props> = ({ user }) => {
  const { myReviews, getMyReviews, editMyReviewState } = useReviewStore()
  const { authorization } = useUserStore((state) => state)

  React.useEffect(() => {
    getMyReviews({
      user: user?._id || ""
    })
  }, [authorization, user?._id])

  return (
    <div className="">
      {!!myReviews.total && (
        <div className="flex justify-between items-center">
          <p className="text-neutral-900 font-semibold text-2xl leading-[30px]">
            {myReviews.total} reviews
          </p>
          <div>
            <div className="flex relative">
              <Input
                inputClassName="!h-[40px] !pl-14 !border-none"
                type="text"
                placeholder="Search"
              />
              <div className="absolute left-4 h-[40px] mt-1 rounded-l-[5px] text-neutral-200 grid place-items-center cursor-pointer">
                <SearchIcon />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="h-50">
        <div className="mt-12 flex flex-col gap-6 mb-12">
          {myReviews.reviews.map((item) => (
            <MyReviewCard
              key={item._id}
              review={item}
              editReviewState={editMyReviewState}
            />
          ))}
          {!myReviews.reviews.length && (
            <EmptyState message="No more reviews" />
          )}
        </div>
        {myReviews.total !== myReviews.reviews.length && (
          <div className="w-full grid place-content-center ">
            <span
              className="cursor-pointer font-[500] text-base leading-6"
              onClick={() => {
                getMyReviews({
                  page: myReviews.page + 1,
                  append: true,
                  user: user?._id || ""
                })
              }}
            >
              Load More
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
