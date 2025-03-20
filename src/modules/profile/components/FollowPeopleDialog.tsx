import { Modal, Text, UserRow } from "components"
import { FC, ReactNode, useEffect, useState } from "react"
import { User, useUserStore } from "stores"

export const FollowPeopleDialog: FC<{
  title: string
  children: ReactNode
  type: "followings" | "followers"
  wallet: string
}> = ({ title, children, type, wallet, ...rest }) => {
  const [showModal, setShowModal] = useState(false)
  const {
    wallet: personalWallet,
    getFollowers,
    getFollowings,
    followers,
    followings,
    authorization
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useUserStore((state: any) => state)

  useEffect(() => {
    if (type === "followers") {
      getFollowers(wallet)
    }
    if (type === "followings") {
      getFollowings(wallet)
    }
  }, [type, getFollowers, getFollowings, authorization, wallet])

  useEffect(() => {
    if (wallet) {
      setShowModal(false)
    }
  }, [wallet])

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
            getFollowers(wallet)
          }
          if (type === "followings") {
            getFollowings(wallet)
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
                    wallet={people.wallet}
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
                    wallet={people.wallet}
                    description={people.level}
                    followed={people.followed}
                    username={people.username}
                  />
                )
              )}
            {type === "followings" && !followings?.length && (
              <Text className="px-4 text-sm" variant="body">
                {`${
                  wallet !== personalWallet ? "User" : "You"
                } don't have any followings yet.`}
              </Text>
            )}
            {type === "followers" && !followers?.length && (
              <Text className="px-4 text-sm" variant="body">
                {`${
                  wallet !== personalWallet ? "User" : "You"
                } don't have followers yet.`}
              </Text>
            )}
          </div>
        </div>
      </Modal>
    </>
  )
}
