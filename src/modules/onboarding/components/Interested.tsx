import { Button, Text, UserRow } from "components"
import { useRouter } from "next/router"
import { FC, useEffect } from "react"
import { User, useUserStore } from "stores"

interface InterestedProps {
  goToNextStep: () => void
}

export const Interested: FC<InterestedProps> = ({ goToNextStep }) => {
  const history = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {
    getRecommendedFollowers,
    recommendedFollowers,
    fetchProfile,
    user,
    checkOnboarded,
    authorization
  } = useUserStore((state) => state)

  useEffect(() => {
    if (authorization) {
      getRecommendedFollowers()
    }
  }, [getRecommendedFollowers, authorization])

  return (
    <div className="pt-10 pb-0 flex flex-col items-center w-full">
      <Text className="!text-3xl" variant="modal-header">
        Checkers you might be interested in
      </Text>
      <div className="flex flex-wrap gap-2 my-4 w-full max-h-[290px] overflow-y-scroll overflow-x-auto">
        {recommendedFollowers.map((people: User) => (
          <UserRow
            key={people._id}
            id={people._id}
            profileImage={people.profilePicture?.toString() || ""}
            name={people.name}
            description={`${people.level}`}
            followed={false}
            username={people.username}
          />
        ))}
      </div>
      <Button
        size="large"
        onClick={async () => {
          goToNextStep()
          checkOnboarded()
          fetchProfile()
          history.push(`/`)
        }}
        title="Proceed"
        className="w-full mt-0"
      />
    </div>
  )
}
