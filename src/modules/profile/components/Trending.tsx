/* eslint-disable @next/next/no-img-element */
import { Text } from "components"
import { ITrendingProducts } from "interfaces/trending"
import { useRouter } from "next/router"
import { FC } from "react"
import { twMerge } from "tailwind-merge"
import { getBaseBackendImageUrl } from "utils"

export const Trending: FC<{
  title: string
  className?: string
  trendingProductsData: ITrendingProducts[]
}> = ({ title, className = "", trendingProductsData = [] }) => {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const { trending, loading } = useProductStore()

  return (
    <div className={twMerge("px-4 gap-y-4 py-6 rounded-md", className)}>
      <span className="px-6 text-base leading-6 text-neutral-900 font-[500]">
        {title}
      </span>
      <div className="px-6">
        <div className="grid gap-y-4 mt-4">
          {trendingProductsData?.map((item) => (
            <div
              key={item.slug}
              className="flex gap-6 items-center cursor-pointer"
              onClick={() => {
                router.push(`/product/${item.slug}`)
              }}
            >
              {item.logo && (
                // eslint-disable-next-line jsx-a11y/alt-text
                <img
                  className={`w-10 h-10 object-contain rounded-[2px]`}
                  src={getBaseBackendImageUrl(item.logo, "other")}
                />
              )}
              {!item.logo && (
                <div
                  className={`rounded-[2px] font-[500] select-none ${"bg-secondary-gradient"} w-10 h-10 flex items-center justify-center text-3xl text-white`}
                >
                  {/* @ts-ignore */}
                  {item?.name[0]?.toUpperCase()}
                </div>
              )}
              <div className="flex-grow flex-wrap text-neutral-900">
                <div className="truncate ... w-full block text-md font-semibold">
                  {item?.name}
                </div>
                {/* @ts-ignore */}
                <div className="text-xs">{item?.subcategories[0] ?? ""}</div>
              </div>
            </div>
          ))}
          {/* {loading &&
            trending.length === 0 &&
            [1, 2, 3, 4, 5].slice(0, 5).map((item) => (
              <div
                key={`trending-${item}`}
                className="flex animate-pulse gap-6 items-center cursor-pointer"
              >
                <div className="bg-slate-200 h-10 w-10 rounded-[2px]"></div>
                <div className="flex-grow flex-wrap text-neutral-900 gap-4">
                  <div className="h-3 mb-4 bg-slate-200 rounded"></div>
                  <div className="text-xs">
                    <div className="h-2 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))} */}
        </div>
      </div>

      {!trendingProductsData.length && (
        <div className="w-full grid place-items-center h-[335px]">
          <Text className="px-6 text-xl" variant="body">
            No Trending found.
          </Text>
        </div>
      )}
    </div>
  )
}
