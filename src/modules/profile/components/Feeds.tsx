import { Card, EmptyState, TabView } from "components"
import { FC } from "react"
import { User } from "stores"
import { twMerge } from "tailwind-merge"
import { MyFlags } from "./MyFlags"
import { MyProducts } from "./MyProducts"
import { MyReviews } from "./MyReviews"
import { MySubscriptions } from "./MySubscriptions"
import { MyVotes } from "./MyVotes"

export const Feeds: FC<{
  className?: string
  user: User
}> = ({ className, user }) => {
  return (
    <Card
      className={twMerge("!bg-transparent shadow-empty px-0", className ?? "")}
    >
      <TabView
        type="profile"
        tabs={[
          {
            title: "Products",
            componet: <MyProducts user={user} />
          },
          {
            title: "Reviews",
            componet: <MyReviews user={user} />
          },
          {
            title: "Votes",
            componet: <MyVotes user={user} />
          },
          {
            title: "Flags",
            componet: <MyFlags user={user} />
          },
          {
            title: "Subscriptions",
            componet: <MySubscriptions user={user} />
          },
          // {
          //   title: "Discussions",
          //   componet: (
          //     <EmptyState message="There is no Discussions" />
          //   )
          // },
          {
            title: "Achievements",
            componet: (
              <EmptyState message="Achievements are coming soon. Stay tuned!" />
            )
          }
        ]}
        scrollBar={false}
      />
    </Card>
  )
}
