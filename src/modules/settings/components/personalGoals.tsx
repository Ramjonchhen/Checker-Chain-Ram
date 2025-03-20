import { yupResolver } from "@hookform/resolvers/yup"
import GoalsImage from "assets/images/goals.svg"
import { Card, Input, UpdateButton } from "components"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useSettingStore } from "stores"
import * as Yup from "yup"
import { PersonalGoalFormData } from "./personalGoals.d"

export const PersonalGoals = () => {
  // const [showDropdown, setShowDropdown] = useState(false)
  const validationSchema: Yup.SchemaOf<PersonalGoalFormData> =
    Yup.object().shape({
      maxNumOfReviewPerDay: Yup.number()
        .typeError("Valid Number is required")
        .required("Personal goals is required")
        .min(0, "Personal goals must be greater than or equals to 0")
        .max(50, "Personal goals must be less than or equals to 50")
    })

  const { settings, setPersonalGoals } = useSettingStore((state) => state)
  const [loading, setLoading] = useState(false)

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    getValues,
    watch
  } = useForm<PersonalGoalFormData>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      maxNumOfReviewPerDay: settings.maxNumOfReviewPerDay
    }
  })
  const watchMaxNumberOfReview = watch("maxNumOfReviewPerDay")

  const onSubmit = (data: PersonalGoalFormData) => {
    setLoading(true)
    setTimeout(() => {
      setPersonalGoals(data.maxNumOfReviewPerDay)
      setLoading(false)
    }, 1000)
  }

  useEffect(() => {
    setValue("maxNumOfReviewPerDay", settings.maxNumOfReviewPerDay)
  }, [settings, setValue])

  return (
    <Card className="p-0">
      <div className="px-7 pt-5 pb-2 text-content-primary text-2xl font-medium border-b border-outline-secondary">
        Personal Goals
      </div>
      <div className="px-7 py-6 flex md:flex-nowrap flex-wrap md:gap-20 divide-x divide-outline-secondary">
        <form
          className="w-full md:w-1/2 flex gap-2 flex-col"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <p className="text-sm">Maximum number of review tasks per day</p>
          <Input
            error={!!errors.maxNumOfReviewPerDay}
            helper={`${errors.maxNumOfReviewPerDay?.message || ""}`}
            type="number"
            inputClassName="h-10"
            {...register("maxNumOfReviewPerDay")}
          />
          <div className="mt-2">
            <UpdateButton
              type="submit"
              loading={loading}
              title="Save"
              afterTitle="Saved"
              loadingTitle="Saving"
              className="w-full"
              disabled={
                !!watchMaxNumberOfReview &&
                getValues().maxNumOfReviewPerDay ===
                  settings.maxNumOfReviewPerDay
              }
            />
          </div>
        </form>
        <div className="flex flex-col w-full mt-5 md:mt-0 md:w-1/2 items-center justify-center">
          <GoalsImage />
          <p className="mt-4 text-sm text-content-primary text-center w-[234px] font-normal">
            You can set the number of revies tasks you want to perform at a day.
            We will assign you tasks as per your preferences.
          </p>
        </div>
      </div>
    </Card>
  )
}
