import React, { useEffect } from "react"
import { useRouter } from "next/router"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useToastStore } from "stores/toast"
import { useProductStore } from "stores/product"
import { Button, Input } from "components"

export interface FormValues {
  whitepaperUrl?: string
}

export function AdditionalDetails() {
  const router = useRouter()
  const { product, updateProduct } = useProductStore()
  const { successToast, errorToast } = useToastStore()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validationSchema: any = Yup.object().shape({
    whitepaperUrl: Yup.string()
      .required("Website is required.")
      .max(50, "Website must be less than 50 characters")
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
      whitepaperUrl: ""
    }
  })

  useEffect(() => {
    if (product) {
      setValue("whitepaperUrl", product.whitepaperUrl ?? "")
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
          label="Whitepaper Url"
          placeholder="E.g. docs.checkerhain.com"
          type="text"
          error={!!errors.whitepaperUrl}
          helper={errors.whitepaperUrl?.message?.toString()}
          {...register("whitepaperUrl")}
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
