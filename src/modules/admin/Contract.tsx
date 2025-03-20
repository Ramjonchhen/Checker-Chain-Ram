/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendTransactions } from "lib/dApp-core"
import {
  AbiRegistry,
  Address,
  BigUIntValue,
  BytesValue,
  ContractFunction,
  SmartContract
} from "lib/dApp-js"

import { useState } from "react"
import BigNumber from "bignumber.js"
import { Button, Input } from "components"
import { getNetwork } from "config"
import { abi } from "abis/airdrop.abi"
import { useReward } from "hooks/useReward"
import { useFarmingContract } from "hooks/useFarmingContract"
import { useProductContract } from "hooks/useProductContract"
import { useVestingContract } from "hooks/useVestingContract"
import { useWallet } from "hooks/useWallet"

const network = getNetwork()
const contractAddress = network.rewardContract

export const Contract = () => {
  const [epoch, setEpoch] = useState("")
  const [root, setRoot] = useState("")
  const [withdrawCheckerAmount, setWithdrawCheckerAmount] = useState(0)
  const [checkData, setCheckData] = useState<any>({})
  const [checkRoot, setCheckRoot] = useState<any>("")
  const [round, setRound] = useState(1)
  const [creatorFee, setCreatorFee] = useState(0)
  const [isClaimFee, setIsClaimFee] = useState(false)
  const [vestingWalletId, setVestingWalletId] = useState("")
  const { checkReward } = useReward()
  const { wallet } = useWallet()

  const { addVestingWallet, removeVestingWallet, createVestingSchedule } =
    useVestingContract()

  const setEpochRoot = async () => {
    console.debug(epoch, root)
    const abiRegistry = AbiRegistry.create(abi)
    const contract = new SmartContract({
      address: new Address(contractAddress),
      abi: abiRegistry
    })

    const callTransactionOne: any = contract.call({
      caller: new Address(wallet.address),
      func: new ContractFunction("set_epoch_root"),
      gasLimit: 10000000,
      args: [
        new BigUIntValue(new BigNumber(epoch)),
        BytesValue.fromHex(root?.replace("0x", ""))
      ],
      chainID: network.chainID
    })
    await sendTransactions({
      transactions: callTransactionOne
    })
  }

  const withdrawChecker = async () => {
    const abiRegistry = AbiRegistry.create(abi)
    const contract = new SmartContract({
      address: new Address(contractAddress),
      abi: abiRegistry
    })

    const callTransactionOne: any = contract.call({
      caller: new Address(wallet.address),
      func: new ContractFunction("claim_checkr"),
      gasLimit: 10000000,
      args: [new BigUIntValue(new BigNumber(withdrawCheckerAmount * 1e5))],
      chainID: network.chainID
    })
    await sendTransactions({
      transactions: callTransactionOne
    })
  }

  const withdrawEgld = async () => {
    const abiRegistry = AbiRegistry.create(abi)
    const contract = new SmartContract({
      address: new Address(contractAddress),
      abi: abiRegistry
    })

    const callTransactionOne: any = contract.call({
      caller: new Address(wallet.address),
      func: new ContractFunction("claim_egld"),
      gasLimit: 10000000,
      args: [],
      chainID: network.chainID
    })
    await sendTransactions({
      transactions: callTransactionOne
    })
  }

  const {
    startFarming,
    setCurrentRound,
    getAddressState,
    getFarmingState,
    totalStakedAmount
  } = useFarmingContract()

  const {
    updateClaimFee,
    updateCreatorFee,
    getClaimBrandFee,
    getCreateBrandFee
  } = useProductContract()

  return (
    <div className="merkle-root">
      <h1 className="text-2xl font-bold mb-4">Product Contract</h1>
      <input
        type="number"
        placeholder="creator/claim fee"
        value={creatorFee}
        onChange={(e) => setCreatorFee(Number(e.target.value))}
      />
      <div className="flex gap-2 flex-wrap">
        <Button
          className="btn btn-primary mt-2"
          onClick={() => {
            if (creatorFee) {
              updateCreatorFee({ fee: creatorFee })
            }
          }}
          disabled={isClaimFee}
        >
          Update Creator Fee
        </Button>
        <Button
          className="btn btn-primary mt-2"
          onClick={() => {
            if (creatorFee) {
              updateClaimFee({ fee: creatorFee })
            }
          }}
          disabled={!isClaimFee}
        >
          Update Claim Fee
        </Button>

        <Button
          className="btn btn-primary mt-2"
          onClick={async () => {
            const fee = await getCreateBrandFee()
            setCreatorFee(fee)
            setIsClaimFee(false)
          }}
        >
          getCreateBrandFee
        </Button>

        <Button
          className="btn btn-primary mt-2"
          onClick={async () => {
            const fee = await getClaimBrandFee()
            setCreatorFee(fee)
            setIsClaimFee(true)
          }}
        >
          getClaimBrandFee
        </Button>
      </div>

      <h1 className="text-2xl font-bold mb-4">Reward Contract</h1>
      <input
        type="text"
        placeholder="epoch"
        onChange={(e) => setEpoch(e.target.value)}
      />
      <input
        className="mt-2"
        type="text"
        placeholder="root"
        onChange={(e) => setRoot(e.target.value)}
      />
      <Button
        className="btn btn-primary mt-2"
        onClick={() => {
          if (epoch && root) {
            setEpochRoot()
          }
        }}
      >
        Set Epoch
      </Button>
      <textarea
        className="mt-4"
        placeholder="check data (json)"
        onChange={(e) => setCheckData(e.target.value)}
      />
      <input
        className="mt-2"
        type="text"
        placeholder="root"
        onChange={(e) => setCheckRoot(e.target.value)}
      />
      <Button
        className="btn btn-primary mt-2"
        onClick={() => {
          let data
          try {
            data = JSON.parse(checkData)
          } catch (e) {
            console.debug(e)
            alert("invalid json")
            return
          }
          if (!data.amount || !data.wallet || !data.proof || !data.index) {
            alert("missing required data")
            return
          }
          if (!checkRoot) {
            alert("missing root")
            return
          }
          checkReward({
            root: checkRoot,
            amount: data.amount,
            wallet: data.wallet,
            proofs: data.proof,
            index: data.index
          })
        }}
      >
        Check reward claim ( devnet )
      </Button>
      <input
        type="text"
        className="mt-4"
        placeholder="amount"
        onChange={(e) => setWithdrawCheckerAmount(Number(e.target.value))}
      />
      <Button
        className="btn btn-primary mt-2"
        onClick={() => {
          withdrawChecker()
        }}
      >
        Withdraw Checker
      </Button>
      <Button
        className="btn btn-primary mt-4"
        onClick={() => {
          withdrawEgld()
        }}
      >
        Withdraw Egld
      </Button>
      <h1 className="text-2xl font-bold my-4">Farming Contract</h1>
      <Button
        className="btn btn-primary mt-2"
        title="Start Farming"
        onClick={() => {
          startFarming()
        }}
      />
      <Input
        className="mt-2"
        type="number"
        placeholder="round"
        onChange={(e) => setRound(Number(e.target.value))}
      />
      <Button
        className="btn btn-primary mt-2"
        title="Set Current Round"
        onClick={() => {
          setCurrentRound(round)
        }}
      />
      <Button
        className="btn btn-primary mt-2"
        title="getAddressState"
        onClick={() => {
          getAddressState(
            "erd1nf5xt3ceeqe5zhnkh59kjmr55x9kn4ymnjluwen7vnc0g0zn9w2q0djpj3"
          )
          getFarmingState()
        }}
      />
      <Button
        className="btn btn-primary mt-2"
        title="totalStakedAmount"
        onClick={() => {
          totalStakedAmount(2)
        }}
      />

      <h1 className="text-2xl font-bold mt-2">Vesting Contract</h1>
      <Input
        className="mt-2"
        placeholder="Wallet address"
        onChange={(e) => setVestingWalletId(e.target.value)}
      />
      <div className="flex gap-2">
        <Button
          className="btn btn-primary mt-2"
          title="Add Vesting Wallet"
          onClick={() => {
            addVestingWallet({
              walletAddress: vestingWalletId
            })
          }}
        />
        <Button
          className="btn btn-primary mt-2"
          title="Remove Vesting Wallet"
          onClick={() => {
            removeVestingWallet({
              walletAddress: vestingWalletId
            })
          }}
        />
        <Button
          className="btn btn-primary mt-2"
          title="Create Vesting Schedule with Above Wallet ID"
          onClick={() => {
            createVestingSchedule({
              walletAddress: vestingWalletId
            })
          }}
        />
      </div>
    </div>
  )
}
