import { useEffect, useState } from "react"
import { api } from "stores"
import { initialRatingData } from "modules/product/components/ratingOverview/index.d"
import { backendUrls } from "constants/backendUrls"
import { Product as IProduct } from "stores/product"

export const useProductRatingData = (product: IProduct) => {
  const [ratingData, setRatingData] = useState(initialRatingData)

  const { _id: productID } = product

  const getData = async () => {
    try {
      const { data: response } = await api.get(
        backendUrls.getProductReviewRating(productID)
      )
      setRatingData(response)
    } catch (err) {
      setRatingData(initialRatingData)
    }
  }

  useEffect(() => {
    if (
      productID
      // ["published", "reviewed", "rewarded"].includes(product.status ?? "") &&
      // ratingData.status === "init"
    ) {
      getData()
    }
  }, [productID])

  return { ratingData }
}
