/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react"
import { Modal, Input, Button } from "components"
import { LiquidityInfo } from "./liquidity"
import { useForm } from "react-hook-form"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useFarmingContract } from "hooks/useFarmingContract"
import { IconButton } from "components/iconButton"
import { getNetwork } from "config"
import BigNumber from "bignumber.js"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  liquidityInfo?: LiquidityInfo
  stakedAmount?: string
}

const network = getNetwork()

export const UnstakeModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  liquidityInfo,
  stakedAmount
}) => {
  const validationSchema: any = Yup.object().shape({
    amount: Yup.string()
      .required("Amount is required")
      .test("amount-not-zero", "Amount must be greater than 0", (value) => {
        return Number(value) > 0
      })
  })
  const {
    formState: { errors },
    handleSubmit,
    setValue,
    trigger,
    getValues,
    reset
  } = useForm<{
    amount: string
  }>({
    mode: "all",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      amount: ""
    }
  })

  const { exitFarming, isCancelled, isFailed, isSuccessful, isPending } =
    useFarmingContract()

  useEffect(() => {
    if (isCancelled || isFailed || isSuccessful || isPending) {
      reset()
      onClose()
    }
  }, [isCancelled, isFailed, isSuccessful, onClose, reset, isPending])

  const onSubmit = (data: any) => {
    exitFarming({
      amount: parseInt(
        (Number(data.amount) * 10 ** network.pairTokenDecimal).toString()
      )
    })
  }

  return (
    <Modal
      display={isOpen}
      onHide={() => {
        reset()
        onClose()
      }}
      dismissable
      closeButton
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>Unstake {liquidityInfo?.name}</div>

        <Input
          type="number"
          label="Amount"
          error={!!errors.amount}
          helper={errors.amount?.message}
          value={getValues("amount")?.toString()}
          onChange={(e) => {
            const target = e.target as HTMLInputElement

            setValue("amount", target.value)
            trigger("amount")
          }}
          isNotCopy
          endIcon={
            <IconButton
              type="button"
              className="bg-primary text-white hover:bg-transparent hover:text-primary hover:border-2 hover:border-primary rounded-md rounded-tl-none rounded-bl-none w-20 h-10"
              onClick={() => {
                setValue("amount", BigNumber(stakedAmount ?? 0).toFixed())

                trigger("amount")
              }}
              icon={<div>Max</div>}
            />
          }
        />

        <Button title="Submit" type="submit" className="mt-4" />
      </form>
    </Modal>
  )
}
