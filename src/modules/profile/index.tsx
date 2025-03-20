import { FC } from "react"
import { User } from "stores"
import { BasicInformation } from "./components/BasicInformation/BasicInformation"
import { Feeds } from "./components/Feeds"
import { PeopleYouKnowSimilarPreferences } from "./components/PeopleYouKnowSimilarPreferences"
import { Trending } from "./components/Trending"
import { ITrendingProducts } from "interfaces/trending"

export const Profile: FC<{
  user: User
  trendingProductsData: ITrendingProducts[]
}> = ({ user, trendingProductsData }) => {
  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Profile Main */}
      <div className="grid gap-8">
        <BasicInformation user={user} />
        {/*  */}
      </div>
      {/* People You May Know People with similar preferences */}
      <div className="">
        <div className="grid grid-cols-7 sm:grid-cols-10 gap-6 px-4 sm:px-[70px]">
          <Feeds className="col-span-12 md:col-span-7" user={user} />
          <div className="hidden md:flex flex-col col-span-12 md:col-span-3">
            <Trending
              title="Trending on CheckerChain"
              trendingProductsData={trendingProductsData}
            />
            <div className="w-full px-8">
              <div className="bg-separator h-[1px]" />
            </div>
            <PeopleYouKnowSimilarPreferences title="Recommended People" />
          </div>
        </div>
      </div>
    </div>
  )
}
