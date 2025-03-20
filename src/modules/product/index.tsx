import {
  Button,
  Card,
  EmptyState,
  Modal,
  TabView,
  Text,
  DropdownMenu,
  UpdateButton
} from "components"

import Image from "next/image"
import { FC, useState, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import {
  Highlights
  // Announcements
} from "./components"
import * as Icons from "assets/icons"
import { twMerge } from "tailwind-merge"
import { useProductStore } from "stores/product"
import { User, api } from "stores"
import { useUserStore } from "stores"
import { Review } from "./components/review"
import { ProductSetting } from "./components/setting"
import { getBaseBackendImageUrl } from "utils"
import { UploadImage } from "components/uploadImage"
import { addHttps } from "utils/addHttps"
import TwitterContainer from "./components/Twitter"
import { useTrackTransactionStatus } from "lib/dApp-core"
import { useProductContract } from "hooks/useProductContract"
import { useToastStore } from "stores/toast"
import { Airdrop } from "./airdrop"
import { UserMeta } from "interfaces/user"
import ProductDescription from "./components/productDescription"
import { useProductRatingData } from "./useProductRatingData"
import TooltipSpan from "components/toolTipSpan"
import SeoJsonLDProduct from "components/seoJsonLd"
import ImagePicker from "components/imagePicker"
import QuizCard from "./components/Quiz/QuizCard"
import QuizBanner from "./components/Quiz/QuizBanner"
import { useQuizesStore } from "stores/quiz"
import { useContainerDimensions } from "hooks/useContainerDimensions"
import ProductScore from "./components/ProductScore"
import { useGetLoginInfo } from "lib/dApp-core"
import { constants } from "constants/common"
import SideDrawer from "components/sideDrawer"
import { OperatingHoursData } from "components/hoursOfOperation/DisplayHoursOfOperation"
// import { backendUrls } from "constants/backendUrls"

export interface ProductProps {
  title: string
  description: string
  image: string
  category: string
  subcategories: string[]
  url: string
  whitepaperUrl: string
  createdBy: UserMeta | User
  claimedBy?: UserMeta
  className?: string
  isCreateProduct?: boolean
  coverImage?: string
  createProductImage?: File | null
  createProductCoverPhoto?: File | null
  handleCreateProductImage?: (file: File) => void
  handleCreateProductCoverImage?: (file: File) => void
  reviewDeadline?: number
  operation?: OperatingHoursData
}

// TODO: REFACTOR THE PAGE SO THAT MODALS ARE IN THEIR OWN COMPONENT

export const Product: FC<ProductProps> = (props) => {
  const {
    title,
    category,
    url,
    className = "",
    isCreateProduct = false,
    image,
    coverImage,
    createProductImage = null,
    createProductCoverPhoto = null,
    handleCreateProductImage = () => {},
    handleCreateProductCoverImage = () => {},
    reviewDeadline = 0
  } = props

  const router = useRouter()
  const {
    subscribeProduct,
    subscribeLoading,
    product,
    uploadProductImage,
    loading,
    removeProductImage,
    deleteProduct,
    syncProduct,
    checkProductStatus,
    getProduct
  } = useProductStore()
  const { authorization, user: currentUser } = useUserStore()
  const productTitleDivRef = useRef<HTMLDivElement>(null)
  const { width: productTitleDivWidth } =
    useContainerDimensions(productTitleDivRef)

  const [showSetting, setShowSetting] = useState(false)
  const [showQuizCard, setShowQuizCard] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [imageFile, setImageFile] = useState<File | null | undefined>(null)
  const [activeModal, setActiveModal] = useState<"logo" | "coverImage" | null>(
    null
  )
  const [deleteModal, setDeleteModal] = useState(false)
  const [productDeleted, setProductDeleted] = useState(false)
  const [completeSetupModal, setCompleteSetupModal] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [sid, setSid] = useState<string | null>("")
  const [defaultActiveTab, setDefaultActiveTab] = useState(0)
  const [isTrcmCheckLoading, setIsTrcmCheckLoading] = useState(false)
  const { successToast, errorToast } = useToastStore()
  const { createProduct } = useProductContract()
  const { getQuizQuestions, quizQuestions, postQuizResponse } = useQuizesStore()
  const { isLoggedIn } = useGetLoginInfo()

  const { isCancelled, isPending, isSuccessful, isFailed } =
    useTrackTransactionStatus({
      transactionId: sid
    })

  const {
    isSuccessful: isReviewSuccessful,
    isFailed: isReviewFailed,
    isCancelled: isReviewCancelled
  } = useTrackTransactionStatus({
    transactionId: localStorage.getItem("reviewSessionId")
  })

  const { ratingData } = useProductRatingData(product)

  useEffect(() => {
    if (!isCreateProduct) {
      getQuizQuestions(
        encodeURIComponent(product?.category?.name || "Blockchain & Crypto")
      )
    }
  }, [isCreateProduct])

  useEffect(() => {
    if (isSuccessful) {
      setCreateLoading(false)
      setSid(null)
      successToast({
        message: "Product completed successfully"
      })
      syncProduct(product?._id || "")
    } else if (isCancelled) {
      setCreateLoading(false)
      setSid(null)
      errorToast({
        message: "Product completion cancelled"
      })
    } else if (isFailed) {
      setCreateLoading(false)
      setSid(null)
      errorToast({
        message: "Product completion failed"
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCancelled, isFailed, isSuccessful, errorToast, successToast])

  useEffect(() => {
    if (isReviewSuccessful) {
      setCreateLoading(false)
      localStorage.removeItem("reviewSessionId")
      if (!showQuizCard) {
        const quizData = localStorage.getItem("quizData")
        if (quizData) {
          try {
            const data = JSON.parse(quizData)
            if (data?.product === product._id) {
              postQuizResponse(data)
                .then(() => {
                  getProduct(product._id, currentUser._id)
                  localStorage.removeItem("quizData")
                })
                .catch((err) => {
                  localStorage.removeItem("quizData")
                  errorToast({
                    message:
                      err?.response?.data?.message ?? "Failed to submit review"
                  })
                })
            }
          } catch (e) {
            console.error(e)
          }
        }
      }

      syncProduct(product?._id || "")
    } else if (isReviewCancelled) {
      setCreateLoading(false)
      localStorage.removeItem("reviewSessionId")
      errorToast({
        message: "Product review cancelled"
      })
    } else if (isReviewFailed) {
      setCreateLoading(false)
      localStorage.removeItem("reviewSessionId")
      errorToast({
        message: "Product review failed"
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isReviewCancelled,
    isReviewFailed,
    isReviewSuccessful,
    errorToast,
    successToast
  ])

  useEffect(() => {
    if (product && product.isOwner && router) {
      setShowSetting(router.asPath.includes("#settings"))
    }

    if (product?._id) {
      setIsTrcmCheckLoading(true)
      ;(async () => {
        try {
          const res = await api.get(`/trcm/check/${product._id}`)

          try {
            // const data = await getUserReview({
            //   productId: product._id,
            //   walletAddress: currentUser?.wallet
            // })

            setShowBanner(res.data.isAllowed)

            setIsTrcmCheckLoading(false)
          } catch (err) {
            setShowBanner(res.data.isAllowed)
            setIsTrcmCheckLoading(false)
          }
        } catch (e) {
          setShowBanner(false)
          setIsTrcmCheckLoading(false)
        }
      })()
    }
  }, [router, product, currentUser?.wallet])

  const completeProductSetup = async () => {
    setCreateLoading(true)
    const res = await checkProductStatus(product._id)
    // console.debug(res)
    if (res.status === "success") {
      if (res.allowed)
        createProduct({
          productId: product._id,
          createFeeAmount:
            Number(product?.offer ?? "0") +
              constants.PRODUCT_CREATION_FEE_NUMBER ??
            constants.PRODUCT_CREATION_FEE_NUMBER,
          walletAddress: product.createdBy?.wallet || "",
          callback: (sid) => {
            setSid(sid)
          }
        })
      else {
        getProduct(product._id, currentUser?._id)
        setCreateLoading(false)
        successToast({
          message: "Product setup completed successfully"
        })
      }
    } else {
      errorToast({
        message: res?.message || "Failed to claim product"
      })
    }
  }

  const onSubscribeProduct = () => {
    subscribeProduct(product._id)
  }

  const showBannerCondition =
    !isCreateProduct && !showQuizCard && isLoggedIn && showBanner
  // console.log("showBannerCondition", showBannerCondition)
  // console.log("showQuizCard", showQuizCard)
  // console.log("isLoggedIn", isLoggedIn)
  // console.log("showBanner", showBanner)
  return (
    <div className="relative">
      {!isCreateProduct && <SeoJsonLDProduct ratingData={ratingData} />}
      {showBannerCondition && (
        <QuizBanner
          reviewDeadline={reviewDeadline}
          setShowQuizCard={setShowQuizCard}
          setDefaultActiveTab={setDefaultActiveTab}
        />
      )}
      <SideDrawer isDrawerOpen={showQuizCard}>
        <QuizCard
          setShowQuizCard={setShowQuizCard}
          quizQuestions={quizQuestions}
          product={product}
        />
      </SideDrawer>

      <div
        className={twMerge(
          !isCreateProduct && "flex flex-col-reverse lg:flex-row relative"
        )}
      >
        <div className={twMerge(className, "w-full")}>
          <Card className="py-0 shadow-none bg-black px-0">
            {/** Gradient Div */}
            <div className="relative">
              {product.isOwner && (
                <div
                  className="hover:animate-scale absolute p-1 top-2 right-2 text-white bg-primary rounded-lg cursor-pointer"
                  onClick={() => {
                    setActiveModal("coverImage")
                  }}
                >
                  <Icons.CameraIcon className="w-8 h-8" />
                </div>
              )}
              {(activeModal === "coverImage" && imageFile) ||
              (coverImage && !isCreateProduct) ? (
                <div
                  style={{
                    backgroundImage: `url(${
                      activeModal === "coverImage" && imageFile
                        ? URL.createObjectURL(imageFile as File)
                        : getBaseBackendImageUrl() + coverImage
                    })`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover"
                  }}
                  className={`h-[250px] border border-separate shadow-sm rounded-sm`}
                />
              ) : (
                <div
                  className={`overflow-hidden rounded-sm select-none h-[240px] `}
                >
                  {isCreateProduct ? (
                    <ImagePicker
                      onFileSelected={handleCreateProductCoverImage}
                      imageContainerClassName="h-full w-full"
                      className="h-full"
                      value={createProductCoverPhoto}
                    />
                  ) : (
                    <div className="flex items-center pt-10 justify-center gap-20 px-20 h-full  bg-secondary-gradient">
                      <span
                        className={`text-primary-300 ${
                          (isCreateProduct ? title : product.name).length < 14
                            ? "md:text-8xl"
                            : (isCreateProduct ? title : product.name).length <
                              21
                            ? "md:text-7xl"
                            : (isCreateProduct ? title : product.name).length <
                              26
                            ? "md:text-6xl"
                            : "md:text-5xl"
                        } text-3xl image-background-cover transform font-semibold whitespace-nowrap `}
                      >
                        {product.name}
                      </span>
                    </div>
                  )}
                </div>
              )}
              <div className="flex gap-2 absolute bottom-5 right-[20px] ">
                {product.isOwner && (
                  <DropdownMenu
                    items={[
                      {
                        label: "Settings",
                        onClick: () => {
                          router.push({
                            pathname: router.pathname,
                            query: router.query,
                            hash: "settings"
                          })
                        }
                      },

                      {
                        label: "Delete Product",
                        onClick: () => {
                          setDeleteModal(true)
                        }
                      }
                    ]}
                  >
                    <Button
                      variant="outlined"
                      className="gap-x-2 px-2 text-white"
                      title=""
                      type="button"
                      endIcon={<Icons.More className="text-white" />}
                    />
                  </DropdownMenu>
                )}
              </div>
              <div
                className="cursor-pointer absolute -bottom-14 left-[20px] sm:left-12 bg-white p-1 rounded-sm"
                onClick={() => {
                  if (product.isOwner) {
                    setActiveModal("logo")
                  }
                }}
              >
                <div className="w-[110px] h-[110px]">
                  {(activeModal === "logo" && imageFile) ||
                  (!isCreateProduct && image) ? (
                    <Image
                      src={
                        activeModal === "logo" && imageFile
                          ? URL.createObjectURL(imageFile as File)
                          : getBaseBackendImageUrl() + image
                      }
                      alt="No Product Image"
                      width={110}
                      height={110}
                      className="rounded-sm"
                    />
                  ) : (
                    <div
                      className={`font-medium flex items-center justify-center h-full`}
                    >
                      {isCreateProduct ? (
                        <ImagePicker
                          onFileSelected={handleCreateProductImage}
                          imageContainerClassName="h-full w-full"
                          className="h-full"
                          value={createProductImage}
                        />
                      ) : (
                        <div className="bg-secondary-gradient w-full h-full grid place-items-center text-8xl text-white">
                          {product.name[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
          <div className="grid grid-cols-8 min-[900px]:grid-cols-12 gap-x-5 lg:gap-x-14 mt-2">
            <div
              className={twMerge(
                "col-span-8 pb-11 rounded-lg bg-white mt-6 min-[900px]:col-span-4 flex flex-col h-fit ",
                isCreateProduct ? "px-2" : "px-5"
              )}
            >
              <div className="pt-10 ">
                <div className="flex flex-col gap-3 pb-4 sm:pb-0 justify-between items-start flex-wrap">
                  <div
                    ref={productTitleDivRef}
                    className={twMerge(
                      "flex gap-2 items-center justify-between w-full",
                      productTitleDivWidth < 275 && "flex-col items-start"
                    )}
                  >
                    <Text className="text-2xl font-semibold leading-[30px] text-neutral-900">
                      {title || "Product Name"}
                    </Text>
                    {!(isCreateProduct || !authorization) ? (
                      <div className="flex gap-2">
                        <div className="group relative">
                          <a
                            href={addHttps(url)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <div
                              className={twMerge(
                                "h-8 w-8 grid place-items-center border border-[rgba(141,140,140,0.4)] rounded-lg cursor-pointer transition-colors duration-500"
                              )}
                            >
                              <Icons.VisitIcon className="text-neutral-700" />
                            </div>
                            <TooltipSpan className="-left-2/3">
                              Visit Website
                            </TooltipSpan>
                          </a>
                        </div>
                        {product?.twitterProfile && (
                          <div className="group relative">
                            <a
                              href={addHttps(product?.twitterProfile ?? "")}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <div
                                className={twMerge(
                                  "h-8 w-8 grid place-items-center border border-[rgba(141,140,140,0.4)] rounded-lg cursor-pointer transition-colors duration-500"
                                )}
                              >
                                <Icons.OutlineTwitterIcon className="text-neutral-700 scale-75" />
                              </div>
                              <TooltipSpan className="-left-2/3">
                                Visit Twitter
                              </TooltipSpan>
                            </a>
                          </div>
                        )}

                        <div className="group relative">
                          <div
                            className={twMerge(
                              "h-8 w-8 grid place-items-center border border-[rgba(141,140,140,0.4)] rounded-lg cursor-pointer transition-colors duration-500",
                              product.isSubscribed &&
                                "bg-primary-50 border-2 border-primary-500",
                              // "hover:border-primary",
                              subscribeLoading
                                ? "pointer-events-none cursor-not-allowed"
                                : ""
                            )}
                            onClick={onSubscribeProduct}
                          >
                            <Icons.SubscribeIcon
                              className={twMerge(
                                "text-neutral-700 transition-colors duration-500",
                                product.isSubscribed && "text-primary-700"
                              )}
                            />
                          </div>
                          <TooltipSpan
                            className={product.isSubscribed ? "-left-2/3" : ""}
                          >
                            {product.isSubscribed ? "Unsubscribe" : "Subscribe"}
                          </TooltipSpan>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div>
                  <Text className="text-sm font-normal leading-4 text-neutral-700">
                    {category || "Product Category"}
                  </Text>
                </div>

                {!!product.status &&
                  product.status === "draft" &&
                  (product.isOwner ? (
                    <UpdateButton
                      variant="outlined"
                      title="Complete Setup"
                      loading={createLoading || isPending}
                      onClick={completeProductSetup}
                    />
                  ) : (
                    <Button
                      variant="outlined"
                      title="Drafted"
                      titleClassName="font-[500]  !text-warning"
                      className="!cursor-default !outline-warning"
                    />
                  ))}

                {!isCreateProduct && (
                  <div className="flex items-center gap-2 text-xs leading-[14px] text-neutral-700 mt-2">
                    {/* <div className="">
                    <span className="font-semibold">TODO</span> Followers
                  </div> */}
                    <div>
                      <span className="font-semibold">
                        {product.subscribersCount || 0}
                      </span>
                      {" Subscribers"}
                    </div>
                  </div>
                )}
              </div>
              <ProductScore />
              <ProductDescription {...props} />
            </div>
            <div className="col-span-8 mt-10 md:mt-[39px]">
              {!showSetting && !isTrcmCheckLoading && (
                <TabView
                  tabs={[
                    {
                      title: "Reviews",
                      componet: (
                        <Review
                          isProductCreate={isCreateProduct}
                          ratingData={ratingData}
                          product={product}
                          showReviewForm={!showBannerCondition}
                        />
                      )
                    },
                    {
                      title: "Highlights & Tweets",
                      componet: (
                        <div className="mt-6">
                          <Highlights isProductCreate={isCreateProduct} />
                          {/* <Announcements /> */}
                          {(product.twitterProfile || isCreateProduct) && (
                            <>
                              <div className="bg-separator h-[1px] mt-8 mb-8" />
                              <span className="block text-neutral-900 text-base font-semibold leading-6 mb-4">
                                Tweets
                              </span>
                              {!isCreateProduct && (
                                <TwitterContainer
                                  twitterUrl={product.twitterProfile || ""}
                                />
                              )}
                              {isCreateProduct && (
                                <EmptyState title="No Tweets" message="" />
                              )}
                            </>
                          )}
                        </div>
                      )
                    },
                    // {
                    //   title: "Gallery",
                    //   componet: (
                    //     <EmptyState message="There is no feeds for you. Post or review products to become an active checker." />
                    //   )
                    // },
                    {
                      title: "Offers & Airdrops",
                      componet: <Airdrop />
                    }
                  ]}
                  defaultActiveTab={defaultActiveTab}
                  scrollBar={false}
                />
              )}
              {showSetting && (
                <ProductSetting
                  closeSetting={() => {
                    router.push({
                      pathname: router.pathname,
                      query: router.query,
                      hash: ""
                    })
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        display={!!activeModal && !isCreateProduct}
        onHide={() => {
          setActiveModal(null)
          setImageFile(undefined)
        }}
        closeButton
      >
        <UploadImage
          title={
            activeModal === "coverImage"
              ? "Upload Cover Image"
              : activeModal === "logo"
              ? "Upload Product Logo"
              : ""
          }
          onUpload={() => {
            if (imageFile) {
              uploadProductImage(
                product._id,
                imageFile,
                activeModal || "logo"
              ).finally(() => {
                setActiveModal(null)
                setImageFile(undefined)
              })
            }
          }}
          onRemove={() => {
            if (product._id) {
              removeProductImage(product._id, activeModal || "logo").finally(
                () => {
                  setActiveModal(null)
                  setImageFile(undefined)
                }
              )
            }
          }}
          setImageFile={setImageFile}
          loading={loading}
          image={
            product[activeModal === "coverImage" ? "coverImage" : "logo"]
              ? getBaseBackendImageUrl() +
                product[activeModal === "coverImage" ? "coverImage" : "logo"]
              : ""
          }
        />
      </Modal>
      <Modal
        display={deleteModal}
        closeButton={loading || productDeleted}
        dismissable
        onHide={() => {
          setDeleteModal(false)
        }}
      >
        <div className="flex flex-col gap-4">
          {loading && (
            <div className="flex flex-col items-center">
              <Icons.LoadingIcon className="text-black w-24 h-24" />
              <span className="text-md text-neutral-700">
                Deleting your product
              </span>
            </div>
          )}
          {productDeleted && (
            <div className="flex flex-col items-center">
              <Icons.CheckTickIcon className="text-success" />
              <span className="text-xs text-neutral-700">
                Product Deleted Successfully
              </span>
            </div>
          )}
          {!loading && !productDeleted && (
            <>
              <div className="text-md font-semibold">
                Are you sure to delete product ?
              </div>

              <span className="text-xs text-neutral-700">
                <span className="text-primary">Note: </span>
                Your staking fund will not be refunded if staked during creation
              </span>

              <div className="flex gap-2 justify-end items-center">
                <Button
                  variant="default"
                  title="Confirm"
                  onClick={() => {
                    deleteProduct(product._id).then(() => {
                      setProductDeleted(true)
                      setTimeout(() => {
                        router.replace("/")
                      }, 800)
                    })
                  }}
                />
                <Button
                  variant="outlined"
                  title="Cancel"
                  onClick={() => {
                    setDeleteModal(false)
                  }}
                />
              </div>
            </>
          )}
        </div>
      </Modal>
      <Modal
        display={completeSetupModal}
        closeButton
        dismissable
        onHide={() => {
          setCompleteSetupModal(false)
        }}
      >
        <div className="flex flex-col gap-4">
          {!loading && <Icons.LoadingIcon />}
          {loading && (
            <span className="text-xs text-neutral-700">
              Deleting your product
            </span>
          )}
          {productDeleted && (
            <span className="text-xs text-neutral-700">
              Product Deleted Successfully
            </span>
          )}
          {!loading && !productDeleted && (
            <>
              <div className="text-md font-semibold">
                Are you sure to delete product ?
              </div>
              {product.status && product.status === "draft" && (
                <span className="text-xs text-neutral-700">
                  <span className="text-primary">Note: </span>
                  Your staking fund will not be refunded if staked during
                  creation
                </span>
              )}
            </>
          )}
          <div className="flex gap-2 justify-end items-center">
            {!loading && !productDeleted && (
              <Button
                variant="default"
                title="Confirm"
                onClick={() => {
                  deleteProduct(product._id).then(() => {
                    router.replace("/")
                  })
                }}
              />
            )}
            <Button
              variant="outlined"
              title="Cancel"
              onClick={() => {
                setDeleteModal(false)
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
