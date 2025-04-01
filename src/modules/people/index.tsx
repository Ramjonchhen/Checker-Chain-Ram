import * as Icons from "assets/icons"
import { Card, Text, UserRow } from "components"
import { useRouter } from "next/router"
import { User, useUserStore } from "stores"

// const peoples = [
//   {
//     name: "John Doe",
//     image: "https://dummyimage.com/45x45",
//     similarBadges: ["Ethereum", "Solidity"],
//     bio: "A tech enthusiast who is always excited for a new tech discovery that will be a big thing in future someday.",
//   },
//   {
//     name: "Alish Dahal",
//     image: "https://dummyimage.com/45x45",
//     similarBadges: ["Bitcoin", "Games", "Lifestyle", "Sci-fi", "Horror", "Suspense", "Ethereum"],
//     bio: "A tech enthusiast who is always excited for a new tech discovery that will be a big thing in future someday.",
//   },
//   {
//     name: "Subas Shrestha",
//     image: "https://dummyimage.com/45x45",
//     similarBadges: ["Ethereum", "Solidity", "Bitcoin", "Games", "Lifestyle", "Sci-fi", "Horror", "Suspense"],
//     bio: "A tech enthusiast who is always excited for a new tech discovery that will be a big thing in future someday.",
//   },
//   {
//     name: "John Doe",
//     image: "https://dummyimage.com/45x45",
//     similarBadges: ["Ethereum", "Solidity"],
//     bio: "A tech enthusiast who is always excited for a new tech discovery that will be a big thing in future someday.",
//   },
//   {
//     name: "Alish Dahal",
//     image: "https://dummyimage.com/45x45",
//     similarBadges: ["Bitcoin", "Games", "Lifestyle", "Sci-fi", "Horror", "Suspense", "Ethereum"],
//     bio: "A tech enthusiast who is always excited for a new tech discovery that will be a big thing in future someday.",
//   },
//   {
//     name: "Subas Shrestha",
//     image: "https://dummyimage.com/45x45",
//     similarBadges: ["Ethereum", "Solidity", "Bitcoin", "Games", "Lifestyle", "Sci-fi", "Horror", "Suspense"],
//     bio: "A tech enthusiast who is always excited for a new tech discovery that will be a big thing in future someday.",
//   },
//   {
//     name: "John Doe",
//     image: "https://dummyimage.com/45x45",
//     similarBadges: ["Ethereum", "Solidity"],
//     bio: "A tech enthusiast who is always excited for a new tech discovery that will be a big thing in future someday.",
//   },
//   {
//     name: "Alish Dahal",
//     image: "https://dummyimage.com/45x45",
//     similarBadges: ["Bitcoin", "Games", "Lifestyle", "Sci-fi", "Horror", "Suspense", "Ethereum"],
//     bio: "A tech enthusiast who is always excited for a new tech discovery that will be a big thing in future someday.",
//   },
//   {
//     name: "Subas Shrestha",
//     image: "https://dummyimage.com/45x45",
//     similarBadges: ["Ethereum", "Solidity", "Bitcoin", "Games", "Lifestyle", "Sci-fi", "Horror", "Suspense"],
//     bio: "A tech enthusiast who is always excited for a new tech discovery that will be a big thing in future someday.",
//   }
// ]

export const People = () => {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { recommendedFollowers } = useUserStore()

  return (
    <Card className="sm:mx-[47px] lg:w-[900px] py-11">
      <div className="flex gap-8">
        <Icons.ArrowRightIcon
          onClick={() => router.back()}
          className="text-content-primary cursor-pointer"
        />
        <span className="text-xl font-medium">Recommended People</span>
      </div>
      <div className="divide-y divide-outline-secondary w-full h-full overflow-y-auto">
        {recommendedFollowers?.map((people: User, index: number) => {
          return (
            <UserRow
              key={index}
              profileImage={`${people.profilePicture?.toString() || ""}`}
              name={people.name}
              description={people.level}
              bio={people.bio}
              followed={false}
              className="lg:w-[813px] py-[33px] sm:p-[33px]"
              id={people._id}
              badges={Array.from(
                new Set(people.preference.map((p) => p.subcategory).flat())
              )}
              username={people.username}
            />
          )
        })}
      </div>
      {!recommendedFollowers.length && (
        <div className="w-full grid place-items-center h-[400px]">
          <Text className="px-6 text-xl" variant="body">
            No people found.
          </Text>
        </div>
      )}
    </Card>
  )
}
