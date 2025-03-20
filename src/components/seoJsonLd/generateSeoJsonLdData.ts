import {
  ICategoryRating,
  IRatingOverview
} from "modules/product/components/ratingOverview"
import { Product } from "stores/product"
import { Review } from "stores/review"
import { getBaseBackendImageUrl } from "utils"
import {
  cutAfterInputDecimalPlaces,
  calculateRatingAvg,
  caluclateTotalCountSum,
  getCategoryRatingArray,
  findHighestRatingObject
} from "utils/helper"
import dayjs from "lib/dateLib"

type MainProps = {
  product: Product
  ratingData: IRatingOverview
  reviews: Review[]
}

type ICryptoJsonLd = Omit<MainProps, "ratingData"> & {
  ratingAvg: number
  totalRatings: number
  highestCategoryRating: ICategoryRating
}

const CryptoJsonLd = ({
  product,
  ratingAvg,
  totalRatings,
  reviews,
  highestCategoryRating
}: ICryptoJsonLd) => {
  return JSON.stringify({
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": `${product.name} Reviews & Ratings | CheckerChain - Crypto Reviews`,
    "description": product.description,
    "image": [
      getBaseBackendImageUrl() + product.coverImage,
      getBaseBackendImageUrl() + product.logo
    ],
    "review": [
      reviews?.map(
        (review) => ({
          "@type": "Review",
          "name": review?.title,
          "datePublished": dayjs(review?.createdAt)?.format("YYYY-MM-DD"),
          "reviewBody": review?.review,
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": review?.rating,
            "bestRating": highestCategoryRating?._id
          },
          "author": {
            "@type": "Person",
            "name": review?.createdBy?.name
          }
        })
      )
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingAvg,
      "reviewCount": totalRatings
    }

  })

}

function generateSeoJsonLdData({ product, ratingData, reviews }: MainProps) {
  const ratingAvg = cutAfterInputDecimalPlaces(
    calculateRatingAvg(ratingData.categoryRating),
    1
  )

  const totalRatings = caluclateTotalCountSum(ratingData.categoryRating)
  const highestCategoryRating = findHighestRatingObject(
    getCategoryRatingArray(ratingData.categoryRating)
  )

  switch (product?.category?.name) {
    // Returning the same CryptoJSonLD as default
    // since our current product model is similar for all types of products
    // if we later differentiate in-depth the product model.
    // Eg 1:) movies(total length, actors, awards,etc)
    // Eg 2:) books(number of pages, edition,etc)
    // then create seperate schema for such and create a new case
    case "Crypto & Blockchain": {
      return {
        __html: CryptoJsonLd({
          product,
          ratingAvg,
          totalRatings,
          reviews,
          highestCategoryRating
        })
      }
    }
    default:
      return {
        __html: CryptoJsonLd({
          product,
          ratingAvg,
          totalRatings,
          reviews,
          highestCategoryRating
        })
      }
  }
}
export default generateSeoJsonLdData
