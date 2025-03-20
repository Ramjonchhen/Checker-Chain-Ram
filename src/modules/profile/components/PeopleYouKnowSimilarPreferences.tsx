import { Text, UserRow } from "components"
import { FC } from "react"
import { User, useUserStore } from "stores"
import { twMerge } from "tailwind-merge"

export const PeopleYouKnowSimilarPreferences: FC<{
  title: string
  className?: string
  hiddenOnSmallDevices?: boolean
}> = ({ title, className = "", hiddenOnSmallDevices = false }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { recommendedFollowers } = useUserStore((state: any) => state)

  // Refactor this page -> to many inconsistent dependencies

  return (
    <div className={twMerge("px-4 gap-y-4 py-6 rounded-md", className)}>
      <span className="px-6 text-base leading-6 text-neutral-900 font-[500]">
        {title}
      </span>
      <div
        className={twMerge(hiddenOnSmallDevices ? "hidden md:block" : "block")}
      >
        {/* "hidden lg:block" */}
        <div className="grid gap-y-4 mt-4">
          {recommendedFollowers?.slice(0, 5).map((people: User) => (
            <UserRow
              key={people._id}
              profileImage={people.profilePicture || ""}
              name={people.name}
              description={people.level}
              wallet={people.wallet}
              username={people.username}
              followed={false}
            />
          ))}
        </div>
      </div>

      <div className="hidden">
        {/* lg:hidden */}
        <div className="grid gap-y-4 mt-4">
          {recommendedFollowers
            ?.slice(0, 10)
            .map((people: User, index: number) => (
              <UserRow
                key={index}
                profileImage={`${people.profilePicture?.toString() || ""}`}
                name={people.name}
                description={people.level}
                bio={people.bio}
                followed={false}
                className="lg:w-[813px] p-0 sm:p-[33px]"
                wallet={people.wallet}
                badges={Array.from(
                  new Set(people.preference.map((p) => p.subcategory).flat())
                )}
                username={people.username}
              />
            ))}
        </div>
      </div>

      {/* {!!recommendedFollowers.length && <div
        className="cursor-pointer text-primary mx-9 mt-6"
        onClick={() => {
          router.push("/people")
        }}
      >{`View More >>`}</div>} */}
      {!recommendedFollowers.length && (
        <div className="w-full grid place-items-center h-[335px]">
          <Text className="px-6 text-xl" variant="body">
            No people found.
          </Text>
        </div>
      )}
    </div>
  )
}
