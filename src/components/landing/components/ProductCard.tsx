import React from "react"
import { Card } from "components/card"
import { Product, useProductStore } from "stores/product"
import { Button } from "components/button"
import {
  BasicBookmarkIcon,
  FeatherIcon,
  RatingScoreIcon,
  ReferralsIcon
  // TrustScoreIcon
} from "assets/icons"
import dayjs from "lib/dateLib"
import toast from "react-hot-toast"
import { twMerge } from "tailwind-merge"
import { useRouter } from "next/router"
import { getBaseBackendImageUrl } from "utils"
import { useGetLoginInfo } from "lib/dApp-core"
import { getProductRatingScoreColor } from "utils/styleHelpers"
import { abbreviateNumber } from "utils/getLiquidityInfo"
import { cutAfterInputDecimalPlaces } from "utils/helper"

type Props = {
  product?: Product
  hideSubscribeBtn?: boolean
}

const SubCategoryTag = ({ tag }: { tag: string }) => {
  if (!tag) return null
  return (
    <div
      // <div className="flex items-center" title={tag}>
      className="px-[6px] py-[2px] border border-neutral-400 rounded-sm max-w-[100px] grid place-items-center  bg-neutral-900"
      title={tag}
    >
      <div className="truncate w-full text-[10px] leading-3 tracking-[0.02em] capitalize text-neutral-50  font-medium">
        {tag}
      </div>
      {/* <div className="h-0 w-0 border-t-[7.5px] border-l-[12px] border-b-[7.5px] border-solid border-t-transparent border-b-transparent border-l-neutral-900" /> */}
      {/* // </div> */}
    </div>
  )
}

const CategoryTagSection = ({
  category = "",
  subCategories = []
}: {
  category?: string
  subCategories: string[]
}) => {
  return (
    // <div className="flex gap-[6px]">
    <div className="flex">
      <div className="flex items-center" title={category}>
        {/* <div className="text-[10px] flex items-center leading-[15px] tracking-[0.02em] uppercase text-neutral-50 bg-neutral-900 pl-2 ">
          {category}
        </div> */}
        {/* <div className="h-0 w-0 border-t-[7.5px] border-l-[12px] border-b-[7.5px] border-solid border-t-transparent border-b-transparent border-l-neutral-900" /> */}
      </div>
      <div className="flex gap-[6px]">
        <SubCategoryTag tag={subCategories?.[0] ?? ""} />
        <SubCategoryTag tag={subCategories?.[1] ?? ""} />
        {/* <SubCategoryTag tag={subCategories?.[2] ?? ""} /> */}
      </div>
    </div>
  )
}

const ProductCard = ({ product, hideSubscribeBtn = false }: Props) => {
  const router = useRouter()
  const { isLoggedIn } = useGetLoginInfo()
  const trustScoreColor = getProductRatingScoreColor(product?.ratingScore ?? 0)

  const { subscribeProduct } = useProductStore()

  const navigateToDetailsPage = () => {
    if (product?.slug) router.push(`/product/${product?.slug}`)
  }

  const subscribeProductHandler = () => {
    if (product?._id) subscribeProduct(product?._id)

    if (product?.isSubscribed) {
      toast.error(`Product ${product?.name} unsubscribed.`)
    } else {
      toast.success(`Product ${product?.name} subscribed.`)
    }
  }
  const showRatingScoreCondition =
    product?.ratingScore &&
    (product?.status === "reviewed" || product?.status === "rewarded")

  const showRatingScore = () => {
    if (
      product?.ratingScore &&
      (product?.status === "reviewed" || product?.status === "rewarded")
    ) {
      if (product.reward !== 0) {
        return `${abbreviateNumber(product?.reward ?? 0)} CHECKR`
      } else {
        return "No rewards available"
      }
    } else if (product?.status === "notReviewed") {
      return "Not Qualified for Reward"
    } else if (product?.status === "published") {
      return "Under Review"
    } else if (product?.status === "draft") {
      return "Draft"
    } else {
      return "No rewards available"
    }
  }

  return (
    <Card className="p-0 h-full w-full md:h-[364px] md:w-[280px] rounded-xl  group/main  overflow-hidden">
      <div className="flex flex-col justify-between h-full ">
        <div>
          <div className="TOPSECTION relative h-[160px] w-full overflow-hidden">
            <div
              className="absolute z-20 top-0 bottom-0 left-0 right-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.1),rgba(0,0,0,0.1))] cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                navigateToDetailsPage()
              }}
            />
            {product?.coverImage ? (
              <img
                src={getBaseBackendImageUrl(product?.coverImage)}
                loading="lazy"
                alt=""
                className="h-full w-full scale-100 group-hover/main:scale-150 transition-transform duration-300 z-10 object-cover"
              />
            ) : (
              <div
                className={`font-[500] select-none ${"bg-secondary-gradient"} w-full h-full flex items-center justify-center text-8xl text-white `}
              >
                {product?.name[0]?.toUpperCase()}
              </div>
            )}

            {isLoggedIn && !hideSubscribeBtn && (
              <div
                className={twMerge(
                  "absolute z-30 top-2 right-2 h-7 w-7 rounded-full border cursor-pointer  transition-colors duration-300",
                  "hidden group-hover/main:grid group-hover/main:place-items-center",
                  product?.isSubscribed
                    ? "border-white bg-primary-500"
                    : "border-primary-500 bg-white"
                )}
                title={product?.isSubscribed ? "Unsubscribe" : "Subscribe"}
                onClick={subscribeProductHandler}
              >
                <BasicBookmarkIcon
                  className={twMerge(
                    "transition-colors duration-300",
                    product?.isSubscribed ? "text-white" : "text-primary-500"
                  )}
                />
              </div>
            )}

            {/* <div className="absolute z-30 bottom-[7px] left-0 pl-3 pr-2  bg-neutral-700 border border-[#E9E9EB] rounded-e-lg grid place-items-center">
              <span className="text-xs leading-5 font-medium text-white text-center">
                Sponsored
              </span>
            </div> */}
            {showRatingScoreCondition && (
              <div className="absolute z-30 bottom-[10px] right-0 bg-white  border border-neutral-100 rounded-s-[22.5px] pl-[10px] pr-3 py-2 grid place-items-center">
                <div className="relative group">
                  <div className="flex gap-[5px] items-center select-none ">
                    <div title="Rating Score">
                      <RatingScoreIcon />
                    </div>
                    <div
                      className={`font-semibold text-lg leading-[27px] tracking-[-0.03em] cursor-default`}
                      style={{ color: trustScoreColor }}
                      title="Trust Score"
                    >
                      {cutAfterInputDecimalPlaces(product?.ratingScore ?? 0, 2)}{" "}
                      <small className="text-[10px]">/5</small>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div
            className="BODYSECTION px-3 pt-4 pb-2 cursor-pointer"
            onClick={navigateToDetailsPage}
          >
            <div className="flex justify-between items-center">
              <div
                className="text-base leading-6 font-semibold text-neutral-900 line-clamp-1 w-full md:max-w-[170px]"
                title={product?.name ?? ""}
              >
                {product?.name ?? ""}
              </div>
              <div
                className={twMerge(
                  "text-[10px] leading-[15px] font-medium text-right flex-grow",
                  product?.reward ? "text-neutral-700" : "text-primary-700"
                )}
                title="Rewards"
              >
                {showRatingScore()}
              </div>
            </div>
            <div>
              <CategoryTagSection
                category={product?.category?.name ?? ""}
                subCategories={product?.subcategories ?? []}
              />
              <div className="text-sm font-georgia font-normal tracking-[0.01em] leading-[22px] text-neutral-700 mt-3 line-clamp-2">
                {product?.description ?? ""}
              </div>
              <div className="mt-2 text-[10px] leading-[14px] font-medium tracking-[0.02em] text-neutral-600">
                - {dayjs(product?.createdAt).fromNow()}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 pl-3 pr-4 pb-4 md:pb-0">
          <div className="flex w-full justify-between items-center">
            <div>
              <Button
                title="Review Now"
                onClick={navigateToDetailsPage}
                className="bg-secondary-50 text-xs leading-[18px] font-medium text-neutral-700 group-hover/main:bg-primary group-hover/main:text-white "
                startIcon={
                  <FeatherIcon className="text-[#484848] group-hover/main:text-white transition-colors duration-300" />
                }
              />
            </div>
            <div className="flex gap-3">
              {/* <div
                className="flex gap-2 items-center hover:text-primary cursor-pointer"
                title="Upvote"
              >
                <UpvoteIcon />
                <div className="text-neutral-600 text-xs leading-[18px] tracking-[0.02em]">
                  12
                </div>
              </div> */}
              <div
                className="flex gap-2 items-center hover:text-primary "
                title={`${product?.reviewCount ?? 0} person reviewed ${
                  product?.name
                }`}
              >
                <ReferralsIcon className="scale-75" />
                <div className="text-neutral-600 text-xs leading-[18px] tracking-[0.02em] cursor-default">
                  {product?.reviewCount ?? 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ProductCard
