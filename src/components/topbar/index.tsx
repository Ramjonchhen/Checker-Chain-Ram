import { logout, useGetAccountInfo } from "lib/dApp-core"
import {
  // CheckerChainFull,
  ChevronDownIcon,
  PowerOffIcon,
  SidebarMenuIcon,
  UserIcon,
  CheckerChainFullNewLogo
  // CheckerChainSmallNewLogo
} from "assets/icons"
import NoProfileImage from "assets/images/avatar/no_profile.png"
import { Button } from "components/button"
import { Dropdown } from "components/dropdown"
import { Sidebar } from "components/sidebar"
import { Text } from "components/text"
import { useClickOutside } from "hooks/useOutsideClick"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC, useEffect, useRef, useState } from "react"
import { useSettingStore, useUserStore, useWalletDialogStore } from "stores"
import { toSubstring } from "utils"
import * as Icons from "assets/icons"
// import { Input } from "components/input"
import { useWallet } from "hooks/useWallet"
// import { useCommonStore } from "stores/common"
import Image from "next/image"
import { Input } from "components/input"
import { GA_EVENT_SEARCH_TOPBAR, trackEvent } from "lib/GoogleAnalytics"
import { twMerge } from "tailwind-merge"
import { constants } from "constants/common"
import Notification from "components/notification"
import { useNotificationStore } from "stores/notification"
import {
  CheckerSmallLogo
  // CoinCheckr
} from "assets/images"
import { signOut } from "next-auth/react"

export * from "./UnathorizedTopbar"

export interface MenuItem {
  id: string
  name: string
  icon: JSX.Element
  link: string
}

interface TopbarProps {
  menuItems: MenuItem[]
}

// const tabs = [
//   {
//     name: "Products",
//     icon: <Icons.MenuGroupIcon className="w-4 h-4" />,
//     link: "/"
//   },
//   {
//     name: "Community",
//     icon: <Icons.UsersIcon className="w-4 h-4" />,
//     link: "/community"
//   }
// ]

export const Topbar: FC<TopbarProps> = ({ menuItems }) => {
  const { account } = useGetAccountInfo()
  const {
    isOnboarded,
    user,
    reset: resetUser,
    authorization,
    isLoggedIn
  } = useUserStore()
  const dropDownWrapperRef = useRef(null)
  useClickOutside(dropDownWrapperRef, {
    onClickOutside: () => setShowDropdown(false)
  })

  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [search, setSearch] = useState("")
  const { setLoginDialog } = useWalletDialogStore()
  const { reset: resetSettings } = useSettingStore((state) => state)
  const { userBalance, wallet } = useWallet()
  // const { setCurrentNavbarTab } = useCommonStore()
  const { resetNotificationData } = useNotificationStore()

  const pushRoute = (route: string) => {
    if (router.pathname !== route) {
      router.push(route)
    }
  }

  useEffect(() => {
    window.onscroll = () => {
      setShowDropdown(false)
      setShowSidebar(false)
    }
  }, [])

  // useEffect(() => {
  //   if (router.pathname) {
  //     // setSearch(router.query.query as string)
  //     setCurrentNavbarTab(
  //       tabs.find((tab) => tab.link === router.pathname)?.name
  //     )
  //   }
  // }, [router.pathname])

  useEffect(() => {
    router &&
      !isLoggedIn &&
      setLoginDialog(router.asPath.includes(constants.APP_QR_MODAL_OPEN_SLUG))
  }, [router, isLoggedIn])

  const clearData = () => {
    signOut({ callbackUrl: "/" })
    resetUser()
    resetNotificationData()
    resetSettings()
    window.localStorage.clear()
    logout()
  }

  const searchHandler = () => {
    router.push(`/search?query=${search}`)
    trackEvent({
      action: GA_EVENT_SEARCH_TOPBAR,
      category: "",
      label: "Searched from Topbar",
      value: search
    })
  }

  const navLinks = [
    // ...(!["/", "/community"].includes(router.pathname)
    //   ? [
    //       {
    //         name: "Explore",
    //         icon: <Icons.ExploreIcon className="w-6 h-6" />,
    //         menus: [
    //           {
    //             name: "Products",
    //             link: "/",
    //             icon: <Icons.MenuGroupIcon className="w-5 h-5" />
    //           },
    //           {
    //             name: "Community",
    //             link: "/community",
    //             icon: <Icons.UsersIcon className="w-5 h-5" />
    //           }
    //         ]
    //       }
    //     ]
    //   : []),
    // {
    //   name: "Explore",
    //   icon: <Icons.ExploreIcon className="w-6 h-6" />,
    //   menus: [
    //     {
    //       name: "Products",
    //       link: "/",
    //       icon: <Icons.MenuGroupIcon className="w-5 h-5" />
    //     },
    //     {
    //       name: "Community",
    //       link: "/community",
    //       icon: <Icons.UsersIcon className="w-5 h-5" />
    //     }
    //   ]
    // },
    {
      name: "Stats",
      icon: <Icons.StatsIcon className="w-6 h-6" />,
      menus: [
        {
          name: "Leaderboard",
          link: "/leaderboard",
          icon: <Icons.Leaderboard className="w-5 h-5" />
        }
      ]
    },
    {
      name: "Farming",
      icon: <Icons.FarmingIcon className="w-6 h-6" />,
      menus: [
        {
          name: "Liquidity",
          link: "/liquidity",
          icon: <Icons.LiquidityIcon className="scale-90" />
        },
        {
          name: "Staking",
          link: "/staking",
          icon: <Icons.StakingIcon className="scale-90" />
        },
        {
          name: "Vesting",
          link: "/vesting",
          icon: <Icons.VestingIcon className="w-5 h-5" />
        }
      ]
    }
  ]

  return (
    <>
      <Sidebar
        show={showSidebar}
        className="top-[0px] p-5 gap-4 shadow-md pt-[84px]"
      >
        {menuItems.map((item) => (
          <div key={`${item.id}${item.name}`} data-tip={item.name}>
            <Link href={`${item.link}`} key={item.name}>
              <a
                className={`first-line:cursor-pointer flex items-center gap-4 justify-start w-full py-2 md:px-12 lg:px-24
                  ${
                    router.pathname === item.link
                      ? ` bg-primary text-white`
                      : "text-content-secondary"
                  } ${
                  router.pathname !== item.link && "hover:bg-primary-50"
                } rounded-md`}
              >
                {item.icon} {item.name}
              </a>
            </Link>
          </div>
        ))}
      </Sidebar>
      <div
        className={
          "sticky z-[2147483642] top-0 bg-white shadow-md h-[72px] w-full"
        }
      >
        <div
          className={twMerge(
            ` flex items-center justify-center px-1 sm:px-5 h-full gap-2 lg:gap-8`,
            "max-w-[1500px] mx-auto"
          )}
        >
          <div className="flex items-center justify-center h-full gap-2 ">
            {router.pathname !== "/" && (
              <div
                className="hidden"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <SidebarMenuIcon
                  className={`cursor-pointer transform duration-300 ease-in-out ${
                    showSidebar && "-scale-x-100"
                  }`}
                />
              </div>
            )}

            <div
              className="lg:hidden pl-[10px]  h-[45px] w-[45px] cursor-pointer"
              onClick={() => router.push("/")}
            >
              <img
                src={CheckerSmallLogo.src}
                alt="checker"
                className="h-full w-full object-contain"
              />
              {/* <CheckerChainSmallNewLogo className="h-[50px] w-[50px]" /> */}
            </div>
            <div onClick={() => router.push("/")} className="cursor-pointer">
              <CheckerChainFullNewLogo className="h-[40px] hidden lg:block" />
              {/* <CheckerChainFull className="hidden h-full cursor-pointer lg:block w-fit" /> */}
            </div>
          </div>

          <div className="relative flex">
            <Input
              inputClassName="!h-[40px] !pl-14 !border-none !rounded-full "
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && search) {
                  searchHandler()
                }
              }}
            />
            <div className="absolute left-4 h-[40px] mt-1 rounded-l-[5px] text-neutral-200 grid place-items-center cursor-pointer">
              <Icons.SearchIcon />
            </div>
          </div>
          <div className="hidden md:flex gap-2 lg:gap-8 ml-auto">
            {navLinks.map((item) => (
              <div
                key={item.name}
                className="group relative cursor-pointer font-bold text-base"
              >
                <div
                  key={item.name}
                  className={`flex items-center gap-1 lg:gap-2 py-[6px] cursor-pointer ${
                    item?.menus?.map((m) => m.link).includes(router.pathname)
                      ? "text-primary"
                      : "text-neutral-700"
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-[500]">{item.name}</span>
                  <ChevronDownIcon className="transition-all duration-200 w-4 h-4 group-hover:transform group-hover:rotate-180" />
                </div>
                <div className="animate-fadeInFast group-hover:block absolute hidden">
                  <div className="mt-2 bg-white shadow-lg p-2 rounded-md border border-separate flex flex-col gap-2">
                    {item.menus.map((item) => (
                      <div
                        key={item.name}
                        className={`cursor-pointer font-bold text-base hover:bg-background-muted rounded-md ${
                          router.pathname === item.link && "text-primary"
                        }`}
                        onClick={() => router.push(item.link)}
                      >
                        <div
                          key={item.name}
                          className={`flex items-center gap-2 py-[6px] px-3 cursor-pointer`}
                        >
                          {item.icon}
                          <span className="text-sm font-[500]">
                            {item.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center ml-auto lg:ml-0">
            {isLoggedIn && (
              <Link href="/create-product">
                <div className="hidden md:flex items-center gap-2 px-4 py-2 border border-separate rounded-xl shadow-lg cursor-pointer bg-primary text-white hover:bg-primary-900 text-sm">
                  <Icons.PlusIcon className="w-4 h-4" />
                  Create
                </div>
              </Link>
            )}
            {isLoggedIn && (
              <div className="mr-5 md:mr-0">
                <Notification walletId={wallet.address} />
              </div>
            )}

            {isLoggedIn && (
              <div className="relative" ref={dropDownWrapperRef}>
                <Button
                  endIcon={
                    <ChevronDownIcon
                      className={`transition-all duration-200 w-4 h-4 ml-2 text-neutral-600 ${
                        showDropdown && "transform rotate-180"
                      }`}
                    />
                  }
                  onClick={() => setShowDropdown(!showDropdown)}
                  startIcon={
                    <Image
                      src={
                        user?.profilePicture
                          ? `${process.env.NEXT_PUBLIC_SPACE_BASE}${user.profilePicture}`
                          : NoProfileImage.src
                      }
                      className="object-cover rounded-full"
                      width={28}
                      height={28}
                      alt="profile"
                      unoptimized
                    />
                  }
                  variant="default"
                  size="small"
                  className="sm:px-5 ml-0 bg-transparent w-max h-11 lg:ml-6 z-[9999]"
                />
                <Dropdown
                  className="mt-2 bg-white border border-outline-secondary w-60 z-[9999]"
                  show={showDropdown}
                  position="right"
                >
                  {isOnboarded && (
                    <div className="flex flex-col items-center justify-center py-6 gap-y-2 border-y border-y-separator">
                      <Image
                        src={
                          user.profilePicture
                            ? `${process.env.NEXT_PUBLIC_SPACE_BASE}${user.profilePicture}`
                            : NoProfileImage.src
                        }
                        className="object-cover rounded-full"
                        width={80}
                        height={80}
                        alt="profile"
                        unoptimized
                      />
                      <div className="flex flex-col">
                        <div className="flex flex-row gap-2 items-center justify-center">
                          <Text
                            variant="body"
                            className="!text-lg !font-semibold text-center"
                          >
                            {user.name}
                          </Text>
                          {user?.isVerified && (
                            <div title="Verified User">
                              <Icons.ProfileVerifiedIcon />
                            </div>
                          )}
                        </div>
                        <Text variant="body" className="!text-outline !text-sm">
                          {authorization &&
                            toSubstring(account.address, 5, true)}
                        </Text>
                        <Text variant="body" className="!text-outline !text-sm">
                          Balance: {userBalance}
                        </Text>
                      </div>
                    </div>
                  )}
                  <div>
                    <ul className="flex flex-col p-2 gap-y-4 ">
                      {isOnboarded && (
                        <>
                          <li
                            onClick={() => {
                              pushRoute(`/user/${user.username}`)
                            }}
                            className="flex items-center gap-2 px-6 py-2 cursor-pointer hover:rounded-lg hover:bg-primary hover:text-white"
                          >
                            <UserIcon className="w-6 h-6" /> Profile
                          </li>
                          <li
                            onClick={() => {
                              pushRoute(`/rewards`)
                            }}
                            className="flex items-center gap-2 px-6 py-2 cursor-pointer hover:rounded-lg hover:bg-primary hover:text-white"
                          >
                            <Icons.RewardOutlineIcon className="w-5 h-5" />
                            Rewards
                          </li>
                          <li
                            onClick={() => {
                              pushRoute(`/referral`)
                            }}
                            className="flex items-center gap-2 px-6 py-2 cursor-pointer hover:rounded-lg hover:bg-primary hover:text-white"
                          >
                            <Icons.UserAdd className="w-6 h-6" /> Referral
                          </li>
                          <li
                            onClick={() => {
                              pushRoute(`/settings`)
                            }}
                            className="flex items-center gap-2 px-6 py-2 cursor-pointer hover:rounded-lg hover:bg-primary hover:text-white"
                          >
                            <Icons.SettingIcon className="w-6 h-6" /> Settings
                          </li>
                        </>
                      )}
                      <li
                        onClick={clearData}
                        className="flex items-center gap-2 px-6 py-2 cursor-pointer text-error hover:rounded-lg hover:bg-primary hover:text-white"
                      >
                        <PowerOffIcon className="w-6 h-6" /> Log Out
                      </li>
                    </ul>
                  </div>
                </Dropdown>
              </div>
            )}
            {!isLoggedIn && (
              <>
                <div className="flex items-center">
                  <Button
                    title="Connect Wallet"
                    variant="default"
                    className="h-11  w-max ml-4 bg-primary text-[10px] md:text-sm px-3 md:px-5"
                    onClick={() => {
                      setLoginDialog(true)
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
