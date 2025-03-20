import { useGetLoginInfo } from "lib/dApp-core"
import * as Icons from "assets/icons"
import { Sidebar } from "components"
import { useClickOutside } from "hooks/useOutsideClick"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC, useEffect, useRef, useState } from "react"
import ReactTooltip from "react-tooltip"
import { useUserStore } from "stores"
import { twMerge } from "tailwind-merge"
import { DrawerProps } from "./index.d"

export const Drawer: FC<DrawerProps> = ({ expanded, toggleDrawer }) => {
  const router = useRouter()

  const [currentRoute, setCurrentRoute] = useState("/")
  const { isLoggedIn } = useGetLoginInfo()
  const { isOnboarded } = useUserStore()
  const sidebarRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setCurrentRoute(router.pathname)
    ReactTooltip.rebuild()
  }, [router.pathname])
  const [menuClicked, setMenuClicked] = useState(false)
  const menuIcons = [
    {
      id: "1",
      name: "Referral",
      icon: <Icons.UserAdd />,
      link: "/referral"
    },
    {
      id: "2",
      name: "Leaderboard",
      icon: <Icons.Leaderboard />,
      link: "/leaderboard"
    },
    {
      id: "4",
      name: "Settings",
      icon: (
        <div className="w-12 h-12 flex justify-center items-center">
          <Icons.SettingIcon />{" "}
        </div>
      ),
      link: "/settings"
    }
    // {
    //   id: "5",
    //   name: "More",
    //   icon: <Icons.More />
    // }
  ]

  useClickOutside(sidebarRef, {
    onClickOutside: () => {
      setMenuClicked(false)
    }
  })
  return (
    <>
      {isLoggedIn && isOnboarded && (
        <div
          key={Math.random()}
          className={twMerge(
            `transition-[width] hidden md:block duration-4000 w-max h-screen sticky top-0 bg-white text-white overflow-hidden`
          )}
        >
          <div className="flex justify-center h-20 items-center px-3 w-full p-10">
            <Link href="/" className="flex justify-center items-center">
              <a>
                {expanded ? (
                  <Icons.CheckerChainFull
                    style={{
                      transform: "scale(0.95)"
                    }}
                  />
                ) : (
                  <Icons.CheckerLogo />
                )}
              </a>
            </Link>
          </div>
          <div className="flex h-full justify-around items-center flex-col">
            <div>
              <ul>
                {menuIcons.map((item) => (
                  <li key={`${item.id}${item.name}`} data-tip={item.name}>
                    <Link href={`${item.link}`} key={item.name}>
                      <a
                        className={twMerge(
                          "cursor-pointer flex items-center justify-start w-full p-x-4",
                          currentRoute === item.link
                            ? ` bg-primary ${
                                expanded ? "rounded-lg" : "rounded-full"
                              } text-white`
                            : "text-black",
                          expanded ? "pr-2" : ""
                        )}
                      >
                        {item.icon} {expanded && item.name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div
                className={`py-3 cursor-pointer text-black ${
                  expanded && "transform rotate-180"
                }`}
                onClick={() => toggleDrawer()}
              >
                <Icons.HamBurgerIcon />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="fixed md:hidden flex justify-between gap-4 bottom-0 pb-2 px-8 bg-white w-screen z-10 overflow-hidden">
        {isLoggedIn &&
          menuIcons.map((item) => (
            <div key={`${item.id}${item.name}`} data-tip={item.name}>
              <Link href={`${item.link}`} key={item.name}>
                <div
                  className={`${
                    currentRoute === item.link
                      ? ` text-primary rounded-full`
                      : "text-black"
                  } flex justify-center flex-col`}
                >
                  <div
                    className={twMerge(
                      "cursor-pointer flex justify-center p-x-4",
                      currentRoute === item.link
                        ? ` text-primary rounded-full`
                        : "text-black",
                      expanded ? "pr-2" : ""
                    )}
                  >
                    {item.icon}
                  </div>
                  <div className="-mt-2">{item.name}</div>
                </div>
              </Link>
            </div>
          ))}
        <div
          className="flex justify-center items-center"
          onClick={() => {
            setMenuClicked(true)
          }}
        >
          <div
            className={`${
              menuClicked ? ` text-primary rounded-full` : "text-black"
            } flex justify-center items-center flex-col`}
          >
            <div
              className={twMerge(
                "cursor-pointer flex justify-center w-12 h-12 items-center",
                menuClicked ? ` text-primary rounded-full` : "text-black",
                expanded ? "pr-2" : ""
              )}
            >
              <Icons.HamBurgerIcon />
            </div>
            <div className="-mt-2">{isLoggedIn ? "More" : "Menu"}</div>
          </div>
        </div>
        <Sidebar show={menuClicked} className="w-[290px] md:hidden">
          <div ref={sidebarRef} className="overflow-auto h-full w-full p-4">
            <Icons.CheckerChainFull
              className="w-full mt-2"
              onClick={() => router.push("/")}
            />
            {/* {menuIcons.map((item) => (
            <div key={`${item.id}${item.name}`} className="flex p-2 flex-col items-start justify-center">
              <Link href={`${item.link}`} key={item.name}>
                <div
                  className={`${
                    currentRoute === item.link
                      ? ` text-primary rounded-full`
                      : "text-black"
                  } flex justify-center items-center`}
                >
                  <div
                    className={twMerge(
                      "cursor-pointer flex justify-center items-center p-x-4",
                      currentRoute === item.link
                        ? ` text-primary rounded-full`
                        : "text-black",
                      expanded ? "pr-2" : ""
                    )}
                  >
                    {item.icon}
                    </div>
                  <div>{item.name}</div>
                </div>
              </Link>
            </div>
          ))} */}

            <div className="flex p-2 flex-col items-start justify-center">
              <Link href={`/staking`}>
                <div
                  className={`${
                    currentRoute === "/staking"
                      ? ` text-primary rounded-full`
                      : "text-black"
                  } flex justify-center items-center w-full bg-background-contrast`}
                >
                  Staking
                </div>
              </Link>
            </div>
            <div className="flex p-2 flex-col items-start justify-center">
              <Link href={`/liquidity`}>
                <div
                  className={`${
                    currentRoute === "/liquidity"
                      ? ` text-primary rounded-full`
                      : "text-black"
                  } flex justify-center items-center w-full bg-background-contrast`}
                >
                  Liquidity
                </div>
              </Link>
            </div>
            <div className="flex p-2 flex-col items-center justify-center">
              <Link href={`/rewards`}>
                <div
                  className={`${
                    currentRoute === "/rewards"
                      ? ` text-primary rounded-full`
                      : "text-black"
                  } flex justify-center items-center w-full bg-background-contrast`}
                >
                  Rewards
                </div>
              </Link>
            </div>
          </div>
        </Sidebar>
      </div>
    </>
  )
}
