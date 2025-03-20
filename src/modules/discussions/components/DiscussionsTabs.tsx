import React, { FC } from "react"
import {
    // Input,
    TabView,
} from "components"
// import { SearchIcon } from "assets/icons"
import { DiscussionsList } from "./DiscussionsList"
interface DiscussionsTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  activeTab?: "L" | "D"
}

export const DiscussionsTabs: FC<DiscussionsTabsProps> = ({ className }) => {
  // const [currentFilter, setCurrentFilter] = React.useState('This Week');
  return (
    <div className={className}>
      <TabView
        type="discussion"
        tabs={[
          {
            title: "Trending",
            componet: <DiscussionsList type="all"/>
          },
          {
            title: "My Discussions",
            componet: (
              <DiscussionsList type="my"/>
            )
          }          
        ]}
      >
        <div className="flex justify-between items-center flex-grow flex-wrap ml-5">
          {/*<DropdownMenu
          items={[
            {
              label: "This Week",
              onClick: () => setCurrentFilter("This Week"),
            },
            {
              label: "This Month",
              onClick: () => setCurrentFilter("This Month"),
            },
          ]}>
          <div className="flex justify-center items-center text-sm text-neutral-400">
             {currentFilter}
              <ChevronDownIcon/>
          </div>
          </DropdownMenu>*/}
          {/* <div className="flex relative justify-self-end">
            <Input
              inputClassName="!h-[40px] !pl-14 !border-none"
              type="text"
              placeholder="Search"
             
            />
            <div className="absolute left-4 h-[40px] mt-1 rounded-l-[5px] text-neutral-200 grid place-items-center cursor-pointer">
              <SearchIcon />
            </div>
          </div> */}
        </div>
      </TabView>
    </div>
  )
}
