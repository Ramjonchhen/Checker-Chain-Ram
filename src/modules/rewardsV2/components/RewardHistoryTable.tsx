import React from "react"
import { IRewardHistory } from "stores/rewards"
import dayjs from "lib/dateLib"
import { abbreviateNumber } from "utils/getLiquidityInfo"

type Props = {
  history?: IRewardHistory[]
}

const findReward = (historyItem: IRewardHistory, type: string): string => {
  const rewardItem = historyItem?.rewards?.find((item) => item.type === type)
  if (rewardItem) {
    return abbreviateNumber(rewardItem.reward)
  }

  return "N/A"
}

const RewardHistoryTable = ({ history = [] }: Props) => {
  return (
    <div className="mt-[71px]">
      <div className="flex flex-row justify-between items-center">
        <div className="text-[#1D1D1F] text-lg font-medium">Reward History</div>
        {/* <div>Calendar Picker will be here</div> */}
      </div>
      <div className="w-full overflow-x-auto mt-4">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-[#EBF0F3] border border-[#EAEAEA] text-[#1D1D1F] text-sm font-medium leading-[38px]">
              <th className="text-left px-4 py-2">Epoch</th>
              <th className="text-left px-4 py-2">Date and Time</th>
              <th className="text-left px-4 py-2">Poster (CHECKR)</th>
              <th className="text-left px-4 py-2">Reviewer (CHECKR)</th>
              <th className="text-left px-4 py-2">Influencer (CHECKR)</th>
            </tr>
          </thead>
          <tbody>
            {history.map((historyItem, historyIdx) => (
              <>
                <tr
                  key={`$${historyIdx}`}
                  className="border border-[#EAEAEA] text-[#1D1D1F] text-xs font-normal leading-6"
                >
                  <td className="text-center px-4 py-2 text-black text-sm leading-[38px]">
                    {historyItem.epoch}
                  </td>
                  <td className="text-left px-4 py-2 text-black text-sm leading-[38px]">
                    {dayjs(historyItem.date).format(
                      "MMM DD, YYYY [at] hh:mm a"
                    )}{" "}
                    asd
                  </td>
                  <td className="text-center px-4 py-2">
                    {findReward(historyItem, "posterReward")}
                  </td>
                  <td className="text-center px-4 py-2">
                    {findReward(historyItem, "profileReward")}
                  </td>
                  <td className="text-center px-4 py-2">
                    {findReward(historyItem, "cpReward")}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RewardHistoryTable
