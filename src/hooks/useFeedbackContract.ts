/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendTransactions, useTrackTransactionStatus } from "lib/dApp-core"
import {
    Address,
} from "lib/dApp-js"
import { getNetwork } from "config"
import { AbiRegistry, SmartContract, U64Value } from "@multiversx/sdk-core/out"
import { useEffect, useState } from "react"
import { reviewAbi } from "abis/review.abi"


// eslint-disable-next-line @typescript-eslint/no-var-requires
const keccak256 = require("keccak256")
const network = getNetwork()

const contractAddress = network.reviewContract
const abiRegistry = AbiRegistry.create(reviewAbi)
const contract = new SmartContract({
    address: new Address(contractAddress),
    abi: abiRegistry
})


export const useFeedbackContract = () => {
    const [sid, setSid] = useState<string | null>(localStorage.getItem("feedbackSessionId") ?? null)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isCancelled, isPending, isSuccessful, isFailed } =
        useTrackTransactionStatus({
            transactionId: sid
        })

    useEffect(() => {
        if (isSuccessful || isFailed || isCancelled) {
            setSid(null)
            localStorage.removeItem("feedbackSessionId")
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
        window.localStorage.setItem("feedbackSessionId", sessionId)
        if (callback) {
            callback(sessionId)
        }
    }




    return {
        postFeedback,
        isCancelled, isPending, isSuccessful, isFailed
    }
}
