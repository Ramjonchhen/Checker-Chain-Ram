import {
  CopyIcon,
  ReferralsIcon,
  LinkChainIcon,
  LinkOutIcon,
  WorkGiftIcon,
  CheckerChainSmallNewLogo
} from "assets/icons"
import ReferralMainImage from "assets/images/referrals/main.png"
import { Card, Input, Stats, Text } from "components"
import { useEffect, useRef, useState } from "react"
import { useUserStore } from "stores"

export const ReferralMain = () => {
  const divRef = useRef<HTMLDivElement>(null)
  const [styles, setStyles] = useState({
    referral: {}
  })
  const { getReferrals, authorization, referrals } = useUserStore(
    (state) => state
  )
  const referralCode = useUserStore((state) => state.user.referralCode)

  const [dynamicOffset, setDynamicOffset] = useState(256)

  useEffect(() => {
    setTimeout(() => {
      if (window.innerWidth > 1536) {
        setDynamicOffset((divRef.current?.clientWidth || 0) - 256)
      } else if (window.innerWidth > 1280) {
        setDynamicOffset((divRef.current?.clientWidth || 0) - 224)
      } else if (window.innerWidth > 768) {
        setDynamicOffset((divRef.current?.clientWidth || 0) - 96)
      } else {
        setDynamicOffset((divRef.current?.clientWidth || 0) - 64)
      }
    }, 200)
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1536) {
        setDynamicOffset((divRef.current?.clientWidth || 0) - 256)
      } else if (window.innerWidth > 1280) {
        setDynamicOffset((divRef.current?.clientWidth || 0) - 224)
      } else if (window.innerWidth > 768) {
        setDynamicOffset((divRef.current?.clientWidth || 0) - 96)
      } else {
        setDynamicOffset((divRef.current?.clientWidth || 0) - 64)
      }
    })
  }, [divRef])

  useEffect(() => {
    // console.debug(dynamicOffset)
    // console.debug("changing")
    setStyles({
      referral: {
        width: `${dynamicOffset}px`
      }
    })
  }, [dynamicOffset])

  useEffect(() => {
    if (authorization) {
      getReferrals()
    }
  }, [authorization])

  return (
    <div className="flex flex-col gap-12 mb-20 md:m-12 ">
      <div ref={divRef}>
        <div className="md:flex items-center gap-20 px-8 md:px-12 xl:px-28 2xl:px-32 bg-referral-gradient pt-16 relative w-full">
          <div className="flex flex-col max-w-160 pb-16">
            <Text className="font-semibold" variant="subtitle">
              Refer a friend.
              <br />
              Get <span className="text-primary-500">1000 CP Reward.</span>
            </Text>
            <Text className="text-[16px] text-content-tertiary" variant="body">
              Invite your friends to join CheckerChain and earn upto{" "}
              <b>1000 </b>CP per epoch.
            </Text>
          </div>
          <div className="z-10 flex justify-center md:flex-none">
            <img
              src={ReferralMainImage.src}
              className="object-cover w-[280px] h-[248px]"
            />
          </div>
          <Card
            className="absolute bg-white -bottom-24"
            style={styles.referral}
          >
            <div className="md:flex md:gap-2 md:justify-between xl:gap-20 2xl:gap-60 xl:px-20">
              <Input
                label="Your Referral Coded"
                inputClassName="h-11 !border-none !rounded-tr-none !rounded-br-none"
                type="text"
                error={false}
                value={referralCode}
                disabled
                endIcon={<CopyIcon className="w-6 h-6 text-white" />}
                placeholder="https://checkerchain.com/referral/120971"
              />

              <div className="mt-5 md:mt-3 flex justify-between md:justify-start gap-8">
                <Stats
                  topText="Referrals"
                  // bottomText="End"
                  value={`${referrals?.count || 0}`}
                  startIcon={<ReferralsIcon />}
                  className="justify-between"
                />
                <Stats
                  topText="Total Earned"
                  // bottomText="End"
                  value={`${referrals?.rewards || 0} CP`}
                  startIcon={<CheckerChainSmallNewLogo className="scale-50" />}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div className="bg-[#de2b470C] py-8 mt-20 items-center flex flex-col">
        <Text variant="subtitle" className="font-medium text-md block py-6">
          How it works
        </Text>
        <div className="grid grid-cols-1 md:grid-cols-3 w-full place-content-center gap-8 px-20">
          {[
            {
              title: "Get Referral Link",
              description:
                "You get a private referral link which you can use to invite your friends.",
              icon: <LinkChainIcon className="w-6 h-6" />
            },
            {
              title: "Invite Friends",
              description:
                "Share the referral link in social platform and get status of each registered account.",
              icon: <LinkOutIcon className="w-6 h-6 text-white" />
            },
            {
              title: "Get Rewards",
              description:
                "Get 10 CP instantly when a friend registers an account in CheckerChain.",
              icon: <WorkGiftIcon className="w-6 h-6" />
            }
          ].map((works) => (
            <div
              key={works.title}
              className="flex flex-col items-center gap-3 justify-center"
            >
              <div className="bg-primary p-4 rounded-full border-white border-4 shadow">
                {works.icon}
              </div>
              <div>
                <Text variant="subtitle" className="font-medium !text-lg block">
                  {works.title}
                </Text>
              </div>
              <div className="!text-center">
                <Text variant="body">{works.description}</Text>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <div className="items-center flex flex-col">
      <Text variant="subtitle" className="font-medium text-md block py-6">
      Frequently Asked Questions
          </Text>
          <div className="grid px-20 gap-x-20">
            <div>

            </div>
            <div>

            </div>
          </div>
            </div> */}
    </div>
  )
}
