import React, { useEffect } from "react"
import { useRouter } from "next/router"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useToastStore } from "stores/toast"
import { useProductStore } from "stores/product"
import { useCategoryStore } from "stores/category"
import { Input, Select, Chip, TextArea, UpdateButton, Button } from "components"
import psl from "psl"

export interface FormValues {
  name: string
  slug: string
  category: string
  description: string
  subcategories: string[]
  url: string
}

export function BasicInformation() {
  const router = useRouter()

  const { getCategories, categories } = useCategoryStore()
  const { updateProduct, product, loading, checkSlug } = useProductStore()
  const { successToast, errorToast } = useToastStore()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validationSchema: any = Yup.object().shape({
    name: Yup.string()
      .required("Product Name is required")
      .max(30, "Product Name must be less than 30 characters"),
    slug: Yup.string()
      .required("Product Slug is required")
      .max(30, "Product Slug must be less than 30 characters"),
    category: Yup.string().required("Category is required"),
    description: Yup.string()
      .required("Description is required")
      .max(500, "Description must be less than 500 characters"),
    url: Yup.string()
      .required("Website URL is required")
      .max(30, "Website URL must be less than 30 characters")
      .test("is-url", "Please enter a valid URL", (value) => {
        return psl.isValid(value || "")
      }),
    subcategories: Yup.array().test(
      "check-array",
      "Please add at least one subcategory",
      (roles) => {
        return (roles?.filter((role) => role)?.length || 0) > 0
      }
    )
  })

  useEffect(() => {
    getCategories()
  }, [])

  const {
    formState: { errors },
    handleSubmit,
    setValue,
    trigger,
    getValues,
    register,
    setError
  } = useForm<FormValues>({
    mode: "all",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      subcategories: []
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    // console.debug(data)
    if (data.slug !== product.slug) {
      const isExists = await checkSlug(data.slug as string)
      if (isExists) {
        setError(
          "slug",
          {
            type: "manual",
            message: "Slug already exists"
          },
          {
            shouldFocus: true
          }
        )
        return
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await updateProduct(product._id, data)
    if (result) {
      successToast({
        message: "Basic info updated successfully"
      })
      router.replace(`${result.data.slug}#settings`)
    } else {
      errorToast({
        message: "Failed to update product"
      })
    }
  }

  useEffect(() => {
    if (product) {
      setValue("name", product.name)
      setValue("category", product.category?.name)
      setValue("description", product.description)
      setValue("subcategories", product.subcategories)
      setValue("url", product.url)
      setValue("slug", product.slug)
    }
  }, [product, setValue])
  return (
    <div>
      <form
        className="flex flex-col py-10 px-12 sticky bottom-0"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <Input
          label="Product Name"
          placeholder="Product Name"
          className="!border-none"
          type="text"
          error={!!errors.name}
          helper={errors.name?.message?.toString()}
          {...register("name")}
        />
        <Input
          label="Product Slug"
          placeholder="Product Slug"
          className="!border-none"
          type="text"
          error={!!errors.slug}
          helper={errors.slug?.message?.toString()}
          {...register("slug")}
        />
        <div className="mt-2 mb-1">
          <Select
            label="Select a category"
            items={categories.map((item) => item.name)}
            value={getValues().category}
            onValueChange={(val) => {
              setValue("category", val as string)
              setValue("subcategories", [])
              trigger("category")
            }}
            placeholder="Select a category"
          />
          {getValues().category && (
            <div
              className={`bg-[#ebf0f3] p-4 flex flex-row flex-wrap gap-2 mt-2 max-h-[144px] overflow-auto`}
            >
              {categories
                .find((item) => item.name === getValues().category)
                ?.subcategories.map((sub) => (
                  <Chip
                    key={sub}
                    title={sub}
                    isSelected={getValues().subcategories.includes(sub)}
                    onChange={(checked) => {
                      // console.debug(checked)
                      if (checked) {
                        setValue("subcategories", [
                          sub,
                          ...getValues().subcategories
                        ])
                        trigger("subcategories")
                      } else {
                        setValue(
                          "subcategories",
                          getValues().subcategories.filter(
                            (item) => item !== sub
                          )
                        )
                        trigger("subcategories")
                      }
                    }}
                  />
                ))}
            </div>
          )}
          {(!!errors.category || !!errors.subcategories) && (
            <p
              className={`${
                !!errors.category || !!errors.subcategories
                  ? "text-error"
                  : "text-content-secondary"
              } italic text-xs leading-[18px] ml-3 mt-2`}
            >
              {errors.category?.message?.toString() ||
                errors.subcategories?.message?.toString()}
            </p>
          )}
        </div>

        <Input
          label="Website URL"
          placeholder="E.g. https://www.example.com"
          type="text"
          error={!!errors.url}
          helper={errors.url?.message?.toString()}
          {...register("url")}
        />

        <TextArea
          className="mt-2"
          label="Product Description"
          placeholder="Product Description"
          error={!!errors.description}
          helper={errors.description?.message?.toString()}
          max={500}
          {...register("description")}
        />

        <div className="flex gap-2">
          <UpdateButton
            loading={loading}
            className="mt-4"
            type="submit"
            title="Update"
          />
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
