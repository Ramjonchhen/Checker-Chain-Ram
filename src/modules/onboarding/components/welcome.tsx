import { logout, useGetAccountInfo, useGetLoginInfo } from "lib/dApp-core"
import { yupResolver } from "@hookform/resolvers/yup"
import CheckerChainImage from "assets/images/checker-chain.svg"
import { Button, Input, Text } from "components"
import { FC, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useSettingStore, useUserStore } from "stores"
import { toSubstring } from "utils"
import * as Yup from "yup"

interface WelcomeProps {
  goToNextStep: () => void
}

interface WelcomeFormData {
  name: string
  referredBy?: string
}

export const Welcome: FC<WelcomeProps> = ({ goToNextStep }) => {
  const { account } = useGetAccountInfo()
  const { isLoggedIn } = useGetLoginInfo()
  const validationSchema: Yup.SchemaOf<WelcomeFormData> = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(20, "Name must be less than 20 characters"),
    referredBy: Yup.string()
  })

  const {
    // editProfile,
    onboarding,
    setOnboarding,
    reset: resetUser
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useUserStore()
  const { reset: resetSettings } = useSettingStore()
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm<WelcomeFormData>({
    mode: "onChange",
    defaultValues: {
      name: onboarding.name || "",
      referredBy: onboarding.referralCode || ""
    },
    resolver: yupResolver(validationSchema)
  })

  useEffect(() => {
    setValue("referredBy", window.localStorage.getItem("referrer") || "")
  }, [isLoggedIn])

  const [showReferal, setShowReferal] = useState(false)

  const onSubmit = async (data: WelcomeFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // const response: any = await editProfile(data);
    // if(response?.success) {
    setOnboarding(data)
    goToNextStep()
    // }
  }

  const clearData = () => {
    logout()
    window.localStorage.clear()
    resetUser()
    resetSettings()
  }
  return (
    <>
      <CheckerChainImage className="w-[146px] h-[146px]" />
      <Text variant="subtitle" className="font-bold leading-8 text-8">
        Welcome to CheckerChain
      </Text>
      <Text
        variant="body"
        className="mt-2 text-content-tertiary text-base text-ellipsis"
      >
        What name should we call you with?
      </Text>
      <form
        className="w-full"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <Input
          type={"text"}
          label={"Name"}
          error={!!errors.name}
          helper={errors.name?.message?.toString()}
          className="w-full mt-6 text-start"
          placeholder="Enter your name here"
          autoFocus
          {...register("name")}
        />
        {showReferal && (
          <Input
            type={"text"}
            error={!!errors.referredBy}
            label={"Referral Code (optional)"}
            helper={errors.referredBy?.message?.toString()}
            placeholder="Enter your referral code here"
            className="text-start w-full mt-[6px]"
            {...register("referredBy")}
          />
        )}
        <Button
          title="Continue"
          className="w-full mt-[14px]"
          size="large"
          type="submit"
        />
      </form>
      {isLoggedIn && (
        <p className="text-base mt-3">
          Connected with{" "}
          <span className="italic">
            {toSubstring(account.address, 5, true)}
          </span>
          <span onClick={clearData} className="text-primary cursor-pointer">
            &ensp;Use other address
          </span>
        </p>
      )}
      {!showReferal && (
        <p className="text-base mt-6">
          Have a referral code?{" "}
          <span
            onClick={() => setShowReferal(true)}
            className="text-primary cursor-pointer"
          >
            Enter referral code
          </span>
        </p>
      )}
    </>
  )
}
