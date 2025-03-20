/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChevronDownIcon,
  UnlockIcon,
  LockIcon,
  ArrowDownLeftIcon
} from "assets/icons"
import { Button } from "components"
import { Token } from "modules/token"
import { useState } from "react"
import { ILPModalHandler, LiquidityInfo } from "modules/liquidity/liquidity"
import LiquidityBtn from "./LiqiuidityBtn"
import { usePriceRatesStore } from "stores/priceRatesData"
import { removeAllSignedTransactions } from "@multiversx/sdk-dapp/services"
import { largeNumberFormater } from "utils/helper"

// td le spereate
type Props = {
  pool: LiquidityInfo
  stakedAmount: string
  modalHandler: (modalProps: ILPModalHandler) => void
  claimRewards: ({
    callback
  }: {
    callback?: ((sessionId: string | null) => void) | undefined
  }) => Promise<void>
  remainingRewards: string
}

const AllPoolItem = ({
  pool,
  stakedAmount,
  modalHandler,
  claimRewards,
  remainingRewards
}: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true)

  const toggleIsExpanded = () => setIsExpanded((curr) => !curr)
  const harvestHandler = () => claimRewards({})

  const { pairData: pairInfo } = usePriceRatesStore()

  const unStakeModalHandler = () => {
    removeAllSignedTransactions();
    modalHandler({
      show: true,
      liquidityInfo: pool,
      stakedAmount,
      type: "unstake"
    })
  }

  const stakeModalHandler = () => {
    removeAllSignedTransactions();
    modalHandler({
      show: true,
      liquidityInfo: pool,
      stakedAmount,

      type: "stake"
    })
  }

  return (
    <>
      <tr
        className={`${"border-b border-separator"} text-neutral-900 font-medium cursor-pointer`}
        onClick={toggleIsExpanded}
      >
        <td className="px-8 py-4 whitespace-nowrap text-base font-medium text-gray-900">
          <div className="flex items-center">
            <div className="relative w-[80px]">
              <div className="z-10 absolute -top-[20px] left-0 rounded-full  w-[40px] h-[40px] flex items-center justify-center bg-white border border-separator">
                <Token symbol={pool.token0} />
              </div>
              <div className="absolute -top-[20px] left-[30px] rounded-full  w-[40px] h-[40px] flex items-center justify-center bg-white border border-separator">
                <Token symbol={pool.token1} />
              </div>
            </div>
            <div>{pool.name}</div>
          </div>
        </td>

        <td className="px-8 py-4 whitespace-nowrap">
          <div>
            <div>
              <span className="text-base font-medium leading-4 text-neutral-900">
                ≈ {pool.liquidity[0]}
              </span>
            </div>
            <div>
              <span className="text-xs font-medium text-neutral-400">
                {pool.liquidity[1]}
              </span>
            </div>
          </div>
        </td>

        <td className="text-base px-8 py-4 whitespace-nowrap">
          <div className="flex items-center">{pool.apr}</div>
        </td>
        <td className="text-base px-8 py-4 whitespace-nowrap">
          <div className="flex items-center">{pool.volume24h}</div>
        </td>

        <td className="text-base px-8 py-4 whitespace-nowrap">
          <div className="flex items-center justify-between">
            <LiquidityBtn />
            <div className="p-2 cursor-pointer ml-4">
              <ChevronDownIcon
                className={`${
                  isExpanded ? "transform rotate-180" : ""
                } h-4 w-4 transition-transform duration-300`}
              />
            </div>
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr className="text-neutral-900 bg-white rounded-full">
          <td className="p-0 pt-6 pl-8 pb-10" colSpan={2}>
            <div className="flex flex-col gap-6">
              <div className="flex gap-20 text-sm font-medium leading-4">
                <span>Staked</span>
                <span>{largeNumberFormater(Number(stakedAmount))}</span>
              </div>
              <div className="flex gap-20 text-sm font-medium leading-4">
                <span>LP Available</span>
                <span>{largeNumberFormater( Number(pool?.userLpToken) )}</span>
              </div>
              <div className="flex gap-4">
                <LiquidityBtn />
                <Button
                  title="Stake"
                  variant="outlined"
                  disabled={pool.userLpToken.toString() === "0"}
                  onClick={stakeModalHandler}
                  className="outline-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white"
                  startIcon={<LockIcon className="h-4 w-4" />}
                />
                <Button
                  title="Unstake"
                  variant="outlined"
                  disabled={stakedAmount === "0"}
                  onClick={unStakeModalHandler}
                  className="outline-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white"
                  startIcon={<UnlockIcon className="h-4 w-4" />}
                />
              </div>
            </div>
          </td>

          <td className="p-0 pt-6 pl-8 pb-10" colSpan={5}>
            <div className="flex gap-2">
            <div className="flex flex-col gap-6">
              <div className="text-sm font-medium leading-4">
                Pending Rewards
              </div>
              <div>
                <Button
                  title="Harvest"
                  variant="outlined"
                  disabled={remainingRewards === "0"}
                  className="outline-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white"
                  startIcon={<ArrowDownLeftIcon className="h-4 w-4" />}
                  onClick={harvestHandler}
                />
              </div>
            </div>
            <div className="flex flex-col  items-center">
                <div className="flex gap-1 items-center">
                  <Token symbol={pool.token0} />
                  <span className="text-sm font-medium leading-4">
                    {remainingRewards} CHECKR
                  </span>
                </div>
                <div className="text-xs font-medium text-neutral-600 leading-4">
                  ≈ $
                  {Number(remainingRewards) *
                    Number(pairInfo?.basePrice?.toFixed(5))}
                </div>
              </div>
              </div>
          </td>

         
        </tr>
      )}
    </>
  )
}

export default AllPoolItem
