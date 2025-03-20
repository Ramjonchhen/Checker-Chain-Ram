/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendTransactions } from "lib/dApp-core"
import {
  AbiRegistry,
  Address,
  ContractFunction,
  Query,
  ResultsParser,
  SmartContract,
  TokenPayment
} from "lib/dApp-js"
import { abi } from "abis/product.abi"
import { useToastStore } from "stores/toast"
import { useWallet } from "hooks/useWallet"
import { getNetwork } from "config"
import { proxyNetworkProvider as proxy } from "lib/dApp-network-js"
import { TokenTransfer } from "@multiversx/sdk-core/out"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const keccak256 = require("keccak256")
const network = getNetwork()

const contractAddress = network.productContract
const abiRegistry = AbiRegistry.create(abi)
const contract = new SmartContract({
  address: new Address(contractAddress),
  abi: abiRegistry
})

const identifier = network.tokenId
const decimal = network.tokenDecimal
// const createFee = network.createFee
// const claimFee = network.claimFee

export const useProductContract = () => {
  const { errorToast } = useToastStore()
  const { userBalance, wallet } = useWallet()

  const createProduct = async ({
    productId,
    walletAddress,
    callback,
    createFeeAmount
  }: {
    productId: string
    walletAddress: string
    createFeeAmount: number
    callback?: (sessionId: string | null) => void
  }) => {
    // const createFeeAmount = await getCreateBrandFee()
    // const createFeeAmount = 5000
    if (userBalance < createFeeAmount) {
      errorToast({
        message: `You need at least ${createFeeAmount} CHECKR to create a product`
      })
      return
    }
    const hash = keccak256(productId + walletAddress).toString("hex")
    const tx = contract.methods
      .create_brand([hash])
      .withChainID(network.chainID)
      .withGasLimit(100000000)
      // .withSingleESDTTransfer(
      //   TokenTransfer.fungibleFromAmount(identifier, createFeeAmount, decimal)
      // )
      .withSingleESDTTransfer(
        TokenTransfer.fungibleFromAmount(identifier, createFeeAmount.toString(), decimal)
      )
      .withSender(new Address(walletAddress))
      .buildTransaction()
    const { sessionId } = await sendTransactions({
      transactions: tx
    })
    if (callback) {
      callback(sessionId)
    }
  }

  const claimProduct = async ({
    productId,
    walletAddress,
    callback
  }: {
    productId: string
    walletAddress: string
    callback?: (sessionId: string | null) => void
  }) => {
    const claimFeeAmount = await getClaimBrandFee()
    if (userBalance < claimFeeAmount) {
      errorToast({
        message: `You need at least ${claimFeeAmount} CHECKR to claim a product`
      })
      return
    }
    const hash = keccak256(productId + walletAddress).toString("hex")
    const tx = contract.methods
      .claim_brand([hash])
      .withChainID(network.chainID)
      .withGasLimit(100000000)
      .withSender(new Address(wallet.address))
      .withSingleESDTTransfer(
        TokenPayment.fungibleFromAmount(identifier, claimFeeAmount, decimal)
      )
      .buildTransaction()

    const { sessionId } = await sendTransactions({
      transactions: tx
    })
    if (callback) {
      callback(sessionId)
    }
  }
  const approveClaim = async ({
    productId,
    walletAddress,
    callback
  }: {
    productId: string
    walletAddress: string
    callback?: (sessionId: string | null) => void
  }) => {
    const hash = keccak256(productId + walletAddress).toString("hex")
    const tx = contract.methods
      .approve_claim([hash])
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

  const updateCreatorFee = async ({
    fee,
    callback
  }: {
    fee: number
    callback?: (sessionId: string | null) => void
  }) => {
    const tx = contract.methods
      .update_creator_fee([fee * 10 ** decimal])
      .withChainID(network.chainID)
      .withGasLimit(100000000)
      .withSender(new Address(wallet.address))
      .buildTransaction()

    const { sessionId } = await sendTransactions({
      transactions: tx
    })
    if (callback) {
      callback(sessionId)
    }
  }

  const updateClaimFee = async ({
    fee,
    callback
  }: {
    fee: number
    callback?: (sessionId: string | null) => void
  }) => {
    const tx = contract.methods
      .update_brand_fee([fee * 10 ** decimal])
      .withChainID(network.chainID)
      .withGasLimit(100000000)
      .withSender(new Address(wallet.address))
      .buildTransaction()

    const { sessionId } = await sendTransactions({
      transactions: tx
    })
    if (callback) {
      callback(sessionId)
    }
  }

  const getCreateBrandFee = async () => {
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction("getCreateBrandFee"),
      args: []
    })
    const result = await proxy.queryContract(query)
    const parser = new ResultsParser()
    const data: any = parser.parseQueryResponse(
      result,
      contract.getEndpoint("getCreateBrandFee")
    )
    return Number(data.values[0].value.toString()) / 10 ** decimal
  }

  const getClaimBrandFee = async () => {
    const query = new Query({
      address: new Address(contractAddress),
      func: new ContractFunction("getClaimBrandFee"),
      args: []
    })
    const result = await proxy.queryContract(query)
    const parser = new ResultsParser()
    const data: any = parser.parseQueryResponse(
      result,
      contract.getEndpoint("getClaimBrandFee")
    )
    return Number(data.values[0].value.toString()) / 10 ** decimal
  }

  return {
    createProduct,
    claimProduct,
    approveClaim,
    updateCreatorFee,
    updateClaimFee,
    getCreateBrandFee,
    getClaimBrandFee
  }
}
