import React from "react"
import { useUserStore } from "stores"
import { Discussion, Comment } from "stores/discussion"
import { CommentCard } from "./CommentCard"
import { CommentFormField } from "./CommentFormField"

interface CommentSectionProps {
  discussion: Discussion
  depth?: number
  repliesSize?: number
  comments?: Comment[]
  total?: number
  parentId?: string
  setCommentData?: (data: Comment) => void
  loadMore?: () => void
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  depth = 0,
  discussion,
  comments,
  total,
  parentId,
  setCommentData,
  loadMore
}) => {
  const { authorization } = useUserStore()
  if (depth >= 3) return <></>
  return (
    <div className="mt-8 flex flex-col gap-4 mb-8">
      {comments?.map((comment) => (
        <CommentCard
          discussion={discussion}
          depth={depth + 1}
          key={comment._id}
          comment={comment}
        />
      ))}
      {total !== comments?.length && (
        <div className="w-full grid place-content-center mt-4">
          <span
            className="cursor-pointer font-[500] text-base leading-6"
            onClick={loadMore}
          >
            Load More
          </span>
        </div>
      )}
      {authorization && (
        <CommentFormField
          discussion={discussion}
          parentId={parentId}
          setCommentData={setCommentData}
        />
      )}
    </div>
  )
}
