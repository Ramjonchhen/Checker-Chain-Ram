/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendTransactions } from "lib/dApp-core"
import {
  AbiRegistry,
  Address,
  AddressValue,
  ArrayVec,
  ArrayVecType,
  BigUIntValue,
  BytesValue,
  // BytesValue,
  ContractFunction,
  List,
  ListType,
  Query,
  SmartContract,
  U8Type,
  U8Value
} from "lib/dApp-js"
import BigNumber from "bignumber.js"
import { getNetwork } from "config"
import { Reward } from "stores/rewards"
import { abi } from "abis/airdrop.abi"
import * as CheckAbi from "abis/airdropCheck.abi"

import { proxyNetworkProvider as proxy } from "lib/dApp-network-js"
import { useWallet } from "./useWallet"

const network = getNetwork()
const contractAddress = network.rewardContract

export const formatHexToU8 = (hex: any) => {
  const _hex = hex.toString().replace("0x", "")
  const data = Buffer.from(_hex, "hex")
  const u8Array: any[] = []
  data.forEach((d: any) => {
    u8Array.push(new U8Value(d))
  })
  return u8Array
}

export const formProofs = (list: any) => {
  const proofs: any = []
  list.forEach((proof: any) => {
    const arrangedProof = new ArrayVec(
      new ArrayVecType(32, new U8Type()),
      formatHexToU8(proof)
    )
    proofs.push(arrangedProof)
  })
  return new List(new ListType(new ArrayVecType(32, new U8Type())), proofs)
}

export const useReward = () => {
  const { wallet } = useWallet()

  const checkClaimStatus = async (wallet: string, epoch: number) => {
    try {
      let a = 0
      const query = new Query({
        address: new Address(contractAddress),
        func: new ContractFunction("getClaimStatus"),
        args: [
          new AddressValue(new Address(`${wallet}`)),
          new BigUIntValue(new BigNumber(epoch))
        ]
      })
      const { returnData } = await proxy.queryContract(query)
      if (returnData.length === 0) {
        return false
      }
      const isClaimed =
        "01" === Buffer.from(returnData[0], "base64").toString("hex", a, (a += 1))
      return isClaimed
    }
    catch (err) {
      console.log(err)
    }

  }

  const claimAirdrop = async (reward: Reward) => {
    const abiRegistry = AbiRegistry.create(abi)
    const contract = new SmartContract({
      address: new Address(contractAddress),
      abi: abiRegistry
    })
    // console.debug(reward)
    const callTransactionOne: any = contract.call({
      caller: new Address(wallet.address),

      func: new ContractFunction("claim"),
      gasLimit: 100000000,
      args: [
        formProofs(reward.proof),
        new BigUIntValue(new BigNumber(reward.index)),
        new BigUIntValue(new BigNumber(reward.amount)),
        new BigUIntValue(new BigNumber(reward.epoch))
      ],
      chainID: network.chainID
    })
    await sendTransactions({
      transactions: callTransactionOne
    })
  }

  const checkReward = async (data: {
    root: string
    wallet: string
    proofs: string[]
    amount: string | number
    index: string | number
  }) => {
    const abiRegistry = AbiRegistry.create(CheckAbi.abi)
    const contract = new SmartContract({
      address: new Address(
        "erd1qqqqqqqqqqqqqpgqlxwnc2vj4jzh5y3z0vts52zld8k4csrhth5scgqkpy"
      ),
      abi: abiRegistry
    })
    const tx: any = contract.call({
      caller: new Address(wallet.address),
      func: new ContractFunction("check"),
      gasLimit: 100000000,
      args: [
        BytesValue.fromHex(data.root.replace("0x", "")),
        new AddressValue(new Address(data.wallet)),
        formProofs(data.proofs),
        new BigUIntValue(new BigNumber(data.amount)),
        new BigUIntValue(new BigNumber(data.index))
      ],
      chainID: network.chainID
    })
    await sendTransactions({
      transactions: tx
    })
  }

  return {
    checkClaimStatus,
    claimAirdrop,
    checkReward
  }
}
