/* eslint-disable @next/next/no-img-element */
import React from "react"
import { twMerge } from "tailwind-merge"
import { ApproveProduct } from "./ApproveProduct"
import { Contract } from "./Contract"

export const Admin = () => {
  const [currentRoute, setCurrentRoute] = React.useState("product")

  const tabs = [
    {
      label: "Products",
      value: "product",
      component: <ApproveProduct />
    },
    {
      label: "Contract",
      value: "reward",
      component: <Contract />
    },
    
  ]
  return (
    <div className="grid grid-cols-12 w-full">
      <div className="shadow-3px divide-y-2 divide-y-separator px-10 py-10 pr-4 flex flex-col sticky col-span-2 bg-white">
        <div className="font-medium text-xl leading-6 mb-4">Admin Panel</div>
        <div className="pt-6 flex flex-col gap-4">
          <div className="min-h-screen">
            {tabs.map((item) => (
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
                ></div>
                <div>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="col-span-10 shadow-3px flex flex-col divide-y-2 divide-y-separator mx-44 py-12 px-16 bg-white">
        {tabs.find((tab) => tab.value === currentRoute)?.component}
      </div>
    </div>
  )
}
