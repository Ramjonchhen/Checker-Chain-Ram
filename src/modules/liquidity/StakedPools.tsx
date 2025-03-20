/* eslint-disable @typescript-eslint/no-explicit-any */

import { useFarmingContract } from "hooks/useFarmingContract"
import { useWallet } from "hooks/useWallet"
import { useEffect, useState, FC, useCallback } from "react"
import { getLiquidityInfo } from "utils/getLiquidityInfo"
import { ILPModalHandler, LiquidityInfo } from "./liquidity"
import LoadingPoolItems from "./PoolItems/LoadingPoolItems"
import StakedPoolItem from "./PoolItems/StakedPoolItem"

// const dummyData = [
//   {
//     id: 1,
//     name: "CHECKR/EGLD",
//     token0: "CHECKR",
//     token1: "EGLD",
//     liquidity: ["15.7M", "224.623"],
//     apr: "138%",
//     volume24h: "$483.46",
//     userPair: ["0", "0"],
//     userLpToken: "0"
//   }
// ]

export const StakedPools: FC<{
  modalHandler: (modalProps: ILPModalHandler) => void
}> = ({ modalHandler }) => {
  const cols = ["Pool", "Liquidity", "APR", "Volume (24h)", ""]
  const [pools, setPools] = useState<LiquidityInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [stakedAmount, setStakedAmount] = useState("0")
  const [remainingRewards, setRemainingRewards] = useState("0")
  const [remainingDays, setRemainingDays] = useState("0")
  const [grandTotalAmt, setGrandTotalAmt] = useState("0")

  const { wallet } = useWallet()
  const {
    getStakedAmount,
    calculateRemainingRewards,
    getNextRewardRemainingEpoch,
    claimRewards,
    isSuccessful,
    getGrandTotalAmount
  } = useFarmingContract()

  const handleData = useCallback(async () => {
    // console.log("here", wallet?.address)
    try {
      if (!wallet?.address) {
        setPools([])
        setStakedAmount("0")
        return
      }
      setLoading(true)
      const stakedAmountRes = await getStakedAmount(wallet?.address)

      if (stakedAmountRes === "0") {
        setLoading(false)
        return
      }

      const remaingRewardsRes = await calculateRemainingRewards(wallet?.address)
      setRemainingRewards(remaingRewardsRes.toString())

      const remainingDaysRes = await getNextRewardRemainingEpoch()
      setRemainingDays(remainingDaysRes)

      const grandTotalAmountRes = await getGrandTotalAmount()
      setGrandTotalAmt(grandTotalAmountRes)

      const data = await getLiquidityInfo(wallet?.address)
      // console.log(data, "this1")
      setStakedAmount(stakedAmountRes)
      setLoading(false)
      setPools([
        {
          id: 1,
          name: "CHECKR/EGLD",
          token0: "CHECKR",
          token1: "EGLD",
          liquidity: [data.liquidity.checkr, data.liquidity.egld],
          apr: data.apr,
          volume24h: data.volume24h,
          userPair: [data.userPair.checkr, data.userPair.egld],
          userLpToken: data.userLpToken
        }
      ])
    } catch (e) {
      console.log(e, "from here")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet?.address])

  useEffect(() => {
    handleData()
  }, [wallet?.address, isSuccessful])

  return (
    <div className="">
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="py-2 inline-block min-w-full">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="">
                  <tr>
                    {cols.map((col, index) => (
                      <th
                        key={col}
                        scope="col"
                        className={`${
                          index === 0
                            ? "rounded-l-xl"
                            : index === cols.length - 1
                            ? "rounded-r-xl"
                            : ""
                        } bg-neutral-50 text-sm font-medium text-neutral-600 px-8 py-5 text-left`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pools.map((pool) => (
                    <StakedPoolItem
                      pool={pool}
                      key={pool.id}
                      stakedAmount={stakedAmount}
                      modalHandler={modalHandler}
                      claimRewards={claimRewards}
                      remainingRewards={remainingRewards}
                      remainingDays={remainingDays}
                      grandTotalAmt={grandTotalAmt}
                    />
                  ))}

                  {/* {pools.map((pool) => (
                    <>
                      <tr
                        key={pool.id}
                        className={`${
                          activePool !== pool.id && "border-b border-separator"
                        } text-neutral-900 font-medium`}
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
                        <td className="text-base font-light px-8 py-4 whitespace-nowrap">
                          <div className="flex flex-col justify-center">
                            <div className="flex items-center gap-2 font-medium">
                              <Token
                                symbol={pool.token0}
                                className="transform scale-75"
                              />
                              <span>{pool.liquidity[0]}</span>
                            </div>
                            <div className="flex items-center gap-2 font-medium">
                              <Token
                                symbol={pool.token1}
                                className="transform scale-75"
                              />
                              <span>{pool.liquidity[1]}</span>
                            </div>
                          </div>
                        </td>
                        <td className="text-base px-8 py-4 whitespace-nowrap">
                          <div className="flex items-center">{pool.apr}</div>
                        </td>
                        <td className="text-base px-8 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {pool.volume24h}
                          </div>
                        </td>
                        <td className="text-base px-8 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-between">
                            <a
                              href={
                                "https://xexchange.com/liquidity/add?firstToken=CHECKR-60108b&secondToken=EGLD"
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Button
                                title="Add Liquidity"
                                className="bg-primary-500"
                                startIcon={<LinkOutIcon className="h-4 w-4" />}
                                titleClassName="text-sm font-medium text-white"
                              />
                            </a>
                            <div
                              className="p-2 cursor-pointer ml-4"
                              onClick={() => {
                                if (activePool === pool.id) {
                                  setActivePool(null)
                                } else {
                                  setActivePool(pool.id)
                                }
                              }}
                            >
                              <ChevronDownIcon
                                className={`${
                                  activePool === pool.id
                                    ? "transform rotate-180"
                                    : ""
                                } h-4 w-4`}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                      {activePool === pool.id && (
                        <tr className="text-neutral-900 font-medium">
                          <td
                            colSpan={cols.length}
                            className="whitespace-nowrap text-base font-medium bg-white"
                          >
                            <div className="flex items-center mt-2 px-8 pt-6 pb-10 border border-separator rounded-lg w-full gap-64">
                              <div className="flex flex-col justify-start gap-8 w-full">
                                <div className="flex items-start gap-32 w-full">
                                  <div className="flex flex-col items-start gap-2">
                                    <span className="text-xs text-neutral-600 font-medium">
                                      Your Liquidity
                                    </span>
                                    <div className="flex flex-col justify-center">
                                      <div className="flex items-center gap-2 font-medium">
                                        <Token
                                          symbol={pool.token0}
                                          className="transform scale-75"
                                        />
                                        <span>{pools[0].userPair[0]}</span>
                                      </div>
                                      <div className="flex items-center gap-2 font-medium">
                                        <Token
                                          symbol={pool.token1}
                                          className="transform scale-75"
                                        />
                                        <span>{pools[0].userPair[1]}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-start gap-2">
                                    <span className="text-xs text-neutral-600 font-medium">
                                      LP Token
                                    </span>
                                    <span className="text-2xl text-neutral-900">
                                      {abbreviateNumber(pools[0].userLpToken)}
                                    </span>
                                  </div>
                                  <div className="flex flex-col items-start gap-2">
                                    <span className="text-xs text-neutral-600 font-medium">
                                      Staked
                                    </span>
                                    <span className="text-2xl text-neutral-900">
                                      {abbreviateNumber(stakedAmount)}
                                    </span>
                                  </div>
                                  <div className="flex flex-col items-start gap-2">
                                    <span className="text-xs text-neutral-600 font-medium">
                                      Unclaimed
                                    </span>
                                    <span className="text-2xl text-neutral-900">
                                      {abbreviateNumber(remainingRewards)}{" "}
                                      CHECKR
                                    </span>
                                  </div>
                                  <div className="flex flex-col items-start gap-2">
                                    <span className="text-xs text-neutral-600 font-medium">
                                      Next Reward in
                                    </span>
                                    <span className="text-2xl text-neutral-900">
                                      {remainingDays === "0"
                                        ? "Today"
                                        : `${remainingDays} days`}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-4 items-center">
                                  <Button
                                    title="Harvest"
                                    disabled={remainingRewards === "0"}
                                    onClick={() => {
                                      claimRewards({})
                                    }}
                                  />
                                  <Button
                                    title="Stake"
                                    variant="outlined"
                                    disabled={
                                      pools[0].userLpToken.toString() === "0"
                                    }
                                    onClick={() => {
                                      modalHandler({
                                        show: true,
                                        liquidityInfo: pool,
                                        type: "stake"
                                      })
                                    }}
                                    className="outline-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white"
                                    startIcon={<LockIcon className="h-4 w-4" />}
                                  />
                                  <Button
                                    title="Unstake"
                                    variant="outlined"
                                    disabled={stakedAmount === "0"}
                                    onClick={() => {
                                      modalHandler({
                                        show: true,
                                        liquidityInfo: pool,
                                        stakedAmount,
                                        type: "unstake"
                                      })
                                    }}
                                    className="outline-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white"
                                    startIcon={
                                      <UnlockIcon className="h-4 w-4" />
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))} */}

                  {loading && pools.length === 0 && (
                    <LoadingPoolItems colsLength={cols.length} />
                  )}
                  {!loading && stakedAmount === "0" && (
                    <tr className="text-neutral-900 font-medium">
                      <td
                        colSpan={cols.length}
                        className="whitespace-nowrap text-sm font-medium bg-white"
                      >
                        <div className="flex items-center justify-center mt-2 px-8 pt-6 pb-10 border-b border-separator w-full">
                          No staked pools
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
