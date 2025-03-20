/* eslint-disable @typescript-eslint/no-explicit-any */
import { CopyIcon } from "assets/icons"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { AllPools } from "./AllPools"
import { StakedPools } from "./StakedPools"
import { StakeModal } from "./StakeModal"
import { UnstakeModal } from "./UnstakeModal"
import { ILPModalHandler, LiquidityInfo } from "./liquidity"
import { constants } from "constants/common"

const poolAddress =
  "erd1qqqqqqqqqqqqqpgqn8nsu24g9lca74fw0lus2garvhg2alfe2jpsqlysng"

export const Liquidity = () => {
  const [active, setActive] = useState("All Pools")
  const [showStakeModal, setShowStakeModal] = useState(false)
  const [showUnstakeModal, setShowUnstakeModal] = useState(false)
  const [stakedAmount, setStakedAmount] = useState<string | undefined>("0")

  const [liquidityInfo, setLiquidityInfo] = useState<
    LiquidityInfo | undefined
  >()

  const showLPModalHandler = ({
    type,
    liquidityInfo,
    show,
    stakedAmount
  }: ILPModalHandler) => {
    setLiquidityInfo(liquidityInfo)
    setStakedAmount(stakedAmount?.toString())
    if (type === "stake") {
      setShowStakeModal(show)
    } else {
      setShowUnstakeModal(show)
    }
  }

  const tabs = [
    {
      name: "All Pools",
      component: <AllPools modalHandler={showLPModalHandler} />
    },
    {
      name: "Staked Pools",
      component: <StakedPools modalHandler={showLPModalHandler} />
    }
  ]

  return (
    <div
      className={`py-[64px] min-h-[calc(100vh-316px)] ${constants.APP_CONTAINER_WIDTH}  ${constants.APP_CONTAINER_PADDING}`}
    >
      <StakeModal
        liquidityInfo={liquidityInfo}
        isOpen={showStakeModal}
        stakedAmount={stakedAmount}
        onClose={() => setShowStakeModal(false)}
      />
      <UnstakeModal
        liquidityInfo={liquidityInfo}
        stakedAmount={stakedAmount}
        isOpen={showUnstakeModal}
        onClose={() => setShowUnstakeModal(false)}
      />
      <div>
        <div className="text-[32px] font-semibold leading-[42px] text-neutral-900">
          Liquidity Farming
        </div>
        <div className="text-sm font-normal mt-2 text-neutral-700">
          Earn juicy rewards by farming verified LP tokens.
        </div>
        <div
          className="bg-[#cff4fc] p-4 mb-5 flex gap-2 flex-wrap text-sm font-normal mt-2 text-neutral-700 rounded-lg"
          role="alert"
        >
          Import this pool address in xExchange:
          <div className="flex gap-2">
            <span className="block md:hidden">
              {poolAddress.slice(0, 6)}
              ...
              {poolAddress.slice(poolAddress.length - 6, poolAddress.length)}
            </span>
            <span className="hidden md:block">{poolAddress}</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(poolAddress)
                toast.success("Copied Successfully.")
              }}
            >
              <CopyIcon className="text-black w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        {(
          <>
            <div className="flex items-center bg-separator rounded-2xl w-fit">
              {tabs.map((item) => (
                <div
                  key={item.name}
                  className={`py-3 px-4 rounded-2xl cursor-pointer ${
                    active === item.name
                      ? "bg-primary-500 text-white"
                      : "text-neutral-900"
                  }`}
                  onClick={() => setActive(item.name)}
                >
                  {item.name}
                </div>
              ))}
            </div>
            <div className="mt-8">
              {tabs.find((item) => item.name === active)?.component}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
