import { LinkOutIcon } from "assets/icons"
import { Button } from "components"
import { getNetwork } from "config"
import { useUserStore } from "stores"
import { useRewardStore } from "stores/rewards"
import { useToastStore } from "stores/toast"


const network = getNetwork()

const LButton = ()=>{
  const { airdropToken} = useRewardStore(
    (state) => state
  )
  const {  user } = useUserStore((state) => state)
  const { successToast, errorToast } = useToastStore()


  const airdrop = async () => {
    const res = await airdropToken(user.wallet, true)
    if (res.status === "success") {
      successToast({
        message: "Test Liquidity Added Successfully"
      })
    } else if (res.status === "error") {
      errorToast({
        message: res.message
      })
    } else {
      errorToast({
        message: "Something went wrong"
      })
    }
  }

return <Button
title="Add Liquidity"
className="bg-primary-500"
startIcon={<LinkOutIcon className="h-4 w-4" />}
titleClassName="text-sm font-medium text-white"
onClick={(e) => {
  e.stopPropagation()
  if(network.chainID === "D") {
    airdrop()
  }
}}
/>};

const LiquidityBtn = () => network.chainID === "1" ? (
  <a
    href={
      "https://xexchange.com/liquidity?firstToken=CHECKR-60108b&secondToken=EGLD"
    }
    target="_blank"
    rel="noreferrer"
  >
    <LButton/>
  </a>
): (
  <LButton/>
)

export default LiquidityBtn
