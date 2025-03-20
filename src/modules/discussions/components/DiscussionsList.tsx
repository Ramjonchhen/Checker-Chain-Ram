import React, { FC, useEffect } from "react"
import { DiscussionCard } from "./DiscussionCard"
import { useDiscussionStore } from "stores/discussion"
import { useUserStore } from "stores"
import { EmptyState } from "components"

interface DiscussionsListProps {
  type: "my" | "all"
}

export const DiscussionsList: FC<DiscussionsListProps> = ({ type }) => {
  const { discussions, getDiscussions, getMyDiscussions, myDiscussions } =
    useDiscussionStore()
  const { authorization, user } = useUserStore()

  useEffect(() => {
    if (type === "all") {
      getDiscussions({ currentUser: user._id })
    } else if (type === "my" && authorization) {
      getMyDiscussions({ currentUser: user._id })
    }
  }, [getDiscussions, type, authorization, getMyDiscussions, user._id])

  return (
    <div className="flex flex-col gap-8">
      {(type === "all" ? discussions : myDiscussions).discussions.length ===
        0 && (
        <EmptyState message="There are no discussions." className="p-10" />
      )}
      {(type === "all" ? discussions : myDiscussions).discussions.map(
        (item) => (
          <DiscussionCard key={`discussion_${item._id}`} discussion={item} />
        )
      )}
      {(type === "all" ? discussions : myDiscussions).total !==
        (type === "all" ? discussions : myDiscussions).discussions.length && (
        <div className="w-full grid place-content-center mt-2">
          <span
            className="cursor-pointer font-[500] text-base leading-6"
            onClick={() => {
              if (type === "all") {
                getDiscussions({
                  currentUser: user._id,
                  page: discussions.page + 1,
                  append: true
                })
              } else if (type === "my" && authorization) {
                getMyDiscussions({
                  currentUser: user._id,
                  page: myDiscussions.page + 1,
                  append: true
                })
              }
            }}
          >
            Load More
          </span>
        </div>
      )}
    </div>
  )
}
