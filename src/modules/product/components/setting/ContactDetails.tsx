import React, { useEffect } from "react"
import { useRouter } from "next/router"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useToastStore } from "stores/toast"
import { useProductStore } from "stores/product"
import { Button, Input } from "components"

export interface FormValues {
  url: string
  contactEmail?: string
  discord?: string
  telegram?: string
  twitterProfile?: string
}

export function ContactDetails() {
  const router = useRouter()
  const { product, updateProduct } = useProductStore()
  const { successToast, errorToast } = useToastStore()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validationSchema: any = Yup.object().shape({
    url: Yup.string()
      .required("Website is required.")
      .max(50, "Website must be less than 50 characters"),
    contactEmail: Yup.string()
      .email("Invalid email address")
      .max(50, "Contact Email must be less than 50 characters"),
    discord: Yup.string().max(
      50,
      "Discord link must be less than 50 characters"
    ),
    telegram: Yup.string().max(
      50,
      "Telegram link must be less than 50 characters"
    ),
    twitter: Yup.string().max(
      50,
      "Twitter link must be less than 50 characters"
    )
  })

  const {
    formState: { errors },
    handleSubmit,
    setValue,
    register
  } = useForm<FormValues>({
    mode: "all",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      url: "",
      contactEmail: "",
      telegram: "",
      twitterProfile: ""
    }
  })

  useEffect(() => {
    if (product) {
      // console.debug(product)
      setValue("contactEmail", product.contactEmail ?? "")
      setValue("telegram", product.telegram ?? "")

      setValue("discord", product.discord ?? "")

      setValue("twitterProfile", product.twitterProfile ?? "")
      setValue("url", product.url ?? "")
    }
  }, [product, setValue])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    // console.debug(data)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await updateProduct(product._id, data)
    if (result) {
      successToast({
        message: "Details updated successfully"
      })
    } else {
      errorToast({
        message: "Failed to update details"
      })
    }
  }

  return (
    <div>
      <form
        className="flex flex-col py-10 px-12 bottom-0"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <Input
          label="Website"
          placeholder="E.g. app.checkerhain.com"
          type="text"
          error={!!errors.url}
          helper={errors.url?.message?.toString()}
          {...register("url")}
        />
        <Input
          label="Email Address"
          placeholder="Email Address"
          type="text"
          error={!!errors.contactEmail}
          helper={errors.contactEmail?.message?.toString()}
          {...register("contactEmail")}
        />
        <Input
          label="Discord"
          placeholder="Discord"
          type="text"
          error={!!errors.discord}
          helper={errors.discord?.message?.toString()}
          {...register("discord")}
        />
        <Input
          label="Telegram"
          placeholder="Telegram"
          type="text"
          error={!!errors.telegram}
          helper={errors.telegram?.message?.toString()}
          {...register("telegram")}
        />
        <Input
          label="Twitter"
          placeholder="Twitter"
          type="text"
          error={!!errors.twitterProfile}
          helper={errors.twitterProfile?.message?.toString()}
          {...register("twitterProfile")}
        />
        <div className="flex gap-2">
          <Button className="mt-4" type="submit" title="Update" />
          <Button
            onClick={() => {
              router.push({
                pathname: router.pathname,
                query: router.query,
                hash: ""
              })
            }}
            variant="text"
            className="mt-4"
            type="button"
            title="Cancel"
          />
        </div>
      </form>
    </div>
  )
}
