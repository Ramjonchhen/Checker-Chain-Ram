/* eslint-disable @next/next/no-img-element */
import { FC } from "react"
import { AboutProductProps } from "./index.d"
import { useProductStore } from "stores/product"
import dayjs from "lib/dateLib"
export const AboutProduct: FC<AboutProductProps> = ({
  description,
  isCreateProduct = false
}) => {
  const { product } = useProductStore()
  return (
    <div>
      <div className="text-neutral-900 text-base font-semibold leading-6">
        About the Product
      </div>
      <div className="flex flex-col gap-2 mt-2 text-neutral-700 text-sm leading-[18px] font-normal">
        <p className="whitespace-pre-wrap">{description || "Description"}</p>
        {!isCreateProduct && (
          <>
            <div className="mt-2">
              <span className="w-40 inline-block">Location</span>:
              <span className="ml-4">{product?.location ?? ""}</span>
            </div>
            <div>
              <span className="w-40 inline-block">Published Date</span>:
              <span className="ml-4">
                {dayjs(product?.createdAt).format("YYYY-MM-DD")}
              </span>
            </div>
            <div>
              <span className="w-40 inline-block">Last Review Cycle Date</span>:
              <span className="ml-4">
                {dayjs(product.reviewDeadline).format("YYYY-MM-DD")}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
