import { Topbar, Footer, MobileMenu } from "components"
import { FC } from "react"
import { twMerge } from "tailwind-merge"
import * as Icons from "assets/icons"
// import { useUserStore } from "stores/user"
import { LayoutProps } from "./index.d"
import { useGetLoginInfo } from "lib/dApp-core"

const menuItems = [
  {
    id: "1",
    name: "Home",
    icon: <Icons.HomeIcon className="w-6 h-6" />,
    link: "/"
  },
  {
    id: "2",
    name: "Leaderboard",
    icon: <Icons.Leaderboard className="w-6 h-6" />,
    link: "/leaderboard"
  },
  {
    id: "3",
    name: "Liquidity",
    icon: <Icons.LiquidityIcon className="w-6 h-6" />,
    link: "/liquidity"
  },
  {
    id: "4",
    name: "Staking",
    icon: <Icons.StakingIcon className="w-6 h-6" />,
    link: "/staking"
  },
  {
    id: "5",
    name: "Vesting",
    icon: <Icons.VestingIcon className="w-6 h-6" />,
    link: "/vesting"
  }
]

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div>
        <Topbar menuItems={menuItems} />
        <main className={twMerge(`w-full bg-[#F7F7F7] min-h-8/12`)}>
          {children}
          <Footer />
        </main>
        <MobileMenu menuItems={menuItems} />
      </div>
    </>
  )
}

export default Layout
