/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"

import {
  useTrackTransactionStatus,
  sendTransactions
} from "lib/dApp-core/index"

import { vestingAbi } from "abis/vesting.abi"
import { getNetwork } from "config"
import {
  AbiRegistry,
  Address,
  AddressValue,
  ContractFunction,
  SmartContract,
  TokenPayment,
  Query,
  ResultsParser,
  BigUIntValue,
  ArrayVec,
  U8Type,
  ArrayVecType
} from "lib/dApp-js"
import { proxyNetworkProvider as proxy } from "lib/dApp-network-js"
import BigNumber from "bignumber.js"
import { IVestingData } from "modules/vesting"
import axios from "axios"
import { useWallet } from "./useWallet"
import keccak256 from "keccak256"
import { numberToHex } from "utils/helper"
import { formatHexToU8 } from "./useReward"

// eslint-disable-next-line @typescript-eslint/no-var-requires

const network = getNetwork()

const contractAddress = network.vestingContract
const abiRegistry = AbiRegistry.create(vestingAbi)
const contract = new SmartContract({
  address: new Address(contractAddress),
  abi: abiRegistry
})

const identifier = network.tokenId
const decimal = network.tokenDecimal


export const useVestingContract = () => {
  const [sid, setSid] = useState<string | null>("")
  const { wallet } = useWallet()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isCancelled, isPending, isSuccessful, isFailed } =
    useTrackTransactionStatus({
      transactionId: sid
    })

  useEffect(() => {
    if (isSuccessful || isFailed || isCancelled) {
      setTimeout(() => {
        setSid(null)
      }, 1000)
    }
  }, [isSuccessful, isFailed, isCancelled])

  const tempPayAmt = 50

  const createVestingSchedule = async ({
    walletAddress
  }: {
    walletAddress: string
  }) => {
    const epochData = await getEpochData()
    const beneficiary = walletAddress
    const start = epochData.epoch
    const cliff = epochData.epoch + 1
    const duration = 200 //200
    const revocable = true

    const vestingScheduleArguments = [
      beneficiary,
      start,
      cliff,
      duration,
      revocable
    ]

    const tx = contract.methods
      .create_vesting_schedule(vestingScheduleArguments)
      .withChainID(network.chainID)
      .withGasLimit(100000000)
      .withSender(new Address(wallet.address))
      .withSingleESDTTransfer(
        TokenPayment.fungibleFromAmount(identifier, tempPayAmt, decimal)
      )
      .buildTransaction()

    const { sessionId } = await sendTransactions({
      transactions: tx
    })

    return sessionId
  }

  const addVestingWallet = async ({
    walletAddress
  }: {
    walletAddress: string
  }) => {
    const tx: any = contract.call({
      caller: new Address(wallet.address),
      func: new ContractFunction("add_contract"),
      gasLimit: 100000000,
      args: [new AddressValue(new Address(walletAddress))],
      chainID: network.chainID
    })
    await sendTransactions({
      transactions: tx
    })
  }

  const removeVestingWallet = async ({
    walletAddress
  }: {
    walletAddress: string
  }) => {
    const tx: any = contract.call({
      caller: new Address(wallet.address),
      func: new ContractFunction("remove_contract"),
      gasLimit: 100000000,
      args: [new AddressValue(new Address(walletAddress))],
      chainID: network.chainID
    })
    await sendTransactions({
      transactions: tx
    })
  }

  const getHoldersCount = async (wallet: string) => {
    try {
      const query = new Query({
        address: new Address(contractAddress),
        func: new ContractFunction("holdersCount"),
        args: [new AddressValue(new Address(`${wallet}`))]
      })
      const result = await proxy.queryContract(query)
      const parser = new ResultsParser()

      const data = parser.parseQueryResponse(
        result,
        contract.getEndpoint("holdersCount")
      )
      if (data.values[0]) {
        return data.values[0]?.toString() ?? "0"
      }
    }
    catch (e) {
      return null
    }
    return null
  }

  const getTotalVestedAmount = async (wallet: string) => {
    try {
      const query = new Query({
        address: new Address(contractAddress),
        func: new ContractFunction("get_holders_total_vested_amount"),
        args: [new AddressValue(new Address(`${wallet}`))]
      })
      const result = await proxy.queryContract(query)
      const parser = new ResultsParser()

      const data = parser.parseQueryResponse(
        result,
        contract.getEndpoint("get_holders_total_vested_amount")
      )
      if (data.values[0]) {
        return data.values[0]?.toString() ?? "0"
      }
    }
    catch (e) {
      return null
    }
    return null
  }

  const getEpochData = async () => {
    try {
      const { data } = await axios.get(network.apiAddress + '/stats')
      window.localStorage.setItem("epochData", JSON.stringify({
        ...data,
        currentTimestamp: Date.now()
      }))
      return data
    } catch (e) {
      console.log("ERROR", e)
    }

  }

  const getEpochStartTime = (epoch: number, data: any) => {
    const time = Date.now()
    if (epoch <= data.epoch) {
      return time - ((data.epoch - epoch) * data.roundsPerEpoch + data.roundsPassed) * data.refreshRate
    }
    return time + ((epoch - data.epoch) * data.roundsPerEpoch + data.roundsPassed) * data.refreshRate
  }
  const getReleaseableAmount = async (getVestingScheduleHash: any) => {
    try {
      const query = new Query({
        address: new Address(contractAddress),
        func: new ContractFunction("compute_releasable_amount"),
        args: [getVestingScheduleHash]
      })
      const result = await proxy.queryContract(query)
      const parser = new ResultsParser()
      const data = parser.parseQueryResponse(
        result,
        contract.getEndpoint("compute_releasable_amount")
      )
      if (data.values[0]) {
        return Number(data.values[0]?.toString() ?? "0") / 10 ** decimal
      }
    } catch (e) {
      return 0
    }
    return 0
  }

  const getVestingSchedulesByHash = async (vestingScheduleHash: any) => {
    // const arrangedProof = new ArrayVec(
    //   new ArrayVecType(32, new U8Type()),
    //   formatHexToU8(vestingScheduleHash[0])
    // )

    // const test = "0x" + vestingScheduleHash[0]
    // console.log("SSEEE", new BytesValue(Buffer.from(test, "hex")))

    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction("getUserVestingSchedules"),
      args: [vestingScheduleHash]
      // args: [new BytesValue(Buffer.from(vestingScheduleHash[1]))]
    })
    // new BytesValue(vestingScheduleHash[0])
    try {
      const result = await proxy.queryContract(query)
      const parser = new ResultsParser()
      const data: any = parser.parseQueryResponse(
        result,
        contract.getEndpoint("getUserVestingSchedules")
      )
      const epochData = await getEpochData()
      let returnObj: IVestingData = {
        initialized: false,
        beneficiary: "",
        creator: "",
        cliff: 0,
        start: 0,
        duration: 200,
        revocable: false,
        amount_total: 0,
        released: 0,
        revoked: false,
        vesting_schedule_id: "",
        claimable: 0,
      }
      if (data.values[0]) {
        // console.log("initialized", data.values[0].fields[0].value.value)
        // console.log("beneficiary", data.values[0].fields[1].value.value.valueHex)
        // console.log("creator", data.values[0].fields[2].value.value.valueHex)
        // console.log("cliff", data.values[0].fields[3].value.toString())
        // console.log("start", data.values[0].fields[4].value.toString())
        // console.log("duration", data.values[0].fields[5].value.toString())
        // console.log("revocable", data.values[0].fields[6].value.value)
        // console.log("amount_total", data.values[0].fields[7].value.toString())
        // console.log("released", data.values[0].fields[8].value.toString())
        // console.log("revoked", data.values[0].fields[9].value.value)
        returnObj = {
          initialized: data.values[0].fields[0].value.value,
          beneficiary: data.values[0].fields[1].value.value.valueHex,
          creator: data.values[0].fields[2].value.value.toString(),
          cliff: getEpochStartTime(Number(data.values[0].fields[3].value.toString()), epochData),
          start: getEpochStartTime(Number(data.values[0].fields[4].value.toString()), epochData),
          duration: Number(data.values[0].fields[5].value.toString()) ?? 200,
          revocable: data.values[0].fields[6].value.value,
          amount_total: Number(data.values[0].fields[7].value.toString()) / (Math.pow(10, decimal)),
          released: Number(data.values[0].fields[8].value.toString()) / (Math.pow(10, decimal)),
          revoked: data.values[0].fields[9].value.value,
          vesting_schedule_id: vestingScheduleHash,
          claimable: await getReleaseableAmount(vestingScheduleHash)
        }
        return returnObj
      }
    } catch (e) {
      return null
    }
    // return null
  }

  const getVestingScheduleId = (wallet: string, idx: number) => {
    const addressValue: any = new AddressValue(new Address(`${wallet}`))
    // to hex
    const addressHex = addressValue.valueOf()?.valueHex
    const holderBuffer = Buffer.from(addressHex, "hex")
    // const indexBigInt = BigInt(idx); // This handles both number and BigInt types
    const indexHex = numberToHex(idx.toString());
    // Ensure even number of characters for proper buffer conversion
    // if (idx > 0 && indexHex.length % 2 !== 0) {
    //   indexHex = '0' + indexHex;
    // }
    const idxBuffer = Buffer.from(indexHex, 'hex');
    const combinedBuffer = Buffer.concat([holderBuffer, idxBuffer])
    const hash = keccak256(combinedBuffer).toString("hex")
    return new ArrayVec(
      new ArrayVecType(32, new U8Type()),
      formatHexToU8(hash)
    )
  }

  const releaseVestedTokens = async (vestingScheduleId: any, amount: number) => {

    if (!vestingScheduleId) {
      return
    }
    const tx: any = contract.methods
      .release([
        vestingScheduleId,
        new BigUIntValue(new BigNumber(amount * Math.pow(10, network.tokenDecimal)).toFixed(0))
      ])
      .withChainID(network.chainID)
      .withSender(new Address(wallet.address))
      .withGasLimit(100000000)
      .buildTransaction()
    // const tx: any = contract.call({
    //   caller: new Address(wallet.address),
    //   func: new ContractFunction("release"),
    //   gasLimit: 100000000,
    //   args: [
    //     vestingScheduleId,
    //     new BigUIntValue(new BigNumber(amount * Math.pow(10, network.tokenDecimal)))
    //   ],
    //   chainID: network.chainID
    // })
    const transaction = await sendTransactions({
      transactions: tx
    })
    return transaction
  }



  return {
    createVestingSchedule,
    addVestingWallet,
    removeVestingWallet,
    getHoldersCount,
    getVestingSchedulesByHash,
    getVestingScheduleId,
    releaseVestedTokens,
    getTotalVestedAmount
  }
}
