/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Input, Modal, Text, UpdateButton } from "components"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { CrossOutlineIcon } from "assets/icons"
import { IconButton } from "components/iconButton"
import { FC, useEffect, useState } from "react"
import { useUserStore } from "stores"
import * as Yup from "yup"
import { UploadProfilePicture } from "./UploadProfilePicture"
import { TrashIcon } from "assets/icons"
import { getBaseBackendImageUrl } from "utils"
import { useToastStore } from "stores/toast"
import SideDrawer from "components/sideDrawer"

interface UserData {
  name: string
  bio?: string
  // wallet: string
  roles: string[]
  // email: string
  // profile_title: string,
  profilePicture: File | undefined
  username: string
  email: string
}

interface Props {
  showEditProfile: boolean
  setShowEditProfile: (showEditProfile: boolean) => void
}

export const EditProfile: FC<Props> = ({
  showEditProfile,
  setShowEditProfile
}) => {
  const {
    uploadImage,
    removeImage,
    editProfile,
    checkUsernameExists,
    checkEmailExists,
    resendVerificationEmail
  } = useUserStore((state) => state)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validationSchema: any = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(20, "Name must be less than 20 characters"),
    roles: Yup.array().test(
      "check-array",
      "Please select at least one role",
      (role) => {
        // console.debug("role", role)
        return (role?.filter((rl) => rl)?.length || 0) > 0
      }
    ),
    // email: Yup.string().required("Email is required"),
    bio: Yup.string().required("Bio is required"),
    profilePicture: Yup.mixed(),
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address")
    // profile_title: Yup.string().required("Profile title is required")
  })
  const {
    register,
    formState: { errors },
    handleSubmit,
    // getValues,
    setValue,
    trigger,
    resetField,
    setError,
    getValues
  } = useForm<UserData>({
    mode: "all",
    resolver: yupResolver(validationSchema)
  })
  const router = useRouter()
  const [showUploadProfile, setShowUploadProfile] = useState(false)
  const [imageFile, setImageFile] = useState<File>()

  const [disabled, setDisabled] = useState(false)

  const { user, loading } = useUserStore((state) => state)
  const { successToast, errorToast } = useToastStore()
  const [emailLoading, setEmailLoading] = useState(false)

  useEffect(() => {
    setValue("name", user.name)
    setValue("bio", user.bio)
    setValue("username", user.username)
    setValue("email", user.email || "")
    const roles = user.bestDescribeInCheckerchain
    if (roles.includes("Reviewer")) {
      setValue("roles.0", "Reviewer")
    }
    if (roles.includes("Poster")) {
      setValue("roles.1", "Poster")
    }
    if (roles.includes("Influencer")) {
      setValue("roles.2", "Influencer")
    }
    if (roles.includes("Undecided")) {
      setDisabled(true)
      setValue("roles.3", "Undecided")
    }
    trigger("name")
    trigger("bio")
    trigger("username")
    trigger("email")
  }, [user, setValue, trigger])

  const sendEmail = async () => {
    setEmailLoading(true)
    const res = await resendVerificationEmail()
    if (res.status === "success") {
      successToast({
        message: "Verification email sent successfully"
      })
    } else {
      errorToast({
        message: res.message
      })
    }
    setEmailLoading(false)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submittedData = async (data: any) => {
    if (user.username !== data.username) {
      const isExists = await checkUsernameExists(data.username)
      // console.debug(isExists)
      if (isExists) {
        setError(
          "username",
          {
            type: "manual",
            message: "Username is already taken"
          },
          {
            shouldFocus: true
          }
        )
        return
      }
    }
    if (user.email !== data.email) {
      const isExists = await checkEmailExists(data.email)
      // console.debug(isExists)
      if (isExists) {
        setError(
          "email",
          {
            type: "manual",
            message: "Email is already taken"
          },
          {
            shouldFocus: true
          }
        )
        return
      }
    }
    if (data.profilePicture) {
      await uploadImage(data.profilePicture, "profilePicture")
    }
    if (
      user.name !== data.name ||
      user.bio !== data.bio ||
      user.username !== data.username ||
      user.bestDescribeInCheckerchain !==
        data.roles.filter((role: any) => role).toString() ||
      user.email !== data.email
    ) {
      await editProfile({
        name: data.name,
        bio: data.bio,
        username: data.username,
        email: data.email,
        bestDescribeInCheckerchain: data.roles
          .filter((role: any) => role)
          .toString()
      })
    }
    // setShowEditProfile(false)
    router.replace(`/user/${data.username}`)
  }

  return (
    <SideDrawer
      isDrawerOpen={showEditProfile}
      className="overflow-y-auto pt-10 w-full md:w-[557px] editProfileSideDrawer"
    >
      {/* <animated.div
      className="h-fit w-96 shadow-lg rounded-xl bg-white border visible fixed overflow-y-auto overflow-x-hidden"
      style={propsSpring}
    > */}
      {/* <Modal
        className="w-full sm:w-[557px] !h-full overflow-y-auto sm:pl-14 sm:pr-7 py-12 top-0 right-0 fixed transition ease-in-out delay-150"
        display
        closeButton
        onHide={(val) => {
          setShowEditProfile(val)
        }}
        dismissable
      > */}
      <div className="flex flex-col relative pb-10 w-full px-6">
        <IconButton
          onClick={() => {
            setShowEditProfile(false)
          }}
          className="absolute right-2 top-2"
          icon={<CrossOutlineIcon className="text-black" />}
        />
        <div>
          <Text variant="body" className="text-xl font-semibold">
            Edit Profile
          </Text>
          <br />
          <Text variant="body">Use this section to edit your profile.</Text>
        </div>
        <div className="flex items-center gap-x-2">
          <img
            className="object-cover rounded-full w-[110px] h-[110px]"
            alt="avatar"
            src={
              imageFile
                ? URL.createObjectURL(imageFile)
                : getBaseBackendImageUrl(user.profilePicture, "avatar")
            }
          />
          <div className="flex flex-col gap-2 relative">
            <Button
              onClick={() => setShowUploadProfile(true)}
              title="Change Profile Picture"
            />
            <Modal
              overlay={false}
              isInModal
              className="absolute top-48 w-auto left-auto right-20"
              onHide={() => {
                setShowUploadProfile(false)
              }}
              closeButton
              display={showUploadProfile}
            >
              <UploadProfilePicture
                setImageFile={(file) => {
                  setImageFile(file)
                  setValue("profilePicture", file)
                }}
                onChange={() => setShowUploadProfile(false)}
              />
            </Modal>
            {user.profilePicture && (
              <Button
                startIcon={<TrashIcon />}
                variant="outlined"
                title="Remove Picture"
                onClick={() => {
                  removeImage("profilePicture")
                }}
              />
            )}
          </div>
        </div>
        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit(submittedData)}
          autoComplete="off"
        >
          <Input
            type={"text"}
            label={"Full Name"}
            error={!!errors.name}
            helper={errors.name?.message?.toString()}
            placeholder="Enter your name here"
            autoFocus
            {...register("name")}
          />
          <Input
            type={"text"}
            label={"Username"}
            error={!!errors.username}
            helper={errors.username?.message?.toString()}
            placeholder="Enter your username here"
            autoFocus
            {...register("username")}
          />
          <div className="flex flex-col">
            <Input
              type={"text"}
              label={"Email"}
              error={!!errors.email}
              helper={errors.email?.message?.toString()}
              placeholder="Enter your email here"
              className="mb-0"
              autoFocus
              {...register("email")}
            />
            {!user.emailVerified && user.email === getValues().email && (
              <div className="ml-3">
                <span className="text-xs text-error">
                  Your email is not verified.
                </span>
                <UpdateButton
                  type="button"
                  className="mt-2"
                  title="Resend Verification Email"
                  loading={emailLoading}
                  onClick={sendEmail}
                />
              </div>
            )}
          </div>
          <Input
            label="Bio"
            type="text"
            placeholder="Enter your bio here..."
            error={!!errors.bio}
            helper={errors.bio?.message?.toString()}
            {...register("bio")}
          />
          <div>
            <label className="block text-content-primary text-[16px] font-medium mb-1">
              Choose your role
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {["Reviewer", "Poster", "Influencer", "Undecided"].map(
                (item, index) => (
                  <label
                    key={item}
                    className="flex justify-center items-center gap-2 cursor-pointer"
                  >
                    <input
                      className={`${
                        disabled &&
                        item !== "Undecided" &&
                        "!cursor-not-allowed"
                      }`}
                      type="checkbox"
                      value={item}
                      {...register(`roles.${index}`)}
                      disabled={item != "Undecided" ? disabled : false}
                      onChange={(e) => {
                        if (e.target.checked && item === "Undecided") {
                          setValue("roles", ["", "", "", "Undecided"])
                          // setValue("roles.3", "Undecided");
                          setDisabled(true)
                        } else if (e.target.checked && item !== "Undecided") {
                          setValue(`roles.${index}`, item)
                          setDisabled(false)
                        } else {
                          resetField(`roles.${index}`)
                          setDisabled(false)
                        }
                        trigger("roles")
                      }}
                    />

                    {item}
                  </label>
                )
              )}
            </div>
          </div>
          <p className={`text-error italic text-xs leading-[18px] mt-2`}>
            {errors?.roles?.message}
          </p>
          <p className={`text-error italic text-xs leading-[18px] mt-2`}>
            Note: You can select multiple roles unless undecided
          </p>
          {/* <Input
              label="Email"
              type="text"
              placeholder="Enter your email"
              error={!!errors.email}
              helper={errors.email?.message?.toString()}
              {...register("email")}
            /> */}
          {/* <div>
              <Select
                value={getValues().profile_title}
                label="Profile Title"
                items={["Influencer", "Poster", "Checker", "Undecided"]}
                placeholder="Select your title"
                onValueChange={(val) => {
                  setValue("profile_title", val as string)
                  trigger("profile_title")
                }}
              />
              {!!errors.profile_title && (
                <p
                  className={`${
                    !!errors.profile_title
                      ? "text-error"
                      : "text-content-secondary"
                  } italic text-xs leading-[18px] ml-3 mt-2`}
                >
                  {errors.profile_title.message}
                </p>
              )}
            </div> */}

          {/* <div>Achievement Show case</div> */}
          <div>
            <UpdateButton title="Update" loading={loading} />
          </div>
        </form>
      </div>
    </SideDrawer>
  )
}
