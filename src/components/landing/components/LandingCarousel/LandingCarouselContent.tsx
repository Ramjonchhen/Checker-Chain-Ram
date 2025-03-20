import { ReferralsIcon, SubscribeIcon } from "assets/icons"
import ImageMapper from "./ImageMapper"
import { Button } from "components/button"
import { Product } from "stores/product"
import { getBaseBackendImageUrl } from "utils"
import { useRouter } from "next/router"

type CommonProps = {
  currentSlide: number
  products: Product[]
}

type Props = CommonProps & {
  onNextClick: () => void
  onPreviousClick: () => void
  slideImages: string[]
}

const LeftSection = ({ currentSlide, products }: CommonProps) => {
  return (
    <div>
      <div className="h-20 w-20 border-2 border-white rounded-lg overflow-hidden">
        <img
          src={getBaseBackendImageUrl() + products?.[currentSlide]?.logo ?? ""}
          alt=""
          className="h-full w-full"
        />
      </div>
      <div className="mt-3 text-xl md:text-[32px] font-bold leading-6 md:leading-[42px] text-white">
        {products?.[currentSlide]?.name ?? ""}
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex gap-[7px] items-center">
          <ReferralsIcon className="scale-75 text-white" />
          <div className="text-xs leading-[14px] text-white font-semibold tracking-[0.22px]">
            {products?.[currentSlide]?.reviewCount ?? 0} reviewers
          </div>
        </div>
        <div className="flex gap-[7px] items-center">
          <SubscribeIcon className="text-white" />
          <div className="text-xs leading-[14px] text-white font-semibold tracking-[0.22px]">
            {products?.[currentSlide]?.subscribersCount ?? 0} subscribers
          </div>
        </div>
      </div>
    </div>
  )
}

const RightSection = ({ products, currentSlide }: CommonProps) => {
  const router = useRouter()
  return (
    <div>
      <div className="bg-primary-700 py-[2px] px-2 text-white text-[10px] md:text-xs font-semibold uppercase w-fit">
        {products?.[currentSlide]?.subcategories[0]}
      </div>
      <div className="text-white font-georgia text-l md:text-5xl font-bold mt-2 line-clamp-2 md:line-clamp-3 pb-[3px]">
        {products?.[currentSlide]?.description ?? ""}
      </div>
      <Button
        title="Review Now"
        variant="outlined"
        className="text-white w-fit mt-3 md:mt-14 hover:bg-primary-700 hover:text-white"
        onClick={() => router.push(`product/${products?.[currentSlide]?.slug}`)}
      />
    </div>
  )
}

const LandingCarouselContent = ({
  currentSlide,
  slideImages,
  onNextClick,
  onPreviousClick,
  products
}: Props) => {
  return (
    <div className="h-[80%] max-h-[400px] absolute w-[85%] max-w-[1300px]  z-[9999999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl ">
      <div className="relative h-full w-full rounded-xl overflow-hidden">
        <div className="mainOverLay absolute z-[10] h-full w-full  bg-gradient-to-b from-[rgba(30,30,32,0.5)] to-[rgba(30,30,32,0.5)] pointer-events-none" />
        <div className="rightOverLay absolute right-0 h-full w-[100%] md:w-[60%] z-[20] bg-gradient-to-t md:bg-gradient-to-l from-[rgba(30,30,32,1)] to-[rgba(30,30,32,0.8),rgba(30,30,32,0.8),rgba(30,30,32,0.00)]" />
        <ImageMapper
          keyTitle="nearBackground"
          slideImages={slideImages}
          currentSlide={currentSlide}
        />
        <div className="absolute flex flex-col md:flex-row z-[999999] px-5 py-3 md:px-10 md:py-6 h-full w-full justify-between md:items-end ">
          <div className="leftSectionss flex text-primary-500">
            <LeftSection currentSlide={currentSlide} products={products} />
          </div>
          <div className="rightSections flex flex-col md:w-[35%] mt-4 md:mt-0 text-white ">
            <RightSection products={products} currentSlide={currentSlide} />
          </div>
        </div>
      </div>
      {slideImages.length > 1 ? (
        <>
          <div className="absolute z-[99999999] top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Button
              title="<"
              className="text-black bg-white rounded-[50%] p-3 "
              titleClassName="text-2xl font-light"
              onClick={onPreviousClick}
            />
          </div>
          <div className="absolute z-[99999999] right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
            <Button
              title=">"
              className="text-black bg-white rounded-[50%] p-3 "
              titleClassName="text-2xl font-light"
              onClick={onNextClick}
            />
          </div>
        </>
      ) : null}
    </div>
  )
}

export default LandingCarouselContent
