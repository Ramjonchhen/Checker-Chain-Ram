/* eslint-disable @next/next/no-img-element */
import React from "react"
import * as Icons from "assets/icons"
import { twMerge } from "tailwind-merge"
import { CommentSection } from "./CommentSection"
import { Discussion, Comment, useDiscussionStore } from "stores/discussion"
import { getBaseBackendImageUrl } from "utils"
import dayjs from "lib/dateLib"
import { useRouter } from "next/router"

interface CommentCardProps {
  depth?: number
  discussion: Discussion
  comment: Comment
}

export const CommentCard: React.FC<CommentCardProps> = ({
  depth = 1,
  discussion,
  comment
}) => {
  const { getDiscussionComments } = useDiscussionStore()
  const [showComment, setShowComment] = React.useState(false)
  const [commentRepliesCount, setCommentRepliesCount] = React.useState(0)
  const router = useRouter()

  const [comments, setComments] = React.useState<{
    page: number
    limit: number
    total: number
    comments: Comment[]
  }>({
    page: 0,
    limit: 0,
    total: 0,
    comments: []
  })

  const fetchComments = async (append = false) => {
    const {
      page,
      limit,
      total,
      comments: dataComments
    } = await getDiscussionComments(discussion._id, {
      parent: comment._id,
      ...(append
        ? {
            page: comments.page + 1
          }
        : {})
    })
    // console.debug("dataComments", dataComments)
    setComments((prev) => ({
      page,
      limit,
      total,
      comments: append ? [...prev.comments, ...dataComments] : dataComments
    }))
  }

  const setCommentData = (data: Comment) => {
    setComments((prev) => ({
      ...prev,
      total: prev.total + 1,
      comments: [...prev.comments, data]
    }))
    setCommentRepliesCount((prev) => prev + 1)
  }

  return (
    <div className="flex gap-4">
      <img
        className="w-10 h-10 rounded-full object-cover cursor-pointer"
        src={getBaseBackendImageUrl(
          comment.createdBy?.profilePicture,
          "avatar"
        )}
        alt="user"
        onClick={() => {
          router.push(`/user/${comment.createdBy?.username}`)
        }}
      />

      <div className="flex-grow flex-wrap">
        <div className="font-medium text-xl leading-6">
          {comment.createdBy?.name}
        </div>
        <div className="flex gap-2 text-sm leading-5 text-neutral-900">
          {comment.comment}
        </div>
        <div className="flex gap-4 text-xs leading-5 text-neutral-900">
          <div className="flex items-center gap-1 text-[10px] text-neutral-700">
            <Icons.TimestampIcon className="w-4 h-4" />
            {dayjs(comment.createdAt).fromNow()}
          </div>
        </div>
        <div className="flex justify-between pr-7 mt-3">
          <div className="flex gap-3 text-sm text-neutral-700">
            <div
              onClick={() => {
                if (!showComment) {
                  fetchComments().then(() => {
                    setShowComment(true)
                  })
                } else {
                  setShowComment(!showComment)
                }
              }}
              className={twMerge(
                showComment ? "text-primary" : "",
                "flex items-center gap-1 hover:text-primary cursor-pointer"
              )}
            >
              <Icons.CommentIcon /> {comment.repliesCount + commentRepliesCount}{" "}
              {comment.repliesCount > 1 ? "replies" : "reply"}
            </div>
          </div>
        </div>
        {showComment && (
          <CommentSection
            key={`comment_${comment._id}`}
            parentId={comment?._id}
            discussion={discussion}
            depth={depth}
            repliesSize={comment.repliesCount}
            comments={comments.comments}
            total={comments.total}
            setCommentData={setCommentData}
            loadMore={() => {
              fetchComments(true)
            }}
          />
        )}
      </div>
    </div>
  )
}
