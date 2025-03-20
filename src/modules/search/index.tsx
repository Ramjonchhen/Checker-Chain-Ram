/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react"
import { useRouter } from "next/router"
import { twMerge } from "tailwind-merge"
import * as Icons from "assets/icons"
import { Button } from "components"
import { useSearchStore } from "stores/search"
import { getBaseBackendImageUrl } from "utils"

export const SearchComponent = () => {
  const [currentRoute, setCurrentRoute] = React.useState("all")
  const router = useRouter()
  const { results, getSearchResults } = useSearchStore()

  useEffect(() => {
    if (router?.query?.query) {
      getSearchResults({
        query: router.query.query as string,
        type: currentRoute.toLowerCase()
      })
    }
  }, [router.query, getSearchResults, currentRoute])

  return (
    <div className="grid grid-cols-4 w-full min-h-[calc(100vh-316px)]">
      <div className="shadow-3px hidden lg:flex divide-y-2 divide-y-separator px-10 py-10 pr-4  flex-col sticky col-span-1 bg-white">
        <div className="font-medium text-xl leading-6 mb-4">Search results</div>
        <div className="pt-6 flex flex-col gap-4">
          <p>Filters </p>
          <div>
            {[
              {
                label: "All",
                value: "all",
                icon: <Icons.MenuGroupIcon />
              },
              {
                label: "Users",
                value: "user",
                icon: <Icons.UserIcon />
              },
              {
                label: "Products",
                value: "product",
                icon: <Icons.MenuGroupPlusIcon />
              }
              // {
              //   label: "Tags",
              //   value: "tag",
              //   icon: <Icons.TagIcon />
              // }
            ].map((item) => (
              <div
                key={item.label}
                onClick={() => setCurrentRoute(item.value)}
                className={`${
                  currentRoute === item.value
                    ? ` text-primary rounded-md bg-primary-50 `
                    : "text-black"
                } flex items-center pl-2 py-3 gap-2 cursor-pointer`}
              >
                <div
                  className={twMerge(
                    "cursor-pointer flex justify-center",
                    currentRoute === item.value
                      ? ` text-primary rounded-full`
                      : "text-black"
                  )}
                >
                  {item.icon}
                </div>
                <div>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="col-span-4 lg:col-span-3 shadow-3px flex flex-col divide-y-2 divide-y-separator lg:mx-44 py-12 px-16 bg-white">
        <div className="flex flex-col gap-2 mb-4">
          <p className="text-base text-neutral-700">
            Showing search result for:
          </p>
          <p className="text-2xl font-medium text-neutral-900">
            {"“"}
            {router?.query?.query ?? ""}
            {"”"}
          </p>
          <p className="text-sm">{results.total} results found </p>
        </div>
        <div className="pt-4 flex flex-col gap-8">
          {[...results.results].map((item) => (
            <div
              key={item._id}
              className="flex gap-6 items-center cursor-pointer"
              onClick={() => {
                router.push(`/${item.type}/${item.username || item.slug}`)
              }}
            >
              {((item.type === "product" && item.logo) ||
                item.type === "user") && (
                // eslint-disable-next-line jsx-a11y/alt-text
                <img
                  className={`w-10 h-10 ${
                    item.type === "user" ? "rounded-full" : ""
                  } object-contain`}
                  src={getBaseBackendImageUrl(
                    item.profilePicture || item.logo,
                    item.type === "user" ? "avatar" : "other"
                  )}
                />
              )}
              {!item.logo && item.type === "product" && (
                <div
                  className={`font-[500] select-none ${"bg-secondary-gradient"} w-10 h-10 flex items-center justify-center text-3xl text-white`}
                >
                  {item.name[0]?.toUpperCase()}
                </div>
              )}
              <div className="flex-grow flex-wrap">
                <div className="font-medium text-xl leading-6">{item.name}</div>
                <div className="flex gap-2 text-sm leading-5 text-neutral-900">
                  {item.description || item.bio}
                </div>
              </div>
              <div
                className="w-48 h-8 grid place-content-center capitalize
               border-2 border-separator rounded-md px-3"
              >
                {item.type}
              </div>
            </div>
          ))}
          {results.results.length < results.total && (
            <Button
              variant="outlined"
              className="w-full"
              title="Load More"
              onClick={() => {
                getSearchResults({
                  query: router.query.query as string,
                  type: currentRoute.toLowerCase(),
                  page: results.page + 1,
                  append: true
                })
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
