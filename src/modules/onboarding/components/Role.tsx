import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Text } from "components"
import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { useUserStore } from "stores"
import * as Yup from "yup"

interface WelcomeProps {
  goToNextStep: () => void
}
type RoleData = string | boolean
interface RoleFormData {
  roles: RoleData[]
}

export const Role: FC<WelcomeProps> = ({ goToNextStep }) => {
  const validationSchema: Yup.SchemaOf<RoleFormData> = Yup.object().shape({
    roles: Yup.array().test(
      "check-array",
      "Please select at least one role",
      (roles) => {
        return (roles?.filter((role) => role)?.length || 0) > 0
      }
    )
  })

  const { onboarding, setOnboarding } = useUserStore((state) => state)

  const getInitialRoles = () => {
    if (onboarding.bestDescribeInCheckerchain) {
      const userRoles = onboarding?.bestDescribeInCheckerchain || ""
      return [
        userRoles.includes("Reviewer") && "Reviewer",
        userRoles.includes("Poster") && "Poster",
        userRoles.includes("Influencer") && "Influencer",
        userRoles.includes("Undecided") && "Undecided"
      ]
    }
    return [false, false, false, false]
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    resetField
  } = useForm<RoleFormData>({
    mode: "onChange",
    defaultValues: {
      roles: getInitialRoles()
    },
    resolver: yupResolver(validationSchema)
  })

  const [disabled, setDisabled] = useState(false)
  const onSubmit = async (data: RoleFormData) => {
    setOnboarding({
      bestDescribeInCheckerchain: data.roles.filter((role) => role).toString()
    })
    goToNextStep()
  }

  return (
    <>
      <Text variant="modal-header" className="mt-[40px] !text-3xl">
        What describes you best in CheckerChain?
      </Text>
      <Text
        variant="body"
        className="mt-2 text-content-tertiary text-base text-ellipsis"
      >
        Choose a role that describes you best on CheckerChain Platform.
      </Text>
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full flex flex-col items-start px-8 gap-2 mt-6">
          <div className="flex items-center gap-[15px]">
            <input
              className={`${disabled && "!cursor-not-allowed"}`}
              type="checkbox"
              value="Reviewer"
              {...register("roles.0")}
              disabled={disabled}
            />
            <span>Reviewer</span>
          </div>
          <div className="flex items-center gap-[15px]">
            <input
              className={`${disabled && "!cursor-not-allowed"}`}
              type="checkbox"
              value="Poster"
              {...register("roles.1")}
              disabled={disabled}
            />
            <span>Poster</span>
          </div>
          <div className="flex items-center gap-[15px]">
            <input
              className={`${disabled && "!cursor-not-allowed"}`}
              type="checkbox"
              value="Influencer"
              {...register("roles.2")}
              disabled={disabled}
            />
            <span>Influencer</span>
          </div>
          <div className="flex items-center gap-[15px]">
            <input
              type="checkbox"
              value="Undecided"
              {...register("roles.3")}
              onChange={(e) => {
                if (e.target.checked) {
                  reset()
                  setValue("roles.3", "Undecided")
                  setDisabled(true)
                } else {
                  resetField("roles.3")
                  setDisabled(false)
                }
              }}
            />
            <span>Undecided</span>
          </div>
          <p className={`text-error italic text-xs leading-[18px] mt-2`}>
            {errors?.roles?.message}
          </p>
          <p className={`text-error italic text-xs leading-[18px] mt-2`}>
            Note: You can select multiple roles unless undecided
          </p>
        </div>
        <Button
          type="submit"
          className="w-full mt-2"
          size="large"
          title="Continue"
        />
      </form>
    </>
  )
}
