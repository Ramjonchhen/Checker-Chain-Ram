import { Modal, Text, UserRow } from "components"
import { FC, ReactNode, useEffect, useState } from "react"
import { User, useUserStore } from "stores"

export const FollowPeopleDialog: FC<{
  title: string
  children: ReactNode
  type: "followings" | "followers"
  userId: string
}> = ({ title, children, type, userId, ...rest }) => {
  const [showModal, setShowModal] = useState(false)
  const {
    user,
    getFollowers,
    getFollowings,
    followers,
    followings,
    authorization
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useUserStore((state: any) => state)

  useEffect(() => {
    if (type === "followers") {
      getFollowers(userId)
    }
    if (type === "followings") {
      getFollowings(userId)
    }
  }, [type, getFollowers, getFollowings, authorization, user])

  useEffect(() => {
    if (user) {
      setShowModal(false)
    }
  }, [user])

  return (
    <>
      <div aria-disabled onClick={() => setShowModal(true)} {...rest}>
        {children}
      </div>
      <Modal
        dismissable
        closeButton
        className="mx-10 w-auto"
        display={showModal}
        onHide={() => {
          if (type === "followers") {
            getFollowers(userId)
          }
          if (type === "followings") {
            getFollowings(userId)
          }
          setShowModal(false)
        }}
      >
        <div>
          <Text
            className="px-4 text-2xl leading-6 font-medium text-content border-b border-outline-secondary block pb-2"
            variant="body"
          >
            {title}
          </Text>
          <div className="grid pt-2 gap-y-4 max-h-[500px] overflow-y-auto overflow-x-hidden">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {type === "followers" &&
              followers?.map(
                (people: User & { followed: boolean }, index: number) => (
                  <UserRow
                    key={index}
                    profileImage={people.profilePicture?.toString() || ""}
                    id={people._id}
                    name={people.name}
                    description={people.level}
                    followed={people.followed}
                    username={people.username}
                  />
                )
              )}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {type === "followings" &&
              followings?.map(
                (people: User & { followed: boolean }, index: number) => (
                  <UserRow
                    key={index}
                    profileImage={people.profilePicture?.toString() || ""}
                    name={people.name}
                    id={people._id}
                    description={people.level}
                    followed={people.followed}
                    username={people.username}
                  />
                )
              )}
            {type === "followings" && !followings?.length && (
              <Text className="px-4 text-sm" variant="body">
                {`${
                  userId !== user?._id ? "User" : "You"
                } don't have any followings yet.`}
              </Text>
            )}
            {type === "followers" && !followers?.length && (
              <Text className="px-4 text-sm" variant="body">
                {`${
                  userId !== user?._id ? "User" : "You"
                } don't have followers yet.`}
              </Text>
            )}
          </div>
        </div>
      </Modal>
    </>
  )
}
