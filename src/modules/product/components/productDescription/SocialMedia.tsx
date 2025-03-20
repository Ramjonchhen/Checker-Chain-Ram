import React from "react"
import * as Icons from "assets/icons"
import { useProductStore } from "stores/product"
import { addHttps } from "utils"
import { twMerge } from "tailwind-merge"
import TooltipSpan from "components/toolTipSpan"

type IContactLinks = {
  value: string
  hrefLink: string
  icon: JSX.Element
  placeHolder?: string
  name: string
  hoverBackgroundClass: string
}

const SocialMedia = () => {
  const { product } = useProductStore()

  const { whitepaperUrl, contactEmail, discord, telegram, twitterProfile } =
    product

  const contactLinks: IContactLinks[] = [
    {
      value: whitepaperUrl || "",
      hrefLink: !!whitepaperUrl ? addHttps(whitepaperUrl) : "",
      icon: <Icons.WhitepaperDocumentIcon />,
      placeHolder: "Whitepaper",
      name: "whitepaper",
      hoverBackgroundClass: "hover:bg-[#F5BDC6]"
    },
    {
      value: contactEmail || "",
      hrefLink: !!contactEmail ? `mailto:${contactEmail}` : "",
      icon: <Icons.MailIcon />,
      name: "email",
      hoverBackgroundClass: "hover:bg-[#FCEFD9]"
    },
    {
      value: discord || "",
      hrefLink: !!discord ? addHttps(discord) : "",
      icon: <Icons.DiscordIcon />,
      name: "discord",
      hoverBackgroundClass: "hover:bg-[#7289da]"
    },
    {
      value: telegram || "",
      hrefLink: !!telegram ? addHttps(telegram) : "",
      icon: <Icons.TelegramIcon />,
      name: "telegram",
      hoverBackgroundClass: "hover:bg-[#0088cc]"
    },
    {
      value: twitterProfile || "",
      hrefLink: !!twitterProfile ? addHttps(twitterProfile) : "",
      icon: <Icons.OutlineTwitterIcon className="scale-75 " />,
      name: "twitter",
      hoverBackgroundClass: "hover:bg-[#1DA1F2]"
    }
  ]

  return (
    <div>
      <div className="h-[2px] w-full bg-separator my-6" />
      <div className="text-neutral-900 text-base font-semibold leading-6">
        Social Links
      </div>
      <div className="flex flex-row rounded-md border  mt-2 ">
        {contactLinks.map((link) => {
          return (
            <div
              key={link.name}
              className={twMerge(
                "group relative h-10 aspect-square  flex-1  flex justify-center items-center transition-colors duration-500 ",
                link.value ? "cursor-pointer" : "cursor-not-allowed ",
                link.hoverBackgroundClass
              )}
              title={link.name}
            >
              {!!link.hrefLink ? (
                <a
                  href={link.hrefLink}
                  target="_blank"
                  className={twMerge(
                    "scale-125 ",
                    link.value ? "cursor-pointer" : "cursor-not-allowed "
                  )}
                  rel="noreferrer"
                >
                  {link.icon}
                </a>
              ) : (
                <span
                  className={twMerge(
                    "scale-125 ",
                    link.value ? "cursor-pointer" : "cursor-not-allowed "
                  )}
                >
                  {link.icon}
                </span>
              )}

              <TooltipSpan className="left-1 right-0 capitalize">
                {link.hrefLink ? `Visit ${link?.name}` : "Unavailable"}
              </TooltipSpan>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SocialMedia
