import React from "react"
import { MenuItem } from "components/topbar/index"
import { useRouter } from "next/router"
import { PlusIcon } from "assets/icons"
import { useUserStore } from "stores/user"

interface Props {
  menuItems: MenuItem[]
}

export const MobileMenu: React.FC<Props> = ({ menuItems }) => {
  const router = useRouter()
  const { user } = useUserStore()
  return (
    <div className="h-[72px] md:hidden sticky bottom-0 z-50 flex flex-row items-center justify-between bg-white shadow-xl px-3 sm:px-4 gap-0 sm:gap-2 border-t border-separate">
      {menuItems.map((item, index) => (
        <div
          key={index}
          className={`py-2 px-2 sm:px-4 flex flex-col sm:flex-row items-center gap-x-2 cursor-pointer rounded-lg ${
            router.pathname === item.link && "text-primary"
          }`}
          onClick={() => router.push(item.link)}
        >
          {item.icon}
          <span className="text-[10px] sm:text-xs">{item.name}</span>
        </div>
      ))}
      {user && user._id.length > 0 && router.pathname === "/" && (
        <div
          className="absolute px-4 gap-1 bottom-20 right-2 sm:right-6 rounded-full flex items-center justify-center h-12 bg-primary"
          onClick={() => router.push("/create-product")}
        >
          <PlusIcon className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  )
}
