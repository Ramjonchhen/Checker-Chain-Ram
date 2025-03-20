/* eslint-disable @next/next/no-img-element */
import { CameraIcon, More, ProfileVerifiedIcon } from "assets/icons"
import ClassOf2022Img from "assets/images/acheivement-1.png"
import RibbonImg from "assets/images/avatar/ribbon.svg"
import { Avatar, Button, Card, DropdownMenu, Text, Modal } from "components"
import { UploadImage } from "components/uploadImage"
import { SubCategoriesChips } from "modules/product/components/SubCategories"
import { FC, useEffect, useState } from "react"
import { User, useUserStore } from "stores"
import { getBaseBackendImageUrl } from "utils"
import ProfileStatsSection from "./ProfileStatsSection"
import { EditProfile } from "modules/profile/components/EditProfile"
import { ProfileStatus } from "modules/profile/components/BasicInformation/ProfileStatus"

export const BasicInformation: FC<{
  user: User
}> = ({ user }) => {
  const {
    wallet,
    followUser,
    getRecommendedFollowers,
    loading,
    uploadImage,
    removeImage,
    user: mainUser
  } = useUserStore((state) => state)
  const [imageFile, setImageFile] = useState<File | null | undefined>(null)

  const [isFollowed, setIsFollowed] = useState(user.followed)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [activeModal, setActiveModal] = useState<
    "profilePicture" | "coverImage" | null
  >()

  useEffect(() => {
    if (user) {
      setIsFollowed(user.followed)
    }
  }, [user])

  const follow = async () => {
    await followUser(user.wallet)
    setIsFollowed(!isFollowed)
  }

  const imageUploadHandler = () => {
    if (imageFile) {
      uploadImage(imageFile, activeModal || "profilePicture").finally(() => {
        setActiveModal(null)
        setImageFile(undefined)
      })
    }
  }
  const imageRemoveHandler = () => {
    if (user._id) {
      removeImage(activeModal || "profilePicture").finally(() => {
        setActiveModal(null)
        setImageFile(undefined)
      })
    }
  }

  return (
    <Card className="px-0 py-0 bg-white">
      {/** Gradient Div */}
      <EditProfile
        showEditProfile={showEditProfile}
        setShowEditProfile={setShowEditProfile}
      />
      <Modal
        display={!!activeModal}
        onHide={() => {
          setActiveModal(null)
          setImageFile(undefined)
        }}
        closeButton
      >
        <UploadImage
          title={
            activeModal === "coverImage"
              ? "Upload Cover Image"
              : activeModal === "profilePicture"
              ? "Upload Profile"
              : ""
          }
          onUpload={imageUploadHandler}
          onRemove={imageRemoveHandler}
          setImageFile={setImageFile}
          loading={loading}
          image={
            user[activeModal === "coverImage" ? "coverImage" : "profilePicture"]
              ? getBaseBackendImageUrl() +
                user[
                  activeModal === "coverImage" ? "coverImage" : "profilePicture"
                ]
              : ""
          }
        />
      </Modal>

      <div className="relative ">
        {wallet === user.wallet && (
          <div
            className="hover:animate-scale absolute p-1 top-2 right-2 text-white bg-primary rounded-lg cursor-pointer"
            onClick={() => {
              setActiveModal("coverImage")
            }}
          >
            <CameraIcon className="w-8 h-8" />
          </div>
        )}
        {(activeModal === "coverImage" && imageFile) || user.coverImage ? (
          <div
            style={{
              backgroundImage: `url(${
                activeModal === "coverImage" && imageFile
                  ? URL.createObjectURL(imageFile as File)
                  : getBaseBackendImageUrl() + user.coverImage
              })`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center"
            }}
            className={`h-[240px] border border-separate shadow-sm rounded-sm`}
          />
        ) : (
          <div
            className={`overflow-hidden rounded-sm select-none h-[240px] ${"bg-secondary-gradient"} flex items-center pt-10 justify-center gap-20 px-20 `}
          >
            {[1].map((item) => (
              <span
                key={item}
                className={`text-primary-300 ${
                  user.name.length < 14
                    ? "md:text-8xl"
                    : user.name.length < 21
                    ? "md:text-7xl"
                    : user.name.length < 26
                    ? "md:text-6xl"
                    : "md:text-5xl"
                } text-3xl image-background-cover transform font-semibold whitespace-nowrap`}
              >
                {user.name}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-col justify-between gap-0 p-0 absolute -bottom-24 left-5 md:left-[70px] ">
          <Avatar
            image={user.profilePicture || ""}
            level={user?.level}
            percentage={10}
            className="mx-3 cursor-pointer"
            onClick={() =>
              user._id === mainUser._id && setActiveModal("profilePicture")
            }
          />
          <div className="mt-2 relative ">
            <Text
              variant="body"
              className="absolute truncate w-28 text-white text-center left-6"
            >
              {user?.bestDescribeInCheckerchain?.split(",")[0] || "Reviewer"}
            </Text>
            <RibbonImg />
          </div>
        </div>
      </div>

      <div className="w-auto py-6 divide-y divide-outline-secondary ">
        <div className="px-10 sm:pr-[70px] mt-[80px] sm:mt-0 sm:px-[244px]">
          {/** Name, Bio, Follow, More */}
          <div className="flex sm:flex-row justify-between gap-2 sm:gap-0">
            <div className="flex flex-col">
              <div className="flex flex-row items-center gap-2">
                <span className="text-neutral-900 font-semibold text-2xl leading-[30px]">
                  {user?.name || "..."}
                </span>
                {user?.isVerified && (
                  <div title="Verified User">
                    <ProfileVerifiedIcon />
                  </div>
                )}
              </div>
              <span className="font-normal w-full text-neutral-600 text-base leading-6 overflow-hidden ...">
                {user?.bio}
              </span>
            </div>

            {wallet === user.wallet && (
              <DropdownMenu
                className=""
                items={[
                  {
                    label: "Edit Profile",
                    onClick: () => {
                      setShowEditProfile(true)
                    }
                  }
                ]}
              >
                <div className="cursor-pointer border border-neutral-400 rounded-[4px] px-2 py-1">
                  <More className="" />
                </div>
              </DropdownMenu>
            )}
            {wallet !== user.wallet && (
              <Button
                variant={isFollowed ? "default" : "outlined"}
                title={isFollowed ? "Following" : "Follow"}
                disabled={user.wallet === wallet}
                size="medium"
                onClick={async () => {
                  await follow()
                  getRecommendedFollowers()
                }}
              />
            )}
          </div>

          <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between ">
            <ProfileStatsSection user={user} />
            <div className="mt-6 mx-auto md:mt-0 md:mx-0">
              <img
                src={ClassOf2022Img.src}
                className="cursor-pointer h-[37px]"
                alt=""
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 my-4 w-full max-h-[70px] overflow-auto">
            <SubCategoriesChips
              subcategories={Array.from(
                new Set(user.preference.map((p) => p.subcategory))
              ).flat()}
            />
          </div>
          {wallet === user.wallet && <ProfileStatus />}
        </div>
      </div>
    </Card>
  )
}
