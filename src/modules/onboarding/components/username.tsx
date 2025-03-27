import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Input, Text } from "components"
import { FC } from "react"
import { useForm } from "react-hook-form"
import { useUserStore } from "stores"
import * as Yup from "yup"

interface WelcomeProps {
  goToNextStep: () => void
}

interface WelcomeFormData {
  username: string
}

export const Username: FC<WelcomeProps> = ({ goToNextStep }) => {
  const validationSchema: Yup.SchemaOf<WelcomeFormData> = Yup.object().shape({
    username: Yup.string()
      .required("username is required")
      .max(20, "username must be less than 20 characters")
  })

  const {
    // editProfile,
    onboarding,
    setOnboarding,
    checkUsernameExists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useUserStore((state) => state)

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError
  } = useForm<WelcomeFormData>({
    mode: "onChange",
    defaultValues: {
      username: onboarding.username || ""
    },
    resolver: yupResolver(validationSchema)
  })

  const onSubmit = async (data: WelcomeFormData) => {
    const isExists = await checkUsernameExists(data.username)
    if (!isExists) {
      setOnboarding(data)
      goToNextStep()
    } else {
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
    }
  }
  return (
    <>
      <Text variant="modal-header" className="mt-[40px] !text-3xl">
        Enter your Username
      </Text>
      <Text
        variant="body"
        className="mt-2 text-content-tertiary text-base text-ellipsis"
      >
        Enter a Username that represents you on CheckerChain Platform.
      </Text>
      <form
        className="w-full"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <Input
          type={"text"}
          label={"Username"}
          error={!!errors.username}
          helper={errors.username?.message?.toString()}
          className="w-full mt-6 text-start"
          placeholder="Enter your username here"
          autoFocus
          {...register("username")}
        />
        <Button
          type="submit"
          className="w-full mt-8"
          size="large"
          title="Continue"
        />
      </form>
    </>
  )
}
