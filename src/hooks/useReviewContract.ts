/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendTransactions, useTrackTransactionStatus } from "lib/dApp-core"
import {
  AbiRegistry,
  Address,

  SmartContract,
} from "lib/dApp-js"
import { useToastStore } from "stores/toast"
import { useWallet } from "hooks/useWallet"
import { getNetwork } from "config"
import { AddressValue, ArrayVec, ArrayVecType, BigUIntValue, BytesValue, ContractFunction, List, ListType, Query, ResultsParser, TokenTransfer, U64Value, U8Type, U8Value } from "@multiversx/sdk-core/out"
import { reviewAbi } from "abis/review.abi"
import BigNumber from "bignumber.js"
import { proxyNetworkProvider as proxy } from "lib/dApp-network-js"
import { useEffect, useState } from "react"


// eslint-disable-next-line @typescript-eslint/no-var-requires
const keccak256 = require("keccak256")
const network = getNetwork()

// const hexEncode = (string: string) => {
//   let hex, i;

//   let result = "";
//   for (i = 0; i < string.toString().length; i++) {
//     hex = string.toString().charCodeAt(i).toString(16);
//     result += ("000" + hex).slice(-4);
//   }

//   return result
// }
// const hexDecode = (string: string) => {
//   let j;
//   const hexes = string.match(/.{1,4}/g) || [];
//   let back = "";
//   for (j = 0; j < hexes.length; j++) {
//     back += String.fromCharCode(parseInt(hexes[j], 16));
//   }

//   return back;
// }

export const formatArrayToU8 = (array: any[]) => {
  const u8Array: any[] = []
  array.forEach((d: any) => {
    u8Array.push(new U8Value(d))
  })
  if (u8Array.length < 32) {
    // pad with 0s
    const padding = 32 - u8Array.length
    for (let i = 0; i < padding; i++) {
      u8Array.push(new U8Value(0))
    }
  }
  return u8Array
}

export const formatIntArrayToHex = (array: number[]) => {
  let hex = ""
  array.forEach((num) => {
    hex += num.toString(16)
  })
  let data = Buffer.from(hex, "hex")
  // create buffer array of length 32
  data = Buffer.concat([data], 32)

  // get back the array without padding
  const u8Array: any[] = []
  data.forEach((d: any) => {
    u8Array.push(new U8Value(d))
  })
  return u8Array
}

export const formatHexToU8 = (hex: any) => {
  let _hex = hex.toString().replace("0x", "")
  if (_hex.length < 32) {
    // pad with 0s
    const padding = 32 - _hex.length
    _hex = _hex.padStart(padding, "0")

  }
  let data = Buffer.from(_hex, "hex")
  // create buffer array of length 32
  data = Buffer.concat([data], 32)

  // get back the array without padding
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

const contractAddress = network.reviewContract
const abiRegistry = AbiRegistry.create(reviewAbi)
const contract = new SmartContract({
  address: new Address(contractAddress),
  abi: abiRegistry
})

const parseValueData = (data: any) => {
  if (data.type.name === "u8") {
    return data.value.toString()
  }
  if (data.type.name === "Address") {
    return data.value.bech32()
  }
  if (data.type.name === "BigUint") {
    return Number(data.value.toString())
  }
  if (data.type.name === "bytes") {
    return data.value.toString('hex')
  }
  if (data.type.name === "Array") {
    return data.backingCollection.items.map((each: any) => {
      return parseValueData(each)
    })
  }

  return data
  // if (value.type.name === 'Address') {
  //   return value.value.toString()
  // }
  // return value.value.toString()
}

const identifier = network.tokenId
const decimal = network.tokenDecimal
// const createFee = network.createFee
// const claimFee = network.claimFee

export const useReviewContract = () => {
  const { errorToast } = useToastStore()
  const { userBalance } = useWallet()
  const [sid, setSid] = useState<string | null>("")

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

  const postFeedback = async ({
    productId,
    walletAddress,
    feedback,
    message,
    rating,
    callback,

  }: {
    productId: string
    walletAddress: string
    feedback: string
    message: string
    rating: number
    callback?: (sessionId: string | null) => void
  }) => {
    const productHash = keccak256(productId + walletAddress).toString("hex")
    const productHashBuffer = Buffer.from(productHash, 'hex')

    const feedbackHash = keccak256(feedback).toString("hex")
    const feedbackHashBuffer = Buffer.from(feedbackHash, 'hex')

    const messageHash = keccak256(message).toString("hex")
    const messageHashBuffer = Buffer.from(messageHash, 'hex')

    const tx = contract.methods.submit_feedback([
      feedbackHashBuffer,
      messageHashBuffer,
      new U64Value(rating),
      productHashBuffer
    ])
      .withChainID(network.chainID)
      .withGasLimit(100000000)
      .withSender(new Address(walletAddress))
      .buildTransaction()
    const { sessionId } = await sendTransactions({
      transactions: tx
    })
    setSid(sessionId)
    if (callback) {
      callback(sessionId)
    }
  }

  const postReview = async ({
    productId,
    walletAddress,
    results,
    callback,
    postFeeAmount,
    reviewCycleId,
  }: {
    productId: string
    walletAddress: string
    results: any[]
    postFeeAmount: number
    reviewCycleId: number
    callback?: (sessionId: string | null) => void
  }) => {
    const hasReviewed = await getUserReview({
      productId,
      walletAddress
    })
    if (hasReviewed.status) {
      return hasReviewed
    }
    // const createFeeAmount = await getCreateBrandFee()
    // const createFeeAmount = 5000
    if (userBalance < postFeeAmount) {
      errorToast({
        message: `You need at least ${postFeeAmount} CHECKR to create a product`
      })
      return
    }
    if (!results || results.length === 0) {
      errorToast({
        message: `You need to submit all questions`
      })
      return
    }
    const productHash = keccak256(productId + walletAddress).toString("hex")
    const productHashBuffer = Buffer.from(productHash, 'hex')
    const questionIds = results.map((result) => result.qn)
    const answers = results.map((result) => Number(result.answer))
    // console.log("postFeeAmount", postFeeAmount)
    const tx = contract.methods
      .post_review([
        // new BigUIntValue(new BigNumber(postFeeAmount).multipliedBy(10 ** decimal).toString()), // 
        productHashBuffer, // product_id
        // example for array32 u8
        new ArrayVec(
          new ArrayVecType(32, new U8Type()),
          formatArrayToU8(questionIds)
        ), // question_id
        new ArrayVec(
          new ArrayVecType(32, new U8Type()),
          formatArrayToU8(answers)
        ), // answer_id
        new Address(walletAddress), // wallet_id
        new BigUIntValue(new BigNumber(reviewCycleId)) // review_cycle_id
      ])
      .withChainID(network.chainID)
      .withGasLimit(10000000)
      // .withSingleESDTTransfer(
      //   TokenTransfer.fungibleFromAmount(identifier, createFeeAmount, decimal)
      // )
      // .withSingleESDTTransfer(
      //   TokenTransfer.fungibleFromAmount(identifier, postFeeAmount.toString(), decimal)
      // )
      .withSender(new Address(walletAddress))
      .buildTransaction()
    const { sessionId } = await sendTransactions({
      transactions: tx
    })
    setSid(sessionId)
    if (callback) {
      callback(sessionId)
    }
  }

  const getUserReview = async ({
    productId,
    walletAddress,
  }: {

    productId: string
    walletAddress: string
    callback?: (sessionId: string | null) => void
  }) => {
    try {
      const productHash = keccak256(productId + walletAddress).toString("hex")
      const productHashBuffer = Buffer.from(productHash, 'hex')
      const query = new Query({
        address: new Address(contractAddress),
        func: new ContractFunction("getUserReview"),
        args: [
          new AddressValue(new Address(walletAddress)), // wallet_id
          new BytesValue(productHashBuffer), // product_id
        ]
      });
      const result = await proxy.queryContract(query)
      const resultParser = new ResultsParser()
      const data: any = resultParser.parseQueryResponse(result,
        contract.getEndpoint("getUserReview")
      )
      const parsedData = data.values[0]?.fields?.reduce((acc: any, field: any) => {
        acc[field.name] = parseValueData(field.value)
        return acc
      }, {})
      return {
        data: parsedData,
        status: true
      }
    } catch (error: any) {
      console.log('error', error)
      return {
        error: error.message ?? error,
        status: false
      }
    }
  }




  return {
    postReview,
    postFeedback,
    getUserReview,
    isCancelled, isPending, isSuccessful, isFailed
  }
}
