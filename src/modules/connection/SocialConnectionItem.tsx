// src/components/SocialConnectButton.tsx
import React from "react"
import { useUserStore } from "stores"
import { ISocailLogin } from "./ConnectionItem"
import { useSocialAuth } from "hooks/useSocialAuth"

const SocialConnectButton: React.FC<ISocailLogin> = ({ name, icon }) => {
  const { handleSocialLogin } = useSocialAuth()

  return (
    <div
      className={
        "connection-item min-w-[84px] max-w-[98px] flex-1  bg-[#ECF2FA] flex flex-col items-center  rounded-lg py-[10px] px-1 h-full  group/connectionItem cursor-pointer hover:bg-primary-500 transition-colors duration-400"
      }
      onClick={() => handleSocialLogin(name === "X" ? "twitter" : "google")}
    >
      <div className="w-[37px]  flex-shrink-0 h-[37px]  rounded-lg  grid place-items-center">
        {icon}
      </div>
      <div className="mt-2  text-[11px] font-bold text-neutral-900 text-center leading-3 group-hover/connectionItem:text-white transition-colors duration-400">
        {name}
      </div>
    </div>
  )
}

export default SocialConnectButton
