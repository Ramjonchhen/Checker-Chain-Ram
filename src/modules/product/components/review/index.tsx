import { FC } from "react"
import { EmptyState } from "components"
import { IRatingOverview } from "modules/product/components/ratingOverview"
import RatingOverview from "modules/product/components/ratingOverview/RatingOverview"
import CreateReviewCard from "modules/product/components/review/createReviewCard/CreateReviewCard"
import { ReviewList } from "modules/product/components/review/ReviewList"
import { useUserStore } from "stores/user"
import { Product as IProduct } from "stores/product"

interface ReviewProps {
  isProductCreate?: boolean
  ratingData: IRatingOverview
  product: IProduct
  showReviewForm?: boolean
}

export const Review: FC<ReviewProps> = ({
  isProductCreate = false,
  ratingData,
  product,
  showReviewForm = true
}) => {
  const { authorization } = useUserStore()

  return (
    <div className="w-full pt-6 px-4 md:px-0 mx-auto md:mx-0">
      {isProductCreate ? (
        <EmptyState title="No Reviews" message="" />
      ) : (
        <>
          {/* {authorization && <ReviewForm className="" />} */}
          <RatingOverview
            ratingData={ratingData}
            ratingScore={product?.ratingScore ?? 0}
          />
          {showReviewForm && !!authorization &&
            [
              "published",
              "reviewed",
              "rewarded",
              "notReviewed",
              "removed"
            ].includes(product.status ?? "") && (
              <CreateReviewCard
                productId={product._id}
                productSlug={product.slug}
              />
            )}
          <ReviewList />
        </>
      )}
    </div>
  )
}
