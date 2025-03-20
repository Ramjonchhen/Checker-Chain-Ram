import React, { FC } from "react"
import { twMerge } from "tailwind-merge"

import { useProductStore } from "stores/product"
import { User, useUserStore } from "stores/user"
import { EmptyState, Input } from "components"
import { SearchIcon } from "assets/icons"
import ProductCard from "components/landing/components/ProductCard"

interface Props {
  user?: User
}

export const MySubscriptions: FC<Props> = ({ user }) => {
  const { mySubscription, getMySubscription } = useProductStore()
  const [search, setSearch] = React.useState("")
  const { authorization } = useUserStore((state) => state)

  React.useEffect(() => {
    getMySubscription({
      user: user?._id || ""
    })
  }, [getMySubscription, authorization, user?._id])

  return (
    <div className="">
      {!!mySubscription.total && (
        <div className="flex justify-between items-center">
          <p className="text-neutral-900 font-semibold text-2xl leading-[30px]">
            {mySubscription.total} products
          </p>
          <div>
            <div className="flex relative">
              <Input
                inputClassName="!h-[40px] !pl-14 !border-none"
                type="text"
                placeholder="Search"
                onChange={(e) => {
                  setSearch(e.target.value)
                  getMySubscription({
                    page: 1,
                    search: e.target.value
                  })
                }}
              />
              <div className="absolute left-4 h-[40px] mt-1 rounded-l-[5px] text-neutral-200 grid place-items-center cursor-pointer">
                <SearchIcon />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="h-50">
        <div
          className={twMerge(
            "flex mt-12 flex-wrap gap-6 items-center",
            mySubscription.products.length === 0
              ? "justify-center"
              : "justify-start"
          )}
        >
          {mySubscription.products.map((item) => (
            <ProductCard key={item._id} product={item} hideSubscribeBtn />
          ))}
          {mySubscription.products.length === 0 && (
            <EmptyState message="There are no subscriptions." />
          )}
        </div>
        {mySubscription.total !== mySubscription.products.length && (
          <div className="w-full grid place-content-center mt-10">
            <span
              className="cursor-pointer font-[500] text-base leading-6"
              onClick={() => {
                getMySubscription({
                  page: mySubscription.page + 1,
                  search,
                  append: true
                })
              }}
            >
              Load More
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
