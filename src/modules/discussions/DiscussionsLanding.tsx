import { CheckoveRightIcon } from "assets/icons"
import { Button, Modal } from "components"
import { constants } from "constants/common"
import { PeopleYouKnowSimilarPreferences } from "modules/profile/components/PeopleYouKnowSimilarPreferences"
import { Trending } from "modules/profile/components/Trending"
import React from "react"
import { useUserStore } from "stores"
import { twMerge } from "tailwind-merge"
import { DiscussionsTabs } from "./components/DiscussionsTabs"
import { DiscussionForm } from "./DiscussionForm"

export const DiscussionsLanding = () => {
  const [isCreateDiscussionModalEnable, setIsCreateDiscussionModalEnable] =
    React.useState(false)
  const { authorization } = useUserStore()
  return (
    <div>
      <div className="flex justify-center items-center flex-col background-discussion-cover h-[480px]">
        <span className="m-4 text-black text-center discussion-text-gradient font-semibold leading-5">
          CheckerChain Community
        </span>
        <h1 className="text-3xl font-extrabold text-black text-center">
          Start a new <span className="text-primary">discussion</span>
          <br /> in CheckerChain.
        </h1>
        <p className="mt-4 max-w-[400px] text-center text-lg text-neutral-600">
          Ask questions, share ideas, and build connection with each other.
          Discover a new world along with us at CheckerChain Community.
        </p>
        <Button
          disabled={!authorization}
          onClick={() => setIsCreateDiscussionModalEnable(true)}
          title="Start New Discussion"
          className="mx-auto py-4 mt-8"
          endIcon={<CheckoveRightIcon />}
        />
      </div>

      <div
        className={twMerge(
          "grid grid-cols-1 md:grid-cols-10 px-3 md:px-8 mt-8 gap-8",
          constants.APP_CONTAINER_WIDTH
        )}
      >
        <DiscussionsTabs className="col-span-7 sm:px-0 px-5 pt-4 pb-8" />
        <div className="sm:col-span-3 col-span-7">
          {/* Trending on CheckerChain */}
          <Trending
            title="Trending on CheckerChain"
            trendingProductsData={[]}
          />
          <div className="w-full px-8">
            <div className="bg-separator h-[1px]" />
          </div>
          <PeopleYouKnowSimilarPreferences title="Recommended people" />
        </div>
      </div>

      <Modal
        className="min-w-[440px]"
        onHide={() => setIsCreateDiscussionModalEnable(false)}
        closeButton
        display={isCreateDiscussionModalEnable}
      >
        <DiscussionForm
          closeModal={() => setIsCreateDiscussionModalEnable(false)}
        />
      </Modal>
    </div>
  )
}
