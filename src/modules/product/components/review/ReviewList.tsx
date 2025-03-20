import { Button, EmptyState } from "components"
import { useEffect } from "react"
import { useUserStore } from "stores"
import { useProductStore } from "stores/product"
import { useReviewStore } from "stores/review"
import { ReviewCard } from "./ReviewCard"
import { useRouter } from "next/router"

export const ReviewList = () => {
  // const [sortBy, setSortBy] = useState("Date")
  const { getReviews, reviews } = useReviewStore()
  const { product } = useProductStore()
  const { user } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (product._id && router.query.slug === product.slug) {
      // check here
      getReviews(product?._id, user._id)
    }
  }, [product, getReviews, user._id, router])

  if (reviews?.reviews?.[0]?.product._id !== product._id)
    return <EmptyState className="p-10" message="There are no reviews." />

  return (
    <div className="">
      <div className="mt-4 sm:mt-8 flex flex-col gap-3">
        {reviews.reviews.length === 0 && (
          <EmptyState className="p-10" message="There are no reviews." />
        )}

        {reviews.reviews.map((item) => (
          <ReviewCard key={item._id} review={item} />
        ))}
      </div>
      {reviews.total !== reviews.reviews.length && (
        <div className="w-full grid place-content-center mt-2 ">
          <Button
            title="Load More"
            variant="outlined"
            className="w-[310px] mt-3 mb-5"
            onClick={() =>
              getReviews(product?._id, user._id, reviews.page + 1, true)
            }
          />
        </div>
      )}
    </div>
  )
}
