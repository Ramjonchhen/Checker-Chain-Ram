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
  bio: string
}

export const Bio: FC<WelcomeProps> = ({ goToNextStep }) => {
  const validationSchema: Yup.SchemaOf<WelcomeFormData> = Yup.object().shape({
    bio: Yup.string()
      .required("Bio is required")
      .max(60, "Bio must be less than 60 characters")
  })

  const {
    // editProfile,
    onboarding,
    setOnboarding
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useUserStore((state: any) => state)

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<WelcomeFormData>({
    mode: "onChange",
    defaultValues: {
      bio: onboarding.bio || ""
    },
    resolver: yupResolver(validationSchema)
  })

  const onSubmit = async (data: WelcomeFormData) => {
    setOnboarding(data)
    goToNextStep()
  }
  return (
    <>
      <Text variant="modal-header" className="mt-[40px] !text-3xl">
        Enter your bio
      </Text>
      <Text
        variant="body"
        className="mt-2 text-content-tertiary text-base text-ellipsis"
      >
        Enter a bio that describes yourself on CheckerChain Platform.
      </Text>
      <form
        className="w-full"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <Input
          type={"text"}
          label={"Bio"}
          error={!!errors.bio}
          helper={errors.bio?.message?.toString()}
          className="w-full mt-6 text-start"
          placeholder="Enter your bio here"
          autoFocus
          {...register("bio")}
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
