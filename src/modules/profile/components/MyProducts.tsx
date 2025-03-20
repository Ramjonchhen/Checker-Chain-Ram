// import { LegacyProductCard } from "components/landing/components/LegacyProductCard"
import { ChangeEvent, FC, useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"

import { useProductStore } from "stores/product"
import { User, useUserStore } from "stores/user"
import { EmptyState, Input } from "components"
import { SearchIcon } from "assets/icons"
import ProductCard from "components/landing/components/ProductCard"

interface Props {
  user?: User
}

export const MyProducts: FC<Props> = ({ user }) => {
  const { myProducts, getMyProducts } = useProductStore()
  const [search, setSearch] = useState("")
  const { authorization } = useUserStore((state) => state)

  useEffect(() => {
    if (user?._id) {
      getMyProducts({
        user: user?._id || ""
      })
    }
  }, [getMyProducts, authorization, user?._id])

  const loadMoreProducts = () => {
    getMyProducts({
      page: myProducts.page + 1,
      search,
      append: true
    })
  }

  const onSearchProduct = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    getMyProducts({
      page: 1,
      search: e.target.value
    })
  }

  if (
    myProducts.products?.[0]?.createdBy?._id !== user?._id ||
    myProducts.products.length === 0
  ) {
    return <EmptyState message="No products found" />
  }

  return (
    <div className="">
      {!!myProducts.total && (
        <div className="flex justify-center sm:justify-between items-center">
          <p className="text-neutral-900 font-semibold hidden sm:block text-2xl leading-[30px]">
            {myProducts.total} products
          </p>
          <div>
            <div className="flex relative justify-center sm:justify-between ">
              <Input
                inputClassName="!h-[40px] !pl-14 !border-none flex-grow sm:flex-grow-0"
                type="text"
                placeholder="Search"
                onChange={onSearchProduct}
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
            "flex mt-2 sm:mt-12 flex-wrap gap-6 items-center pb-5",
            myProducts.products.length === 0
              ? "justify-center"
              : "justify-start sm:justify-center md:justify-start"
          )}
        >
          {/* // <LegacyProductCard key={item._id} product={item} /> */}
          {myProducts.products.map((item) => (
            <ProductCard key={item._id} product={item} hideSubscribeBtn />
          ))}
        </div>
        {myProducts.total !== myProducts.products.length && (
          <div className="w-full grid place-content-center mt-10">
            <span
              className="cursor-pointer font-[500] text-base leading-6"
              onClick={loadMoreProducts}
            >
              Load More
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
