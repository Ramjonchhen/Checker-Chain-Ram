import { ArrowLeftLong } from "assets/icons"
import { useRouter } from "next/router"
import React from "react"
import { useDiscussionStore } from "stores/discussion"

export const DiscussionDetailHeader = () => {
  const { discussion } = useDiscussionStore()
  const router = useRouter()
  return (
    <div className="flex gap-2">
      <ArrowLeftLong className="cursor-pointer" onClick={() => router.back()} />
      Published in {discussion.category?.name}
    </div>
  )
}
