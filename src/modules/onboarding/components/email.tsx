import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Input, Text } from "components"
import { FC } from "react"
import { useForm } from "react-hook-form"
import { useUserStore } from "stores"
import * as Yup from "yup"

interface WelcomeProps {
  setCurrentStep: (step: number) => void
}

interface WelcomeFormData {
  email: string
}

export const Email: FC<WelcomeProps> = ({ setCurrentStep }) => {
  const validationSchema: Yup.SchemaOf<WelcomeFormData> = Yup.object().shape({
    email: Yup.string()
      .required("Email is required.")
      .email("Email must be a valid.")
  })

  const {
    // editProfile,
    onboarding,
    setOnboarding,
    checkEmailExists
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
      email: onboarding.email || ""
    },
    resolver: yupResolver(validationSchema)
  })

  const onSubmit = async (data: WelcomeFormData) => {
    const isExists = await checkEmailExists(data.email)
    if (!isExists) {
      setOnboarding(data)
      setCurrentStep(3)
    } else {
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
    }
  }
  return (
    <>
      <Text variant="modal-header" className="mt-[40px] !text-3xl">
        Enter your Email
      </Text>
      <Text
        variant="body"
        className="mt-2 text-content-tertiary text-base text-ellipsis"
      >
        Enter an email address that represents you on CheckerChain Platform.
      </Text>
      <form
        className="w-full"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <Input
          type={"text"}
          label={"Email"}
          error={!!errors.email}
          helper={errors.email?.message?.toString()}
          className="w-full mt-6 text-start"
          placeholder="Enter your email here"
          autoFocus
          {...register("email")}
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
