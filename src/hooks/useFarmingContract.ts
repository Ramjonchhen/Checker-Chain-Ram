/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendTransactions, useGetActiveTransactionsStatus, useTrackTransactionStatus } from "lib/dApp-core"
import {
  AbiRegistry,
  Address,
  AddressValue,
  BigUIntValue,
  BytesValue,
  ContractFunction,
  Query,
  ResultsParser,
  SmartContract,
  TokenPayment
} from "lib/dApp-js"
import { abi } from "abis/farming.abi"
import BigNumber from "bignumber.js"
import { getNetwork } from "config"
import { proxyNetworkProvider as proxy } from "lib/dApp-network-js"
import { useEffect, useState } from "react"
import { useWallet } from "./useWallet"
// eslint-disable-next-line @typescript-eslint/no-var-requires

const network = getNetwork()

const contractAddress = network.farmingContract

const abiRegistry = AbiRegistry.create(abi)
const contract = new SmartContract({
  address: new Address(contractAddress),
  abi: abiRegistry
})

const identifier = network.pairToken
const decimal = network.pairTokenDecimal

export const useFarmingContract = () => {
  const [sid, setSid] = useState<string | null>("")
  const { wallet } = useWallet()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isCancelled, isPending, isSuccessful, isFailed } =
    useTrackTransactionStatus({
      transactionId: sid
    })

  const { timedOut, fail, success, pending } = useGetActiveTransactionsStatus();

  useEffect(() => {
    if (timedOut || fail || success || pending) {
      setTimeout(() => {
        setSid(null)
      }, 1000)
    }
  }, [timedOut, fail, success, pending])

  const startFarming = async () => {
    const tx = contract.methods
      .start_farming([true])
      .withChainID(network.chainID)
      .withGasLimit(100000000)
      .withSender(new Address(wallet.address))
      .buildTransaction()

    const { sessionId } = await sendTransactions({
      transactions: tx
    })
    setSid(sessionId)
    return sessionId
  }

  const enterFarming = async ({
    amount,
    callback
  }: {
    amount: number
    callback?: (sessionId: string | null) => void
  }) => {
    const tx = contract.methods
      .enter_farming([])
      .withChainID(network.chainID)
      .withGasLimit(100000000)
      .withSender(new Address(wallet.address))
      .withSingleESDTTransfer(
        TokenPayment.fungibleFromAmount(
          identifier,
          amount / 10 ** decimal,
          decimal
        )
      )
      .buildTransaction()

    const { sessionId } = await sendTransactions({
      transactions: tx
    })
    setSid(sessionId)
    if (callback) {
      callback(sessionId)
    }
  }

  const exitFarming = async ({
    amount,
    callback
  }: {
    amount: number
    callback?: (sessionId: string | null) => void
  }) => {
    const tx = contract.methods
      .exit_farming([amount])
      .withChainID(network.chainID)
      .withGasLimit(100000000)
      .withSender(new Address(wallet.address))
      .buildTransaction()

    const { sessionId } = await sendTransactions({
      transactions: tx
    })
    setSid(sessionId)
    if (callback) {
      callback(sessionId)
    }
  }

  const claimRewards = async ({
    callback
  }: {
    callback?: (sessionId: string | null) => void
  }) => {
    const tx = contract.methods
      .claim_rewards([])
      .withChainID(network.chainID)
      .withGasLimit(600000000)
      .withSender(new Address(wallet.address))
      .buildTransaction()

    const { sessionId } = await sendTransactions({
      transactions: tx
    })
    setSid(sessionId)
    if (callback) {
      callback(sessionId)
    }
  }

  const rescueToken = async ({
    amount,
    callback
  }: {
    amount: number
    callback?: (sessionId: string | null) => void
  }) => {
    const tx = contract.methods
      .rescue_token([
        new BytesValue(Buffer.from(identifier)),
        new BigUIntValue(new BigNumber(amount))
      ])
      .withChainID(network.chainID)
      .withGasLimit(100000000)
      .withSender(new Address(wallet.address))
      .buildTransaction()

    const { sessionId } = await sendTransactions({
      transactions: tx
    })
    setSid(sessionId)
    if (callback) {
      callback(sessionId)
    }
  }

  const getFarmingState = async () => {
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction("getFarmingState"),
      args: []
    })
    const result = await proxy.queryContract(query)
    const parser = new ResultsParser()
    const data: any = parser.parseQueryResponse(
      result,
      contract.getEndpoint("getFarmingState")
    )
    const parsedData = Object.fromEntries(
      data.values[0].fields.map((item: any, index: number) => [
        item.name,
        index == 0 ? item.value.value : item.value.toString()
      ])
    )
    return parsedData
  }

  const getStakedAmount = async (address: string) => {
    if (!address) return "0"
    try {
      const query = new Query({
        address: new Address(contractAddress),
        func: new ContractFunction("stakedAmount"),
        args: [new AddressValue(new Address(address))]
      })
      const result = await proxy.queryContract(query)
      const parser = new ResultsParser()
      const data = parser.parseQueryResponse(
        result,
        contract.getEndpoint("stakedAmount")
      )
      if (data.values[0]) {
        return (Number(data.values[0]) / (10 ** network.pairTokenDecimal))?.toString() ?? "0"
      }
      return "0"
    }
    catch (err) {
      return "0"
    }

  }

  const calculateRemainingRewards = async (address: string) => {
    if (!address) return "0"
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction("calculate_remaining_reward"),
      args: [new AddressValue(new Address(address))]
    })
    try {
      const result = await proxy.queryContract(query)
      const parser = new ResultsParser()
      const data = parser.parseQueryResponse(
        result,
        contract.getEndpoint("calculate_remaining_reward")
      )
      if (data.values[0]) {
        return parseInt(
          (Number(data.values[0].toString()) / 10 ** 5).toString(),
          10
        )
      }
    } catch (e) {
      return 0
    }
    return 0
  }

  const getNextRewardRemainingEpoch = async () => {
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction("getNextRewardRemainingEpoch"),
      args: []
    })
    try {
      const result = await proxy.queryContract(query)
      const parser = new ResultsParser()
      const data = parser.parseQueryResponse(
        result,
        contract.getEndpoint("getNextRewardRemainingEpoch")
      )
      // console.log(data)
      // console.log(data.values[0].toString())
      if (data.values[0]) {
        return data.values[0].toString()
      }
      return "0"

    }
    catch (err) {
      return "0"
    }
  }

  const setCurrentRound = async (round: number) => {
    const tx = contract.methods
      .set_current_round([round])
      .withChainID(network.chainID)
      .withGasLimit(100000000)
      .withSender(new Address(wallet.address))
      .buildTransaction()

    const { sessionId } = await sendTransactions({
      transactions: tx
    })

    return sessionId
  }

  const getAddressState = async (address: string) => {
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction("getAddressState"),
      args: [new AddressValue(new Address(address))]
    })
    const result = await proxy.queryContract(query)
    const parser = new ResultsParser()
    const data: any = parser.parseQueryResponse(
      result,
      contract.getEndpoint("getAddressState")
    )
    // console.log(data.values)
    return data.values
  }

  const totalStakedAmount = async (round: number) => {
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction("totalStakedAmount"),
      args: [new BigUIntValue(new BigNumber(round))]
    })
    const result = await proxy.queryContract(query)
    const parser = new ResultsParser()
    const data = parser.parseQueryResponse(
      result,
      contract.getEndpoint("totalStakedAmount")
    )
    // console.log(data.values[0].toString())
    if (data.values[0]) {
      return data.values[0].toString()
    }
    return "0"
  }

  const getGrandTotalAmount = async () => {
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction("grandTotalAmount"),
      args: []
    })
    const result = await proxy.queryContract(query)
    const parser = new ResultsParser()
    const data = parser.parseQueryResponse(
      result,
      contract.getEndpoint("grandTotalAmount")
    )
    // if (data.values[0]) {
    //   return data.values[0].toString()
    // }
    // return "0"
    return (Number(data.values[0]) / 10 ** network.pairTokenDecimal).toString()
  }

  return {
    totalStakedAmount,
    getAddressState,
    startFarming,
    enterFarming,
    exitFarming,
    claimRewards,
    rescueToken,
    setCurrentRound,
    getFarmingState,
    getStakedAmount,
    calculateRemainingRewards,
    getNextRewardRemainingEpoch,
    isCancelled,
    isPending: pending,
    isSuccessful: success,
    isFailed,
    getGrandTotalAmount
  }
}