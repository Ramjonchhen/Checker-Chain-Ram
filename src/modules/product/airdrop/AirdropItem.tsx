import dayjs from "lib/dateLib"
import React, { useEffect } from "react"
import { AirDrop } from "./AirdropList"
import AirdropImage from "assets/images/airdrop/dropped.svg"
import { Button } from "components"
import { useProductAirdropContract } from "hooks/useProductAirdropContract"
import { useProductStore } from "stores/product"
import toast from "react-hot-toast"
import { useWallet } from "hooks/useWallet"

interface AirdropItemProps {
  airdrop: AirDrop
}

export const AirdropItem: React.FC<AirdropItemProps> = ({ airdrop }) => {
  const {
    claimAirdrop,
    isCancelled,
    isFailed,
    isSuccessful,
    checkClaimStatus,
    getAirdrop,
    rescueToken
  } = useProductAirdropContract()
  const { product } = useProductStore()
  const [alreadyClaimed, setAlreadyClaimed] = React.useState(false)
  const [claimedAmount, setClaimedAmount] = React.useState(0)
  const { wallet } = useWallet()

  const [timeStatus, setTimeStatus] = React.useState("")

  useEffect(() => {
    if (airdrop.reward && wallet?.address) {
      checkClaimStatus(wallet?.address, airdrop.reward.airdropId).then(
        (status) => {
          setAlreadyClaimed(!!status)
        }
      )
    }
  }, [wallet?.address, airdrop])

  useEffect(() => {
    const interval = setInterval(() => {
      if (airdrop.startDate && airdrop.endDate) {
        const start = dayjs(airdrop.startDate)
        const end = dayjs(airdrop.endDate)
        const now = dayjs()
        if (now.isBefore(start)) {
          setTimeStatus(start.fromNow())
        }
        if (now.isAfter(start) && now.isBefore(end)) {
          if (dayjs.duration(end.diff(now)).days() > 0) {
            setTimeStatus(
              "Ends in " + dayjs.duration(end.diff(now)).days() + " days"
            )
            clearInterval(interval)
          } else
            setTimeStatus(
              "Ends in " +
                dayjs.duration(end.diff(now)).hours().toString().padStart(2) +
                ":" +
                dayjs.duration(end.diff(now)).minutes() +
                ":" +
                dayjs.duration(end.diff(now)).seconds()
            )
        }
        if (now.isAfter(end)) {
          setTimeStatus("Ended on " + end.format("DD MMM YYYY"))
          clearInterval(interval)
          airdrop.reward &&
            getAirdrop(airdrop.reward.airdropId).then((value) => {
              if (value) {
                setClaimedAmount(value.totalClaimed)
              }
            })
        }
      }
    }, 1000)
    return () => interval && clearInterval(interval)
  }, [airdrop.startDate, airdrop.endDate])

  React.useEffect(() => {
    if (isCancelled) {
      toast.error("Claim airdrop cancelled")
    } else if (isFailed) {
      toast.error("Claim airdrop failed")
    } else if (isSuccessful) {
      toast.success("Claim successful")
    }
  }, [isCancelled, isFailed, isSuccessful])
  return (
    <div className="flex justify-between items-center bg-airdrop-gradient px-6 py-4 my-4 rounded-md">
      <div className="flex flex-col gap-[13px]">
        <p className="text-primary-700 text-lg font-bold">{airdrop.title}</p>
        <p className="bg-neutral-200 text-white px-4 w-40 text-center">
          {timeStatus}
        </p>
      </div>
      <div>
        <AirdropImage />
      </div>
      <div>
        <p className="text-neutral-600 text-[10px] leading-[12px]">
          Total Airdrop Amount
        </p>
        <p className="text-base font-semibold">
          <span className="text-neutral-900 ">
            {((airdrop.amount || 0) * 0.99)?.toFixed(2)}
          </span>{" "}
          <span className="text-neutral-200">CHECKR</span>
        </p>
      </div>
      <div className="flex justify-center gap-4">
        <Button
          disabled={
            !airdrop.reward ||
            alreadyClaimed ||
            dayjs().isAfter(airdrop.endDate)
          }
          title={alreadyClaimed ? "Claimed" : "Claim"}
          onClick={() => {
            !!airdrop.reward &&
              claimAirdrop({
                ...airdrop.reward
              })
          }}
        />
        {product.isOwner &&
          dayjs().isAfter(airdrop.endDate) &&
          claimedAmount < (airdrop.amount || 0) * 0.99 && (
            <Button
              className="bg-success"
              title="Withdraw"
              onClick={() => {
                !!airdrop.reward &&
                  rescueToken({
                    amount: (airdrop.amount || 0) * 0.99 - claimedAmount,
                    airdropId: airdrop.reward.airdropId
                  })
              }}
            />
          )}
      </div>
    </div>
  )
}
