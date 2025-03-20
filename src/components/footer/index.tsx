/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react"
import * as Icons from "assets/icons"
import Link from "next/link"
import config from "config/config.json"
import { usePriceRatesStore } from "stores/priceRatesData"

export function Footer() {
  // const [pairInfo, setPairInfo] = useState<any>({})
  const { getPairs, pairData: pairInfo } = usePriceRatesStore()
  useEffect(() => {
    getPairs(config.mainnet.tokenId, config.network.egldToken)
  }, [])

  return (
    <div className="flex flex-col flex-wrap px-4 md:px-20 bg-background-footer text-content-text pt-16">
      {/* Footer Menu List  */}
      <div className="flex  flex-wrap justify-center items-center md:justify-between">
        {/* Navigation List */}
        <div className="flex flex-wrap justify-start">
          {[
            {
              title: "About",
              links: [
                {
                  path: "https://docs.checkerchain.com/what-is-checkerchain-protocol/team-and-partnerships",
                  title: "Teams and Partnerships"
                },
                {
                  path: "https://docs.checkerchain.com/whitepaper/checkerchain-whitepaper",
                  title: "Whitepaper"
                }
              ]
            },
            {
              title: "Information",
              links: [
                {
                  path: "https://docs.checkerchain.com/roadmap-growths/roadmap",
                  title: "Roadmap"
                },
                {
                  path: "https://docs.checkerchain.com/archives/pre-sale-of-checkr-token",
                  title: "Presale Info"
                }
              ]
            },
            {
              title: "Links",
              links: [
                {
                  path: "https://docs.checkerchain.com",
                  title: "Documentations"
                },
                {
                  path: "https://linktr.ee/checkerchain",
                  title: "Resources"
                },
                {
                  path: "/community",
                  title: "Community"
                }
              ]
            },
            {
              title: "Help",
              links: [
                {
                  path: "#",
                  title: "Privacy Policy"
                },
                {
                  path: "#",
                  title: "Terms of Service"
                }
              ]
            }
          ].map((each) => (
            <div className="w-[166px] h-[96px]" key={each.title}>
              <p className="font-bold mb-2">{each.title}</p>
              <ul className="flex-inline gap-6 flex-col text-[11px] leading-6">
                {each.links.map((item) => (
                  <li key={item.title}>
                    <Link href={item.path}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Social Links */}
        <div className="flex gap-4">
          <a
            target="_blank"
            rel="noreferrer"
            href={"https://twitter.com/checker_chain"}
          >
            <Icons.TwitterIcon className="cursor-pointer" />
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href={"https://t.me/checkerofficial"}
          >
            <Icons.TelegramFullIcon className="cursor-pointer" />
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href={"https://discord.com/invite/YUcYjEEjcv"}
          >
            <Icons.DiscordFullIcon className="cursor-pointer" />
          </a>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2 md:gap-0 md:justify-between py-6 items-center">
        <p className="flex-inline gap-6 text-[11px] leading-6">
          Copyright &copy; 2020-{new Date().getFullYear()} CheckerChain. All
          rights reserved.
        </p>
        <p className="flex justify-center items-center px-3 bg-background-footer-coin text-[11px] leading-6 rounded-md">
          <Icons.CheckerChainSmallNewLogo className="scale-50" />1 CHECKR= $
          {pairInfo?.basePrice?.toFixed(5)}
        </p>
      </div>
    </div>
  )
}
