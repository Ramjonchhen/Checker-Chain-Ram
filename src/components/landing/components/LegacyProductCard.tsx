/* eslint-disable @next/next/no-img-element */
import { Card } from "components/card"
import { FC } from "react"
import { getBaseBackendImageUrl } from "utils"
import { Product, useProductStore } from "stores/product"
import { useRouter } from "next/router"
import * as Icons from "assets/icons"
import dayjs from "lib/dateLib"
import toast from "react-hot-toast"

interface LegacyProductCardProps {
  product: Product
  index?: number
}

export const LegacyProductCard: FC<LegacyProductCardProps> = ({
  product,
  index = 0
}) => {
  const router = useRouter()
  const { subscribeProduct } = useProductStore()

  return (
    <Card
      className="animate w-full cursor-default shadow-default sm:w-[200px] p-0 rounded-t-lg overflow-hidden transform hover:shadow-2xl transition-all duration-300"
      data-animate="animate__animated animate__fadeInUp"
      style={{
        animationDelay: `${(index + 1) * 300}ms`,
        transitionDelay: `all ${(index + 1) * 300}ms`
      }}
    >
      {product.logo ? (
        <img
          loading="lazy"
          src={getBaseBackendImageUrl(product.logo)}
          alt="Product Example"
          className="w-full h-[240px] sm:h-[133px] object-cover"
        />
      ) : (
        <div
          className={`font-[500] select-none ${"bg-secondary-gradient"} w-full h-[240px] sm:h-[133px] flex items-center justify-center text-8xl text-white`}
        >
          {product.name[0]?.toUpperCase()}
        </div>
      )}
      <div className="flex flex-col p-4 border-b border-separate">
        <div className="flex justify-between">
          <div className="flex flex-col gap-0 text-neutral-900">
            <span
              className={`text-base font-semibold leading-[30px] cursor-pointer`}
              onClick={() => router.push(`/product/${product.slug}`)}
            >
              {product.name}
            </span>
            <span className="text-xs">{product?.category?.name}</span>
          </div>

          <div
            className={`${
              product.isSubscribed && "text-primary"
            } text-xs h-6 gap-x-2 flex items-center justify-center rounded-md whitespace-nowrap  text-content-secondary hover:text-primary cursor-pointer ${
              product.status && product.status === "draft"
                ? "text-warning outline-warning"
                : ""
            } `}
          >
            {product.status && product.status === "draft" ? (
              "Draft"
            ) : (
              <Icons.OutlinedStar
                onClick={() => {
                  subscribeProduct(product._id)
                  if (product.isSubscribed) {
                    toast.error(`Product ${product.name} unsubscribed.`)
                  } else {
                    toast.success(`Product ${product.name} subscribed.`)
                  }
                }}
              />
            )}
          </div>
        </div>
        <span className="text-sm text-neutral-700 mt-2">
          {product.description.slice(0, 40)}...
        </span>
        {/* <div className="flex gap-1 items-center mt-2">
          <Icons.TimestampIcon />
          <span className="text-[11px] text-neutral-700">
            {dayjs(product.createdAt).fromNow()}
          </span>
        </div> */}
      </div>
      <div className="flex justify-between px-4 py-2 gap-x-6 font-normal text-xs">
        <span
          className={`flex items-center justify-center gap-2 text-primary-900`}
        >
          {/* <Icons.UpvoteIcon /> */}
          <Icons.ReviewStarIcon className="w-6 h-6" />
          {product.reviewCount}
        </span>
        <div className="flex gap-1 items-center">
          <Icons.TimestampIcon className="w-3 h-3" />
          <span className="text-[11px]">
            {dayjs(product.createdAt).fromNow()}
          </span>
        </div>
        {/* <span className="flex items-center gap-2 hover:text-primary cursor-pointer">
          <Icons.CommentIcon />
          15.6k
        </span> */}
        {/* {review.createdBy._id === user._id && (
          <div className="ml-auto">
            <Icons.DropdownMenu
              className="-mt-2"
              items={[
                {
                  label: "Delete",
                  onClick: async () => {
                    const res = await deleteReview(review._id)
                    if (res) {
                      successToast({
                        message: "Review deleted successfully"
                      })
                      getReviews("", user._id)
                    } else {
                      errorToast({
                        message: "Failed to delete review"
                      })
                    }
                  }
                }
              ]}
            >
              <More className="cursor-pointer" />
            </Icons.DropdownMenu>
          </div>
        )} */}
      </div>
    </Card>
  )
}
