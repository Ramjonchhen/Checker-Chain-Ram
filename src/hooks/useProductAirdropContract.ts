/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendTransactions, useTrackTransactionStatus } from "lib/dApp-core"
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
import { abi } from "abis/productAirdrop.abi"
import BigNumber from "bignumber.js"
import { formProofs } from "./useReward"
import { getNetwork } from "config"
import { useState, useEffect } from "react"
import { proxyNetworkProvider as proxy } from "lib/dApp-network-js"
import { useWallet } from "./useWallet"

// eslint-disable-next-line @typescript-eslint/no-var-requires

// function buf2hex(buffer) {
//   // buffer is an ArrayBuffer
//   return [...new Uint8Array(buffer)]
//     .map((x) => x.toString(16).padStart(2, "0"))
//     .join("")
// }

export interface AirdropContractState {
  airdropId: number
  totalClaimed: number
  startTime: string
  duration: string
  airdropToken: string
}

const network = getNetwork()

const contractAddress = network.productAirdropContract
const abiRegistry = AbiRegistry.create(abi)
const contract = new SmartContract({
  address: new Address(contractAddress),
  abi: abiRegistry
})

const identifier = network.tokenId
const decimal = network.tokenDecimal

export const useProductAirdropContract = () => {
  const [sid, setSid] = useState<string | null>("")
  const { wallet } = useWallet()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isCancelled, isPending, isSuccessful, isFailed } =
    useTrackTransactionStatus({
      transactionId: sid
    })

  useEffect(() => {
    if (isSuccessful || isFailed || isCancelled) {
      setSid(null)
    }
  }, [isSuccessful, isFailed, isCancelled])

  const createAirdrop = async ({
    admin,
    startTime,
    duration,
    airdropRoot,
    airdropId,
    amount,
    callback
  }: {
    admin: string
    startTime: number
    duration: number
    airdropRoot: string
    airdropId: string
    amount: number
    callback?: (sessionId: string | null) => void
  }) => {
    const tx = contract.methodsExplicit
      .create_airdrop([
        new AddressValue(new Address(admin)),
        new BigUIntValue(new BigNumber(startTime)),
        new BigUIntValue(new BigNumber(duration)),
        BytesValue.fromHex(airdropRoot.replace("0x", "")),
        new BytesValue(Buffer.from(identifier)),
        new BigUIntValue(new BigNumber(airdropId))
      ])
      .withChainID(network.chainID)
      .withSender(new Address(wallet.address))
      .withGasLimit(100000000)
      .withSingleESDTTransfer(
        TokenPayment.fungibleFromAmount(identifier, amount, decimal)
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

  const checkClaimStatus = async (user: string, airdropId: number) => {
    try {
      let a = 0
      const query = new Query({
        address: new Address(contractAddress),
        func: new ContractFunction("getClaimStatus"),
        args: [
          new AddressValue(new Address(`${user}`)),
          new BigUIntValue(new BigNumber(airdropId))
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
      return false

    }

  }

  const claimAirdrop = async ({
    proof,
    index,
    amount,
    airdropId,
    callback
  }: {
    proof: string[]
    index: number
    amount: number
    airdropId: number
    callback?: (sessionId: string | null) => void
  }) => {
    const tx = contract.methodsExplicit
      .claim([
        formProofs(proof),
        new BigUIntValue(new BigNumber(index)),
        new BigUIntValue(new BigNumber(amount)),
        new BigUIntValue(new BigNumber(airdropId))
      ])
      .withChainID(network.chainID)
      .withSender(new Address(wallet.address))
      .withGasLimit(100000000)
      .buildTransaction()

    const { sessionId } = await sendTransactions({
      transactions: tx
    })
    setSid(sessionId)
    if (callback) {
      callback(sessionId)
    }
  }

  const withdrawEgld = async ({
    callback
  }: {
    callback?: (sessionId: string | null) => void
  }) => {
    const tx = contract.methodsExplicit
      .withdraw_egld([])
      .withChainID(network.chainID)
      .withSender(new Address(wallet.address))
      .withGasLimit(100000000)
      .buildTransaction()

    const { sessionId } = await sendTransactions({
      transactions: tx
    })
    if (callback) {
      callback(sessionId)
    }
  }

  const rescueToken = async ({
    amount,
    airdropId,
    callback
  }: {
    amount: number
    airdropId: number
    callback?: (sessionId: string | null) => void
  }) => {
    const tx = contract.methodsExplicit
      .rescue_token([
        new BigUIntValue(new BigNumber(amount * 10 ** decimal)),
        new BigUIntValue(new BigNumber(airdropId))
      ])
      .withChainID(network.chainID)
      .withSender(new Address(wallet.address))
      .withGasLimit(100000000)
      .buildTransaction()

    const { sessionId } = await sendTransactions({
      transactions: tx
    })
    if (callback) {
      callback(sessionId)
    }
  }

  const getAirdrop = async (airdropId: number) => {

    try {
      const query = new Query({
        address: new Address(contractAddress),
        func: new ContractFunction("getAirdrops"),
        args: [new BigUIntValue(new BigNumber(airdropId))]
      })
      const queryResponse = await proxy.queryContract(query)
      const endpointDefinition = contract.getEndpoint("getAirdrops")
      const resultParser = new ResultsParser()
      const data: any = resultParser.parseQueryResponse(
        queryResponse,
        endpointDefinition
      )
      // console.log("*********    ********************* ");

      // console.log("airdropId", airdropId)
      // console.log("totalClaimed", data.values[0]?.fields[2].value.toString())
      // console.log("start_time", data.values[0]?.fields[3].value.toString())
      // console.log("duration", data.values[0]?.fields[4].value.toString())
      // console.log("airdrop_token", data.values[0]?.fields[5].value.toString())
      // console.log("*********    ********************* ");
      return {
        airdropId,
        totalClaimed:
          Number(data.values[0]?.fields[2].value.toString()) /
          10 ** network.tokenDecimal,
        startTime: data.values[0]?.fields[3].value.toString(),
        duration: data.values[0]?.fields[4].value.toString(),
        airdropToken: data.values[0]?.fields[5].value.toString()
      } as AirdropContractState
      // console.log(data.values)
    }
    catch (err) {
      console.error(err)
      return {
        airdropId: 0,
        totalClaimed: 0,
        startTime: "",
        duration: "",
        airdropToken: "",
      } as AirdropContractState

    }

  }

  /**
   *
   * Used for testing only
   */
  const getCurrentTime = async () => {
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction("getCurrentTime"),
      args: []
    })
    const result = await proxy.queryContract(query)
    const parser = new ResultsParser()
    const parsed: any = parser.parseQueryResponse(
      result,
      contract.getEndpoint("getCurrentTime")
    )

    // console.log(parsed.values[0].toString())

    return parsed.values[0].toString()
  }

  const getCurrentAirdropCount = async () => {
    try {
      const query = new Query({
        address: new Address(contractAddress),
        func: new ContractFunction("getCurrentAirdropCount"),
        args: []
      })
      const result = await proxy.queryContract(query)
      const parser = new ResultsParser()
      const parsed: any = parser.parseQueryResponse(
        result,
        contract.getEndpoint("getCurrentAirdropCount")
      )
      return { latestAirdropId: parsed?.values[0]?.toString() ?? "" }
    }
    catch (err) {
      console.log(err)
      return { latestAirdropId: "" }
    }

  }

  const getAirdropRoot = async (airdropId: string) => {
    try {
      const query = new Query({
        address: new Address(contractAddress),
        func: new ContractFunction("getAirdropRoot"),
        args: [new BigUIntValue(new BigNumber(airdropId))]
      })
      const result = await proxy.queryContract(query)
      const parser = new ResultsParser()
      const parsed: any = parser.parseQueryResponse(
        result,
        contract.getEndpoint("getAirdropRoot")
      )
      const airdropRoot = Buffer.from(
        parsed.values[0].getItems().map((item: any) => Number(item.toString()))
      ).toString("hex")

      return { airdropRoot: `0x${airdropRoot}` }
    }
    catch (err) {
      return { airdropRoot: "" }
    }

  }

  return {
    getCurrentTime,
    createAirdrop,
    claimAirdrop,
    withdrawEgld,
    rescueToken,
    getAirdrop,
    isCancelled,
    isFailed,
    isSuccessful,
    isPending,
    checkClaimStatus,
    getCurrentAirdropCount,
    getAirdropRoot
  }
}