/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTrackTransactionStatus } from "lib/dApp-core"
import { yupResolver } from "@hookform/resolvers/yup"
import { Card, Chip, Input, Select, TextArea, UpdateButton } from "components"
import Meta from "components/Meta"
import Layout from "layout"
import type { NextPage } from "next"
import { useEffect, useRef, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import * as Yup from "yup"
import * as Icons from "assets/icons"
import { useCategoryStore } from "stores/category"
import { useProductStore, Product as IProduct } from "stores/product"
import { useToastStore } from "stores/toast"
import { Product } from "modules/product"
import { useUserStore } from "stores"
import { useRouter } from "next/router"
import { useProductContract } from "hooks/useProductContract"
import { useWallet } from "hooks/useWallet"
// import { getNetwork } from "config"
import { addHttps } from "utils"
import RadioGroup from "components/radioGroup"
import { CreateProductOffersImg, DiscountCodeImg } from "assets/images"
import Checkbox from "components/checkbox"
import { twMerge } from "tailwind-merge"
import { constants } from "constants/common"
// import TimePicker from "components/timepicker"
import ImagePicker from "components/imagePicker"
import useMediaQuery from "hooks/useMediaQuery"
import { CHECKR } from "assets/icons/token-icons"
import HoursOfOperation, {
  HoursOfOperationRef
} from "components/hoursOfOperation/HoursOfOperation"
import useSecondsCountdown from "hooks/useSecondsCountdown"

interface FormValues {
  name: string
  category: string
  description: string
  subcategories: string[]
  url: string
  specialOffersRadioGroup: string
  discountCodeCheckValue: boolean
  offerCheckValue: boolean
  discountCode: string
  offer: number
  specialReviewRequest: string
  location: string

  twitterProfile: string
}

const radioOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" }
]

// const network = getNetwork()

const CreatePage: NextPage = () => {
  const hoursOfOperationRef = useRef<HoursOfOperationRef>(null)
  const hoursOfOperationSectionWrapperRef = useRef<HTMLDivElement | null>(null)
  const matches = useMediaQuery("(min-width: 1024px)")
  const [product, setProduct] = useState<IProduct | null>(null)
  const [sid, setSid] = useState<string | null>("")
  const [selectedProductImage, setSelectedProductImage] = useState<File | null>(
    null
  )
  const [selectedCoverPhoto, setSelectedCoverPhoto] = useState<File | null>(
    null
  )
  const [profilePictureError, setProfilePictureError] = useState("")
  const [coverImageError, setCoverImageError] = useState("")

  const { getCategories, categories } = useCategoryStore()
  const { addProduct, syncProduct, uploadProductImage, error } =
    useProductStore()
  const { successToast, errorToast } = useToastStore()
  const { user } = useUserStore()
  const router = useRouter()
  const { createProduct } = useProductContract()
  const { userBalance } = useWallet()

  const { isCancelled, isPending, isSuccessful, isFailed } =
    useTrackTransactionStatus({
      transactionId: sid
    })

  useEffect(() => {
    getCategories()
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validationSchema: any = Yup.object().shape({
    name: Yup.string()
      .required("Product Name is required")
      .max(30, "Product Name must be less than 30 characters"),
    category: Yup.string().required("Category is required"),
    description: Yup.string()
      .required("Description is required")
      .max(500, "Description must be less than 500 characters"),
    url: Yup.string()
      .required("Website URL is required")
      .max(250, "Website URL must be less than 250 characters")
      .test("is-url", "Please enter a valid URL", (value) => {
        try {
          return !!new URL(addHttps(value || ""))
        } catch {
          return false
        }
        // const url = (value || "").replace(/(^\w+:|^)\/\//, "")
        // return psl.isValid(url)
      }),
    twitterProfile: Yup.string().max(
      50,
      "Twitter link must be less than 50 characters"
    ),

    subcategories: Yup.array().test(
      "check-array",
      "Please add at least one subcategory",
      (roles) => {
        return (roles?.filter((role) => role)?.length || 0) > 0
      }
    ),
    specialReviewRequest: Yup.string().max(
      500,
      "Special Review Request must be less than 500 characters"
    ),
    location: Yup.string()
      .required("Location  is required")
      .max(30, "Location must be less than 30 characters"),
    offer: Yup.string()
      .optional()
      .test(
        "shouldBePositive",
        "Offer should only be a positive integer",
        function (value) {
          if (Number(value) >= 0) return true
          return false
        }
      )
  })

  const methods = useForm<FormValues>({
    mode: "all",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      subcategories: [],
      specialOffersRadioGroup: "no",
      discountCodeCheckValue: false,
      offerCheckValue: false,
      discountCode: "",
      offer: 0,
      specialReviewRequest: "",
      location: "",
      twitterProfile: ""
    }
  })

  const {
    formState: { errors },
    handleSubmit,
    setValue,
    trigger,
    getValues,
    register,
    watch
  } = methods

  const hasSpecialOffers = watch("specialOffersRadioGroup") === "yes" ?? false
  const watchDiscountCodebox = watch("discountCodeCheckValue")
  const watchOfferCodeCheckbox = watch("offerCheckValue")
  const watchOfferValue = watch("offer") ?? 0
  const watchDescriptionValue = watch("description")

  const additionalValIfDiscountEnabled = watchDiscountCodebox ? 500 : 0
  const additionalValIfOfferEnabled = watchOfferCodeCheckbox
    ? Number(watchOfferValue) * 0.1 + Number(watchOfferValue)
    : 0

  const additionalIncentivesValue =
    additionalValIfDiscountEnabled + additionalValIfOfferEnabled

  const totalCostOfProduct =
    additionalIncentivesValue + constants.PRODUCT_CREATION_FEE_NUMBER ??
    constants.PRODUCT_CREATION_FEE_NUMBER

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    if (!user.isProfileComplete) {
      errorToast({
        message: "Only users with complete profile can create a product"
      })
      return
    }
    if ((user.nextCreateProductTime || 0) > 0) {
      errorToast({
        message: "You can only create a product once every 24 hours"
      })
      return
    }

    const hoursOfOperationRefCurrent = hoursOfOperationRef.current
    let operationData: any = {}
    if (hoursOfOperationRefCurrent) {
      operationData = hoursOfOperationRefCurrent.finalData()
      if (
        !operationData.availableAllTime &&
        hoursOfOperationRefCurrent.hasErrors
      ) {
        if (hoursOfOperationSectionWrapperRef.current) {
          hoursOfOperationSectionWrapperRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "start"
          })
        }
        return
      }
    }

    if (!selectedProductImage || !selectedCoverPhoto) {
      if (!selectedProductImage) {
        setProfilePictureError("Product Image is required.")
        matches &&
          errorToast({
            message: "Product Image is required."
          })
      }
      if (!selectedCoverPhoto) {
        setCoverImageError("Cover Image is required.")
        matches &&
          errorToast({
            message: "Cover Image is required."
          })
      }
      window.scrollTo({ behavior: "smooth", top: 0 })
      return
    }

    if (userBalance < 10) {
      errorToast({
        message: "You need at least 10 CHECKR to create a product"
      })
      return
    }

    const submitData = {
      ...data,
      url: data.url.replace(/(^\w+:|^)\/\//, ""),
      operation: operationData
    }

    submitData.offerCheckValue = undefined
    submitData.discountCodeCheckValue = undefined
    submitData.specialOffersRadioGroup = undefined
    if (!hasSpecialOffers) submitData.offer = 0
    if (!hasSpecialOffers) submitData.discountCode = ""
    try {
      const result: any = await addProduct(submitData)
      if (result) {
        setProduct(result.data)

        Promise.allSettled([
          createProduct({
            productId: result.data._id,
            walletAddress: user.wallet,
            callback: (sid) => {
              setSid(sid)
            },
            createFeeAmount: totalCostOfProduct
          }),
          uploadProductImage(result.data._id, selectedProductImage, "logo"),
          uploadProductImage(result.data._id, selectedCoverPhoto, "coverImage")
        ])
      } else {
        errorToast({
          message: error || "Failed to create product"
        })
      }
    } catch (error: any) {
      errorToast({
        message: error?.toString() || "Failed to create product"
      })
    }
  }

  useEffect(() => {
    if (isSuccessful) {
      successToast({
        message: "Product created successfully"
      })
      syncProduct(product?._id || "")
      setSid(null)
      router.push(`/product/${product?.slug}`)
    } else if (isCancelled) {
      setSid(null)
      errorToast({
        message: "Product creation cancelled"
      })
    } else if (isFailed) {
      setSid(null)
      errorToast({
        message: "Product creation failed"
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCancelled, isFailed, isSuccessful, errorToast, successToast])

  const { hours, minutes, seconds } = useSecondsCountdown(
    user.nextCreateProductTime as number
  )

  const isCreateProductBtnDisabled =
    !user.isProfileComplete || (user.nextCreateProductTime || 0) > 0

  const findCreateProductBtnCtaText = (): string => {
    if (isCreateProductBtnDisabled) {
      if (!user.isProfileComplete) {
        return "Please complete your profile"
      }
      if ((user.nextCreateProductTime || 0) > 0) {
        return `Available in: ${hours}:${minutes}:${seconds}`
      }
      return "Create Product"
    } else {
      return "Create Product"
    }
  }

  const createProductBtnText = findCreateProductBtnCtaText()

  return (
    <Layout>
      <Meta url={router.asPath} />
      <div
        className={twMerge(
          "flex flex-col lg:flex-row gap-8",
          constants.APP_CONTAINER_WIDTH
        )}
      >
        <div className="w-full lg:max-w-[400px] shadow-lg bg-white">
          <FormProvider {...methods}>
            <form
              className="flex flex-col px-3 md:px-8 py-8 sticky bottom-0"
              onSubmit={handleSubmit(onSubmit)}
              autoComplete="off"
            >
              <div className="flex justify-between">
                <span className="text-xs text-neutral-600 font-normal">
                  {"Home > Product Creation"}
                </span>
                <Icons.ArrowRightIcon
                  className="hover:cursor-pointer"
                  onClick={() => router.back()}
                />
              </div>
              <span className="text-2xl font-semibold leading-[30px] tracking-[-0.02em] text-black mb-6">
                Create Product
              </span>

              <div className="flex flex-col gap-4 lg:hidden">
                <ImagePicker
                  title="Product Image"
                  onFileSelected={function (file: File): void {
                    setSelectedProductImage(file)
                    setProfilePictureError("")
                  }}
                  required
                  errorMessage={profilePictureError}
                  imageContainerClassName="h-[110px]"
                  value={selectedProductImage}
                />
                <ImagePicker
                  onFileSelected={function (file: File): void {
                    setSelectedCoverPhoto(file)
                    setCoverImageError("")
                  }}
                  title="Cover Picture"
                  required
                  errorMessage={coverImageError}
                  imageContainerClassName="h-[110px]"
                  value={selectedCoverPhoto}
                />
              </div>
              <Input
                label="Product Name"
                labelClassName="text-neutral-700 text-xs tracking-[0.02em] font-medium leading-6"
                placeholder="Product Name"
                type="text"
                error={!!errors.name}
                value={getValues().name}
                helper={errors.name?.message?.toString()}
                className="mt-4"
                onChange={(e) => {
                  if (e.target.value.length <= 31) {
                    setValue("name", e.target.value)
                    trigger("name")
                  }
                }}
                required
              />
              <div className="mt-4">
                <Select
                  label="Select a category"
                  labelClassName="text-neutral-700 text-xs tracking-[0.02em] font-medium leading-6"
                  items={categories.map((item) => item.name)}
                  value={getValues().category}
                  onValueChange={(val) => {
                    setValue("category", val as string)
                    setValue("subcategories", [])
                    trigger("category")
                  }}
                  placeholder="Select a category"
                  required
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
              <TextArea
                className="mt-4"
                label="About the product"
                labelClassName="text-neutral-700 text-xs tracking-[0.02em] font-medium leading-6"
                placeholder="Description"
                error={!!errors.description}
                helper={errors.description?.message?.toString()}
                max={500}
                {...register("description")}
                required
              />
              <Input
                label="Website URL"
                labelClassName="text-neutral-700 text-xs tracking-[0.02em] font-medium leading-6"
                placeholder="www.checkerhain.com"
                type="text"
                error={!!errors.url}
                value={getValues().url}
                helper={errors.url?.message?.toString()}
                className="mt-2"
                onChange={(e) => {
                  // if (e.target.value.length <= 31) {
                  setValue("url", e.target.value)
                  trigger("url")
                  // }
                }}
                required
              />

              <Input
                label="Twitter Url"
                labelClassName="text-neutral-700 text-xs tracking-[0.02em] font-medium leading-6"
                placeholder="Twitter"
                type="text"
                error={!!errors.twitterProfile}
                helper={errors.twitterProfile?.message?.toString()}
                {...register("twitterProfile")}
              />
              <Input
                label="Location Served"
                labelClassName="text-neutral-700 text-xs tracking-[0.02em] font-medium leading-6"
                placeholder="Location..."
                type="text"
                error={!!errors.location}
                helper={errors.location?.message?.toString()}
                {...register("location")}
                required
                className="mt-4"
              />
              <div className="mt-4" ref={hoursOfOperationSectionWrapperRef}>
                <HoursOfOperation ref={hoursOfOperationRef} />
              </div>

              {/* <div className="mt-4">
                <div className="text-xs leading-6 tracking-[0.02em] font-medium text-neutral-700">
                  Hours of Operation
                </div>
                <div className="flex gap-2">
                  <TimePicker
                    label={"Open Time"}
                    name={"openTime"}
                    errorMessage={errors.openTime?.message?.toString()}
                    required
                  />
                  <TimePicker
                    label={"Closing Time"}
                    name={"closeTime"}
                    errorMessage={errors.closeTime?.message?.toString()}
                    required
                  />
                </div>
              </div> */}

              <TextArea
                className="mt-4"
                label="Special Review request"
                labelClassName="text-neutral-700 text-xs tracking-[0.02em] font-medium leading-6"
                placeholder="Please mention what you prefer reviewer to analyze"
                error={!!errors.specialReviewRequest}
                helper={errors.specialReviewRequest?.message?.toString()}
                max={500}
                {...register("specialReviewRequest")}
              />
              <div className="mt-2">
                <div className="text-xs font-medium leading-6 tracking-[0.02em] text-neutral-700">
                  Do you have any special offers?
                </div>
                <RadioGroup
                  name="specialOffersRadioGroup"
                  options={radioOptions}
                />
              </div>
              {hasSpecialOffers && (
                <div className="flex flex-col sm:flex-row gap-4 mt-7">
                  <Checkbox
                    name="discountCodeCheckValue"
                    label="Discount Code"
                    checked={watchDiscountCodebox}
                    logo={<DiscountCodeImg />}
                  />
                  <Checkbox
                    name="offerCheckValue"
                    label="Offers"
                    checked={watchOfferCodeCheckbox}
                    logo={<CreateProductOffersImg />}
                  />
                </div>
              )}
              {hasSpecialOffers && watchDiscountCodebox && (
                <Input
                  label="Discount Code"
                  labelClassName="text-neutral-700 text-xs tracking-[0.02em] font-medium leading-6"
                  placeholder="Enter your discount code here..."
                  type="text"
                  error={!!errors.discountCode}
                  helper={errors.discountCode?.message?.toString()}
                  {...register("discountCode")}
                  className="mt-4"
                />
              )}
              {hasSpecialOffers && watchOfferCodeCheckbox && (
                <Input
                  label="Offers"
                  labelClassName="text-neutral-700 text-xs tracking-[0.02em] font-medium leading-6"
                  placeholder="Enter incentive amounts..."
                  type="number"
                  error={!!errors.offer}
                  helper={errors.offer?.message?.toString()}
                  {...register("offer")}
                  min="1"
                  step={1}
                  className="mt-4"
                />
              )}
              <div className="h-[1px] w-full bg-separator mt-7" />
              <div className="mt-4">
                <div className="flex justify-between text-sm leading-[21px] font-semibold text-neutral-900">
                  <div>Total Amount:</div>
                  <div className="flex items-center gap-1">
                    <div>
                      <CHECKR />
                    </div>
                    ${totalCostOfProduct} CHECKR
                  </div>
                </div>
                {[
                  {
                    name: "Additional Incentives",
                    value: `${additionalIncentivesValue}`
                  },
                  {
                    name: "Product Creation Fee",
                    value: `${constants.PRODUCT_CREATION_FEE_NUMBER}`
                  }
                ].map((item) => (
                  <div
                    key={`${item.name}-${item.value}`}
                    className="flex flex-col gap-1 mt-2 text-xs font-normal leading-5 text-neutral-400"
                  >
                    <div className="flex justify-between">
                      <div>{item.name}</div>
                      <div>${item.value} CHECKR</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-[1px] w-full bg-separator mt-4" />
              <span className="block text-xs mt-5  text-secondary-900 font-normal">
                Further information can be added after the product is created.
              </span>

              <UpdateButton
                loading={isPending}
                disabled={isCreateProductBtnDisabled}
                className="mt-4"
                type="submit"
                title={createProductBtnText}
              />
            </form>
          </FormProvider>

          {/* <Button
            title="create"
            onClick={() =>
              createProduct({
                productId: Math.random().toString(36).substring(7),
                walletAddress: user.wallet
              })
            }
          /> */}
        </div>
        <Card className="w-full p-4 pt-0  mt-6 hidden lg:block bg-white h-full">
          <Product
            className="pt-4 pb-8"
            title={getValues().name}
            category={getValues().category}
            subcategories={getValues().subcategories}
            description={watchDescriptionValue}
            url={getValues().url}
            createProductImage={selectedProductImage}
            createProductCoverPhoto={selectedCoverPhoto}
            image={""}
            createdBy={user}
            isCreateProduct
            whitepaperUrl={""}
            handleCreateProductImage={function (file: File): void {
              setSelectedProductImage(file)
              setProfilePictureError("")
            }}
            handleCreateProductCoverImage={function (file: File): void {
              setSelectedCoverPhoto(file)
              setCoverImageError("")
            }}
          />
        </Card>
      </div>
    </Layout>
  )
}

export default CreatePage
