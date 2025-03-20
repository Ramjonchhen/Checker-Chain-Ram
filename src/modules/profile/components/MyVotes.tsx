import React, { FC } from "react"
import { EmptyState, Input } from "components"
import { SearchIcon } from "assets/icons"
import { useReviewStore } from "stores/review"
import { User, useUserStore } from "stores/user"
import { MyReviewCard } from "./MyReviewCard"

interface Props {
  user?: User
}

export const MyVotes: FC<Props> = ({ user }) => {
  const { myVotes, getMyVotes, editMyVoteState } = useReviewStore()
  const { authorization } = useUserStore((state) => state)

  React.useEffect(() => {
    getMyVotes({
      user: user?._id || ""
    })
  }, [getMyVotes, authorization, user?._id])
  return (
    <div className="">
      {!!myVotes.total && (
        <div className="flex justify-between items-center">
          <p className="text-neutral-900 font-semibold text-2xl leading-[30px]">
            {myVotes.total} Votes
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
        <div className="mt-12 flex flex-col gap-6">
          {myVotes.reviews.map((item) => (
            <MyReviewCard
              key={item._id}
              review={item}
              editReviewState={editMyVoteState}
            />
          ))}
          {!myVotes.reviews.length && (
            <EmptyState message="There are no votes." />
          )}
        </div>
        {myVotes.total !== myVotes.reviews.length && (
          <div className="w-full grid place-content-center mt-10">
            <span
              className="cursor-pointer font-[500] text-base leading-6"
              onClick={() => {
                getMyVotes({
                  page: myVotes.page + 1,
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
