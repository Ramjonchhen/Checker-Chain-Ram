import Head from "next/head"
import { useProductStore } from "stores/product"
import generateSeoJsonLdData from "components/seoJsonLd/generateSeoJsonLdData"
import { IRatingOverview } from "modules/product/components/ratingOverview"
import { Review, useReviewStore } from "stores/review"

type Props = {
  ratingData: IRatingOverview
}

function SeoJsonLDProduct({ ratingData }: Props) {
  const { product } = useProductStore((state) => state)
  const { reviews } = useReviewStore()

  let correctReviews: Review[] = []
  if (reviews?.reviews?.[0]?.product._id === product._id) {
    correctReviews = reviews.reviews
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateSeoJsonLdData({
          product,
          ratingData,
          reviews: correctReviews
        })}
        key="product-jsonld"
      />
    </Head>
  )
}

export default SeoJsonLDProduct
