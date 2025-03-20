import { useState, useEffect, useMemo } from "react"
import ImageMapper from "./ImageMapper"
import LandingCarouselContent from "./LandingCarouselContent"
import { getBaseBackendImageUrl } from "utils/getBasePath"
import { Product, useProductStore } from "stores/product"
import { getMultipleUniqueRandomItemsFromArray } from "utils/helper"

const generateSlideImages = (randomProductsArray: Product[]): string[] => {
  let images: string[] = []
  randomProductsArray.forEach(
    (item) =>
      (images = [...images, getBaseBackendImageUrl() + item.coverImage!])
  )
  return images
}

const LandingCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(1)

  const {
    products: { products = [] }
  } = useProductStore()

  const randomProducts = useMemo(() => {
    const cleanedProducts = products?.filter((item) => !!item.coverImage)
    const randomUniqueItems = getMultipleUniqueRandomItemsFromArray(
      cleanedProducts as Product[],
      3
    )
    return randomUniqueItems
  }, [products])

  const slideImages = useMemo(
    () => generateSlideImages(randomProducts),
    [randomProducts]
  )

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let interval: any
    if (randomProducts.length === 1) {
      setCurrentSlide(0)
    } else if (randomProducts.length && !interval) {
      interval = setInterval(() => {
        setCurrentSlide(
          (currentSlide) => (currentSlide + 1) % slideImages?.length ?? 0
        )
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [randomProducts])

  const goToPreviousSlide = () => {
    setCurrentSlide(
      (currentSlide) =>
        (currentSlide + slideImages?.length ?? 0 - 1) % slideImages?.length ?? 0
    )
  }

  const goToNextSlide = () => {
    setCurrentSlide(
      (currentSlide) => (currentSlide + 1) % slideImages?.length ?? 0
    )
  }

  if (products?.length < 1) return null

  return (
    <div className="relative h-[60vh]">
      <div className="farBgOverlay absolute h-full w-full left-0 right-0 top-0 bottom-0 z-[999999] bg-gradient-to-b from-[rgba(0,0,0,1)]  to-[rgba(0,0,0,0.7),rgba(255,255,255,0.9)] pointer-events-none" />
      <ImageMapper
        keyTitle="farBackground"
        slideImages={slideImages}
        currentSlide={currentSlide}
      />

      <LandingCarouselContent
        currentSlide={currentSlide}
        slideImages={slideImages}
        onNextClick={goToNextSlide}
        onPreviousClick={goToPreviousSlide}
        products={randomProducts}
      />
    </div>
  )
}

export default LandingCarousel
