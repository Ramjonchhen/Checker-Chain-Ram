/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import * as Icons from "assets/icons"
import { useRouter } from "next/router"
import React from "react"
import { Discussion } from "stores/discussion"
import { twMerge } from "tailwind-merge"
import { getBaseBackendImageUrl } from "utils"
import { CommentSection } from "./CommentSection"
import { useDiscussionStore } from "stores/discussion"
import { getVote } from "utils/getVote"
import dayjs from "lib/dateLib"
import { useUserStore } from "stores"
import { toast } from "react-hot-toast"

export const getArrowIconStyle = (isVoted: boolean) => {
  return isVoted ? "text-primary" : "text-neutral-100 "
}

export const DiscussionCard: React.FC<{
  discussion: Discussion
}> = ({ discussion }) => {
  // const [isBookmarked, setIsBookmarked] = React.useState(false)
  const router = useRouter()
  const {
    voteDiscussion,
    getDiscussionComments,
    comments,
    currentDiscussion,
    setCurrentDiscussion
  } = useDiscussionStore()
  const { authorization } = useUserStore()
  return (
    <div className="flex gap-4">
      <img
        className="w-10 h-10 rounded-full object-cover cursor-pointer"
        src={getBaseBackendImageUrl(
          discussion.createdBy.profilePicture,
          "avatar"
        )}
        alt="user"
        onClick={() => {
          router.push(`/user/${discussion.createdBy.username}`)
        }}
      />
      <div className="flex-grow flex-wrap">
        <div
          className="font-medium text-xl leading-6 cursor-pointer"
          onClick={() => router.push(`/community/${discussion.slug}`)}
        >
          {discussion?.title ??
            "What will be the future of ethereum in the next 50 years?"}
        </div>
        <div className="flex-wrap flex gap-x-4 text-xs leading-5 text-neutral-900">
          <div>
            {discussion?.createdBy?.name ?? "User"} in{" "}
            {discussion?.category?.name ?? "Category"}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-neutral-700">
            <Icons.TimestampIcon className="h-4 w-4" />
            {dayjs(discussion.createdAt).fromNow()}
          </div>
        </div>
        <div className="flex gap-2 text-sm leading-5 text-neutral-900">
          {discussion?.description}
        </div>
        <div className="flex justify-between pr-7 mt-3">
          <div className="flex gap-3 text-sm text-neutral-700">
            <div
              onClick={() => {
                if (currentDiscussion !== discussion._id) {
                  getDiscussionComments(discussion._id, { store: true }).then(
                    (data: any) => {
                      setCurrentDiscussion(discussion._id)
                      console.debug("comments", data)
                    }
                  )
                } else {
                  setCurrentDiscussion("")
                }
              }}
              className={twMerge(
                currentDiscussion === discussion._id ? "text-primary" : "",
                "flex items-center gap-1 hover:text-primary cursor-pointer"
              )}
            >
              <Icons.CommentIcon /> {discussion?.comments}
            </div>
            <div
              className="flex items-center gap-1 hover:text-primary cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/community/${discussion.slug}`
                )
                toast.success("Copied Successfully.")
              }}
            >
              <Icons.ShareIcon /> Share
            </div>
          </div>
          {/* <div
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={twMerge(
              isBookmarked ? "text-primary" : "",
              "flex items-center gap-1 hover:text-primary cursor-pointer"
            )}
          >
            <Icons.BookmarkIcon /> {isBookmarked ? "Bookmarked" : "Bookmark"}
          </div> */}
        </div>
        {currentDiscussion === discussion._id && (
          <CommentSection
            key={discussion._id}
            discussion={discussion}
            comments={comments.comments}
            total={comments.total}
            loadMore={() => {
              getDiscussionComments(discussion._id, {
                store: true,
                append: true,
                page: comments.page + 1
              })
            }}
          />
        )}
      </div>
      <div className="flex p-2 gap-2 flex-col h-24 justify-center max-h-24 items-center border-neutral-100 border-2 rounded-lg">
        <Icons.ArrowUpFilledIcon
          className={twMerge(
            "cursor-pointer hover:text-primary",
            getArrowIconStyle(!!discussion.isUpVoted)
          )}
          onClick={() => {
            if (!authorization) return
            voteDiscussion(
              discussion._id,
              getVote("up", !!discussion.isUpVoted, !!discussion.isDownVoted)
            )
          }}
        />
        {discussion.votes ?? 0}
        <Icons.ArrowDownFilledIcon
          className={twMerge(
            "cursor-pointer hover:text-primary",
            getArrowIconStyle(!!discussion.isDownVoted)
          )}
          onClick={() => {
            if (!authorization) return
            voteDiscussion(
              discussion._id,
              getVote("down", !!discussion.isUpVoted, !!discussion.isDownVoted)
            )
          }}
        />
      </div>
    </div>
  )
}
