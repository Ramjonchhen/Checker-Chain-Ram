import { useFarmingContract } from "hooks/useFarmingContract"
import { useWallet } from "hooks/useWallet"
import { useEffect, useState, FC, useCallback } from "react"
import { getLiquidityInfo } from "utils/getLiquidityInfo"
import { ILPModalHandler, LiquidityInfo } from "modules/liquidity/liquidity"
import AllPoolItem from "modules/liquidity/PoolItems/AllPoolItem"
import LoadingPoolItems from "modules/liquidity/PoolItems/LoadingPoolItems"

export const AllPools: FC<{
  modalHandler: (modalProps: ILPModalHandler) => void
}> = ({ modalHandler }) => {
  const cols = ["Pool", "Liquidity", "APR", "Volume (24h)", ""]
  const [pools, setPools] = useState<LiquidityInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [remainingRewards, setRemainingRewards] = useState("0")

  const [stakedAmount, setStakedAmount] = useState("0")
  const { wallet } = useWallet()

  const {
    getStakedAmount,
    isSuccessful,
    claimRewards,
    calculateRemainingRewards
  } = useFarmingContract()

  const handleData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getLiquidityInfo(wallet?.address)
      const res = await getStakedAmount(wallet?.address)
      setStakedAmount(res)
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
      console.log(e)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet?.address, isSuccessful])

  const handleGETRemaningRewards = async () => {
    try {
      const remaingRewardsRes = await calculateRemainingRewards(wallet?.address)
      // console.log('remaining' ,remaingRewardsRes);
      setRemainingRewards(remaingRewardsRes.toString())
    } catch (err) {
      console.log(err, "err")
    }
  }

  useEffect(() => {
    if (wallet?.address) {
      handleGETRemaningRewards()
    }
  }, [wallet?.address])

  useEffect(() => {
    if (isSuccessful) {
      handleData()
    }
  }, [isSuccessful])

  useEffect(() => {
    handleData()
  }, [wallet?.address])

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
                        key={index}
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
                  {pools.map((pool, index) => (
                    <AllPoolItem
                      key={`allpool${index}`}
                      pool={pool}
                      stakedAmount={stakedAmount}
                      modalHandler={modalHandler}
                      claimRewards={claimRewards}
                      remainingRewards={remainingRewards}
                    />
                  ))}

                  {loading && pools.length === 0 && (
                    <LoadingPoolItems colsLength={cols.length} />
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
