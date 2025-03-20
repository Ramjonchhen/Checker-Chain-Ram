/* eslint-disable @next/next/no-img-element */
import React from "react"
import { CommentSection } from "./components/CommentSection"
import { DiscussionDetailHeader } from "./components/DiscussionDetailHeader"
import * as Icons from "assets/icons"
import { getArrowIconStyle } from "./components/DiscussionCard"
import { twMerge } from "tailwind-merge"
import { useDiscussionStore } from "stores/discussion"
import { useRouter } from "next/router"
import { getBaseBackendImageUrl } from "utils"
import { useUserStore } from "stores"
import { getVote } from "utils/getVote"
import dayjs from "lib/dateLib"
import { toast } from "react-hot-toast"
import { constants } from "constants/common"

export const DiscussionDetail = () => {
  // const [isBookmarked, setIsBookmarked] = React.useState(false)
  const { discussion, getDiscussion, getDiscussionComments, comments } =
    useDiscussionStore()
  const { voteDiscussion } = useDiscussionStore()

  const { user } = useUserStore()
  const router = useRouter()

  React.useEffect(() => {
    if (router?.query?.slug) {
      getDiscussion(`${router.query.slug}`, user._id).then((resp) => {
        getDiscussionComments(resp.data._id, { store: true })
      })
    }
  }, [router, getDiscussion, user._id, getDiscussionComments])

  return (
    <div
      className={twMerge(
        "pt-8 px-3",
        "min-h-[calc(100vh-316px)]",
        constants.APP_CONTAINER_WIDTH
      )}
    >
      <DiscussionDetailHeader />
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 ">
          <div className="flex mt-8 justify-between items-center">
            <div className="flex gap-6">
              <img
                className="w-14 h-14 rounded-full object-cover"
                src={getBaseBackendImageUrl(
                  discussion?.createdBy?.profilePicture,
                  "avatar"
                )}
                alt="user"
              />
              <div className="flex-grow flex-wrap">
                <div className="font-medium text-xl leading-6">
                  {discussion.createdBy.name}
                </div>
                <div className="mt-1 flex flex-col md:flex-row gap-1 md:gap-4 text-xs leading-5 text-neutral-900">
                  <div>{discussion?.category?.name}</div>
                  <div className="flex items-center gap-1 text-[10px] text-neutral-700">
                    <Icons.TimestampIcon className="w-4 h-4" />
                    {dayjs(discussion.createdAt).fromNow()}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-6">
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
              {/* <div
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={twMerge(
                  isBookmarked ? "text-primary" : "",
                  "flex items-center gap-1 hover:text-primary cursor-pointer"
                )}
              >
                <Icons.BookmarkIcon />{" "}
                {isBookmarked ? "Bookmarked" : "Bookmark"}
              </div> */}
              <div className="flex p-2 flex-col justify-center max-h-24 items-center border-neutral-100 border-2 rounded-lg">
                <Icons.ArrowUpFilledIcon
                  className={twMerge(
                    "cursor-pointer hover:text-primary",
                    getArrowIconStyle(!!discussion.isUpVoted)
                  )}
                  onClick={() =>
                    voteDiscussion(
                      discussion._id,
                      getVote(
                        "up",
                        !!discussion.isUpVoted,
                        !!discussion.isDownVoted
                      )
                    )
                  }
                />
                {discussion.votes ?? 0}
                <Icons.ArrowDownFilledIcon
                  className={twMerge(
                    "cursor-pointer hover:text-primary",
                    getArrowIconStyle(!!discussion.isDownVoted)
                  )}
                  onClick={() =>
                    voteDiscussion(
                      discussion._id,
                      getVote(
                        "down",
                        !!discussion.isUpVoted,
                        !!discussion.isDownVoted
                      )
                    )
                  }
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex-center flex-col">
              <p className="text-lg font-semibold mb-4 leading-4">
                {discussion.title}
              </p>
              <p className="text-base text-neutral-900 mb-4">
                {discussion.description}
              </p>
            </div>
          </div>
          <p className="text-lg font-semibold mb-4 leading-4">
            {comments.total} replies
          </p>
          <CommentSection
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
        </div>
      </div>
    </div>
  )
}
