import React from "react"
import { useProductStore } from "stores/product"
import { abbreviateNumber } from "utils/getLiquidityInfo"
import { getOrdinalSuffix } from "utils/helper"

type IScoreItem = {
  title: string
  score: number | string | JSX.Element
  subText: string
}

const ScoreItem = ({ title, score, subText }: IScoreItem) => {
  return (
    <div className="flex flex-col items-center">
      <div className="py-[2px] px-2 bg-secondary-500 text-white rounded-[2px] text-[10px] leading-[14px] tracking-[0.2px] font-medium text-center">
        {title}
      </div>
      <div className="mt-1 text-2xl font-semibold tracking-[0.72px] leading-normal text-neutral-900">
        {score}
      </div>
      <div className="text-neutral-600 tracking-[0.09px] text-[10px] leading-[14px] text-center font-medium">
        {subText}
      </div>
    </div>
  )
}

const ProductScore = () => {
  const { product } = useProductStore()

  if (product?.status === "published") {
    return (
      <div className="text-[12px] leading-[15px] font-medium text-center flex-grow text-primary-700 bg-secondary-50 px-5  py-5 mt-4 rounded-sm w-[calc(100%+40px)] -ml-5">
        This product is currently being reviewed.
      </div>
    )
  }

  if (product?.status === "reviewed" || product?.status === "rewarded") {
    return (
      <div className="mt-4 bg-secondary-50 w-[calc(100%+40px)] -ml-5  px-5 py-2">
        <div className="flex items-center gap-3 justify-around">
          <ScoreItem
            title={"Trust Score"}
            score={product?.trustScore ?? 0}
            subText={"out of 100"}
          />
          <div className="self-stretch w-[1px] bg-[#E9E9EB]"></div>
          <ScoreItem
            title={"Current Cycle"}
            score={
              <div>
                {product?.currentReviewCycle}
                <sup>{getOrdinalSuffix(product?.currentReviewCycle ?? 0)}</sup>
              </div>
            }
            subText={"cycle since launch"}
          />
          <div className="self-stretch w-[1px] bg-[#E9E9EB]"></div>
          <ScoreItem
            title={"Rewards"}
            score={abbreviateNumber(product?.reward) ?? 0}
            subText={"CHECKR"}
          />
        </div>
      </div>
    )
  }
  return null
}

export default ProductScore
