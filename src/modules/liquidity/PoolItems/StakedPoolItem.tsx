import { ChevronDownIcon, UnlockIcon, LockIcon } from "assets/icons"
import { Button } from "components"
import { Token } from "modules/token"
import { useState } from "react"
// import { abbreviateNumber } from "utils/getLiquidityInfo"
import { ILPModalHandler, LiquidityInfo } from "modules/liquidity/liquidity"
import LpGraph from "modules/liquidity/PoolItems/LpGraph"
import LiquidityBtn from "modules/liquidity/PoolItems/LiqiuidityBtn"
import { largeNumberFormater } from "utils/helper"
import { usePriceRatesStore } from "stores/priceRatesData"
import { abbreviateNumber } from "utils/getLiquidityInfo"

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
  remainingDays: string
  grandTotalAmt: string
}

const expandedTitleStyle = "text-xs font-medium leading-4 text-neutral-600"
const expandedDataStyle =
  "text-2xl font-medium leading-[30px] text-neutral-900 mt-2"
const expandedSubDataStyle = "text-base font-medium leading-4 text-neutral-200"

const StakedPoolItem = ({
  pool,
  stakedAmount,
  modalHandler,
  claimRewards,
  remainingRewards,
  remainingDays,
  grandTotalAmt
}: Props) => {
  const { pairData: pairInfo } = usePriceRatesStore()

  const [isExpanded, setIsExpanded] = useState<boolean>(true)
  const toggleIsExpanded = () => setIsExpanded((curr) => !curr)

  const userStakedSharePercent =
    Number(grandTotalAmt) === 0
      ? 0
      : (Number(stakedAmount) / Number(grandTotalAmt)) * 100

  const unStakeModalHandler = () => {
    modalHandler({
      show: true,
      liquidityInfo: pool,
      stakedAmount,
      type: "unstake"
    })
  }

  const stakeModalHandler = () => {
    modalHandler({
      show: true,
      liquidityInfo: pool,
      type: "stake"
    })
  }

  const harvestHandler = () => claimRewards({})

  return (
    <>
      <tr
        className={`border-b border-separator text-neutral-900 font-medium cursor-pointer`}
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

        <td
          className="text-base px-8 py-4 whitespace-nowrap"
          rowSpan={isExpanded ? 2 : 1}
        >
          <div>
            {isExpanded ? (
              <LpGraph
                minimizeGraphHandler={() => setIsExpanded(false)}
                harvestHandler={harvestHandler}
                remainingRewards={remainingRewards}
                isHarvestBtnDisabled={remainingRewards === "0"}
              />
            ) : (
              <Button
                title="Rewards"
                variant="default"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleIsExpanded()
                }}
                endIcon={<ChevronDownIcon className="text-white h-5 w-5" />}
              />
            )}
          </div>
        </td>
      </tr>
      {isExpanded ? (
        <>
          <tr className="text-neutral-900 rounded-full">
            <td className="p-0 pt-6 pl-8 pb-10" colSpan={1}>
              <div>
                <div className={expandedTitleStyle}>Staked Deposit</div>
                <div className={expandedDataStyle}>
                  {`${largeNumberFormater(Number(stakedAmount))} `}
                  <span className={expandedSubDataStyle}>LP token</span>
                </div>
              </div>
            </td>
            <td className="p-0 pt-6 pl-8 pb-10" colSpan={1}>
              <div>
                <div className={expandedTitleStyle}>Staked Share</div>
                <div className={expandedDataStyle}>
                  {abbreviateNumber(userStakedSharePercent)}
                  <span className={expandedSubDataStyle}> %</span>
                </div>
              </div>
            </td>
            <td className="p-0 pt-6 pl-8 pb-10" colSpan={1}>
              <div>
                <div className={expandedTitleStyle}>Total Rewards Earned</div>
                <div className={expandedDataStyle}>
                  $ {((pairInfo?.basePrice ?? 0) * Number(remainingRewards)).toFixed(2)}
                  {/* {largeNumberFormater(remainingRewards )} */}
                  <span className={expandedSubDataStyle}>
                    {" "}
                    {largeNumberFormater(Number(remainingRewards))} CHECKR
                  </span>
                </div>
              </div>
            </td>
          </tr>
          <tr className="border-b border-separator">
            <td className="p-0 pt-6 pl-8 pb-10" colSpan={2}>
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
            </td>
            <td className="p-0 pt-6 pl-8 pb-10" colSpan={1}>
              <div>
                <div className={expandedTitleStyle}>Next Reward in</div>
                <div className={expandedDataStyle}>
                  {remainingDays === "0" ? (
                    "Today"
                  ) : (
                    <>
                      {largeNumberFormater(Number(remainingDays))}
                      <span className={expandedSubDataStyle}> Days</span>
                    </>
                  )}
                </div>
              </div>
            </td>
          </tr>
        </>
      ) : null}
    </>
  )
}

export default StakedPoolItem
