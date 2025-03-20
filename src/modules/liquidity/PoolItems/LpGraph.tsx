import { ArrowDownLeftIcon, ChevronDownIcon } from "assets/icons"
import axios from "axios"
import { Button } from "components"
import { Token } from "modules/token"
import { useEffect, useState } from "react"
import { largeNumberFormater } from "utils/helper"
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryVoronoiContainer
} from "victory"

type Props = {
  minimizeGraphHandler: () => void
  harvestHandler: () => void
  isHarvestBtnDisabled: boolean
  remainingRewards: string
}

const data = [
  { x: 1, y: 2 },
  { x: 2, y: 3 },
  { x: 3, y: 5 },
  { x: 4, y: 4 },
  { x: 5, y: 7 }
]

const LpGraph = ({
  minimizeGraphHandler,
  harvestHandler,
  isHarvestBtnDisabled,
  remainingRewards
}: Props) => {
  const [price, egldPrice] = useState(0);
  const [checkerPrice, setCheckerPrice] = useState(0);
  useEffect(() => {
    axios.get("https://api.coingecko.com/api/v3/simple/price?ids=elrond-erd-2,checkerchain&vs_currencies=usd").then((res) => {
      egldPrice(res.data["elrond-erd-2"].usd);
      setCheckerPrice(res.data["checkerchain"].usd);
    })
  }, [])
  return (
    <div
      className="w-[220px] h-[273px] bg-white rounded-xl p-2 pb-3"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <div className="w-[32px] h-[32px] grid place-items-center bg-white border border-separator rounded-[50%]">
              <Token symbol="EGLD" className="scale-75" />
            </div>
          </div>
          <div>
            <div className="text-[10px] font-medium leading-4 text-neutral-400">
              EGLD Price
            </div>
            <div className="text-xl font-medium leading-6 tracking-[0.02em] text-neutral-900">
              ${price}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={minimizeGraphHandler}
          className="p-0 m-0 h-7 w-7 bg-white rounded border-[0.4px] border-separator shadow-sm grid place-items-center"
        >
          <ChevronDownIcon className="rotate-180 scale-75" />
        </button>
      </div>
      <div className="h-[120px]">
        <VictoryChart
          containerComponent={
            <VictoryVoronoiContainer
              labels={({ datum }) => `${datum.x}, ${datum.y}`}
            />
          }
        >
          <VictoryLine
            data={data}
            interpolation="natural"
            style={{
              data: { stroke: "#c43a31" }
            }}
          />
          <VictoryAxis
            style={{
              axis: { stroke: "transparent" },
              ticks: { stroke: "transparent" },
              tickLabels: { fill: "transparent" }
            }}
          />
        </VictoryChart>
      </div>
      <div className="text-[10px] font-medium leading-4 tracking-[0.01em] text-neutral-400">
        Claimable Rewards
      </div>
      <div className="flex justify-between items-center">
        <div className="font-medium text-neutral-900 text-base leading-6">
          {largeNumberFormater(Number(remainingRewards))}{" "}
          <span className="text-neutral-400 text-[10px] leading-4">Tokens</span>
        </div>
        <div className="text-xs text-neutral-600 tracking-[0.01em] leading-4 font-medium">
          ($ {(checkerPrice * Number(remainingRewards)).toFixed(2)})
        </div>
      </div>
      <div className="mt-4">
        <Button
          title="Harvest"
          variant="default"
          onClick={harvestHandler}
          disabled={isHarvestBtnDisabled}
          className="w-full"
          startIcon={<ArrowDownLeftIcon className="h-4 w-4" />}
        />
      </div>
    </div>
  )
}

export default LpGraph
