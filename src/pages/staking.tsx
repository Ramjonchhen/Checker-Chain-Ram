/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendTransactions, useGetActiveTransactionsStatus } from "lib/dApp-core"
import {
  Address,
  AddressValue,
  BigUIntValue,
  ContractFunction,
  Query,
  SmartContract,
  Transaction,
  TransactionPayload
} from "lib/dApp-js"
import {
  StakingDisplayCard,
  StyledAddStakeCard,
  StyledRewardCard,
  StyledStakingCard,
  StyledUnstakeCard
} from "assets/styles/component/Card.style"
import { StakingHeader } from "assets/styles/Staking.style"
import { colors } from "assets/theme/theme"
import axios from "axios"
import BigNumber from "bignumber.js"
import { Modal } from "components"
import config from "config/config.json"
import { useWallet } from "hooks/useWallet"
import Layout from "layout"
import dayjs from "lib/dateLib"
import Head from "next/head"
import { useEffect, useState } from "react"
import { proxyNetworkProvider as proxy } from "lib/dApp-network-js"
import { stakingConfig } from "config/stakingConfig"
import { getNetwork } from "config"
import { usePriceRatesStore } from "stores/priceRatesData"
import { TokenIdentifierValue } from "@multiversx/sdk-core/out"
import {
  CheckerSmallLogo
  // CoinCheckr
} from "assets/images"

const network = getNetwork()

const Staking = (props: any) => {
  const { getPairs, pairData: pairInfo } = usePriceRatesStore()
  useEffect(() => {
    getPairs(config.mainnet.tokenId, config.network.egldToken)
  }, [])
  const { wallet, trimWallet, abbreviateNumber, userBalance } = useWallet()
  const [stakeAmount, setStakeAmount] = useState<any>()
  const [unstakeAmount, setUnstakeAmount] = useState<any>()
  const stakingContract = network.stakingContract
  const tokenContract = network.tokenId

  const [stakingError, setStakingError] = useState<any>({
    hasError: false,
    message: ""
  })
  const [unstakingError, setUnstakingError] = useState<any>({
    hasError: false,
    message: ""
  })
  const [unstakeModal, setUnstakeModal] = useState(false)
  const [reward, setReward] = useState<any>(0)
  const [blockStats, setBlocksStats] = useState<any>("")
  const [sessionId, setSessionId] = useState<any>("")
  const { pending, success } = useGetActiveTransactionsStatus()
  useEffect(() => {
    if (success) {
      setStakeAmount(0)
      setUnstakeAmount(0)
    }
  }, [success])

  /**
   * Function for getting the staking state
   */
  const getStakingState = async () => {
    const stakingStateQuery = new Query({
      address: new Address(stakingContract),
      func: new ContractFunction("getStakingState")
    })
    let returnData = ["AQAAAAAAAAVHAAAAAAAAAtQAAAAGBCfh45FF"] //dummy from mainnent
    try {
      const { returnData: result } = await proxy.queryContract(
        stakingStateQuery
      )
      returnData = result
    } catch (err) {
      console.log(err)
      return returnData
    }
    return returnData
  }

  /**
   * Function for getting the stake of the address
   */
  const getAddressStake = async () => {
    const addressStateQuery = new Query({
      address: new Address(stakingContract),
      func: new ContractFunction("getAddressState"),
      args: [new AddressValue(new Address(wallet.address))]
    })
    const { returnData } = await proxy.queryContract(addressStateQuery)
    return returnData
  }
  /**
   * Function for getting the stake of the address
   */
  const getRewards = async () => {
    try {
      const addressStateQuery = new Query({
        address: new Address(stakingContract),
        func: new ContractFunction("calculate_remaining_reward"),
        args: [new AddressValue(new Address(wallet.address))]
      })
      const { returnData } = await proxy.queryContract(addressStateQuery)
      return returnData
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * Function to split the stakingState
   */
  const splitStakingState = (stakingBuffer: any) => {
    let a = 0
    const isActive = "01" == stakingBuffer.toString("hex", a, (a += 1))
    const currentEpoch = parseInt(
      stakingBuffer.toString("hex", a, (a += 8)),
      16
    )
    const currentStakingRound = parseInt(
      stakingBuffer.toString("hex", a, (a += 8)),
      16
    )
    const m = stakingBuffer.readUInt32BE(a)
    a += 4
    const totalStakedAmount =
      new BigNumber(
        "0x" + stakingBuffer.toString("hex", a, (a += m))
      ).toNumber() /
      10 ** 5
    return {
      isActive,
      currentEpoch,
      currentStakingRound,
      totalStakedAmount
    }
  }

  /**
   * Function to split the addressStake
   */
  const splitAddressStake = (addressStake: any) => {
    let a = 0
    const m = addressStake.readUInt32BE(a)
    a += 4
    const stakedAmount =
      new BigNumber(
        "0x" + addressStake.toString("hex", a, (a += m))
      ).toNumber() /
        10 ** 5 || 0
    const unlockEpoch = parseInt(addressStake.toString("hex", a, (a += 8)), 16)
    const currentEpoch = parseInt(addressStake.toString("hex", a, (a += 8)), 16)
    const lastClaimedRound = parseInt(
      addressStake.toString("hex", a, (a += 8)),
      16
    )
    return {
      stakedAmount,
      unlockEpoch,
      currentEpoch,
      lastClaimedRound
    }
  }
  const [stakingData, setStakingData] = useState<any>("")
  const [addressStake, setAddressStake] = useState<any>("")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const asyncFunction = async () => {
      const stakingState = await getStakingState()
      const stakingBuffer = Buffer.from(stakingState[0], "base64")
      // console.debug("staking state: ", stakingState)
      // console.debug("staking buffer: ", splitStakingState(stakingBuffer))
      setStakingData(splitStakingState(stakingBuffer))
    }
    setTimeout(() => {
      asyncFunction()
    }, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!wallet.address) {
      return
    }
    const asyncFunction = async () => {
      const addressStakeData = await getAddressStake()
      const addressBuffer = Buffer.from(addressStakeData[0], "base64")
      setAddressStake(splitAddressStake(addressBuffer))

      const rewardData = await getRewards()
      if (rewardData) {
        setReward(
          rewardData[0].length > 0
            ? parseInt(
                Buffer.from(rewardData[0], "base64").toString("hex"),
                16
              ) /
                10 ** 5 || 0
            : ""
        )
      }
    }
    asyncFunction()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet])

  const handleInputStaking = (value: any) => {
    setStakeAmount(value)
    if (value === " ") {
      console.error("Error: Amount cannot empty")
      setStakingError({
        hasError: true,
        message: "Staking Amount cannot be empty"
      })
      return
    }
    if (value <= 0) {
      console.error("Error:Amount cannot be less or equal to 0 CHECKR")
      setStakingError({
        hasError: true,
        message: "Staking Amount cannot be less or equal to 0 CHECKR"
      })
      return
    }
    if (value < stakingConfig.minimumStakingAmount) {
      console.error(
        `Error: Amount cannot be less than ${stakingConfig.minimumStakingAmount} CHECKR`
      )
      setStakingError({
        hasError: true,
        message: `Staking Amount cannot be less than ${stakingConfig.minimumStakingAmount} CHECKR`
      })
      return
    }
    if (value > userBalance) {
      console.error(
        "Error:Staking Amount cannot be greater than CHECKR balance."
      )
      setStakingError({
        hasError: true,
        message: "Staking Amount cannot be greater than CHECKR balance."
      })
      return
    }
    setStakingError({
      hasError: false,
      message: ""
    })
  }
  const handleMaxAmount = () => {
    setStakeAmount(parseInt(userBalance.toString()) || 0)
    handleInputStaking(parseInt(userBalance.toString()) || 0)
  }
  const handleInputUnstaking = (e: any) => {
    setUnstakeAmount(e)
    if (e === " ") {
      console.error("Error: Amount cannot empty")
      setUnstakingError({
        hasError: true,
        message: "Unstaking Amount cannot be empty"
      })
      return
    }
    if (e <= 0) {
      console.error("Error:Amount cannot be less or equal to 0 CHECKR")
      setUnstakingError({
        hasError: true,
        message: "Unstaking Amount cannot be less or equal to 0 CHECKR"
      })
      return
    }
    if (e > addressStake.stakedAmount) {
      console.error(
        "Error:Unstaking Amount cannot be greater than staked amount"
      )
      setUnstakingError({
        hasError: true,
        message: "Unstaking Amount cannot be greater than staked amount"
      })
      return
    }

    setUnstakingError({
      hasError: false,
      message: ""
    })
  }
  /**
   * Function for adding a stake
   */
  const addStake = async () => {
    const stakingAmount = (stakeAmount * 10 ** 5).toString(16)
    const tokenIdentifier = Buffer.from(tokenContract, "utf8").toString("hex")
    const methodName = Buffer.from("enter_staking", "utf8").toString("hex")
    const hexStakingAmount =
      stakingAmount.length % 2 !== 0 ? `${"0" + stakingAmount}` : stakingAmount
    const txnPayload = new TransactionPayload(
      "ESDTTransfer" +
        "@" +
        tokenIdentifier +
        "@" +
        hexStakingAmount +
        "@" +
        methodName
    )
    const gasLimit = await evaluateGasLimit("enter_staking", [
      new TokenIdentifierValue(tokenContract),
      new BigNumber(stakingAmount)
    ])
    const transaction = new Transaction({
      sender: new Address(wallet.address),
      receiver: new Address(stakingContract),
      chainID: network.chainID,
      // gasLimit: reward > 0 ? 100000000 : ( 50000 + 1500 * txnPayload.length() + 10000000),
      gasLimit,
      data: txnPayload
    })
    const { sessionId } = await sendTransactions({
      transactions: transaction,
      transactionsDisplayInfo: {
        processingMessage: "Adding Stake",
        errorMessage: "Adding Stake Failed",
        successMessage: "Adding Stake Successful"
      },
      redirectAfterSign: false
    })
    if (sessionId) {
      setSessionId(sessionId)
    }
  }

  /**
   * Function for claiming the rewards
   */
  const claimRewards = async () => {
    const contract = new SmartContract({
      address: new Address(stakingContract)
    })
    const callTransactionOne: any = contract.call({
      caller: new Address(wallet.address),
      func: new ContractFunction("claim_rewards"),
      gasLimit: 100000000,
      chainID: network.chainID
    })
    const { sessionId, error } = await sendTransactions({
      transactions: callTransactionOne
    })
  }
  const evaluateGasLimit = async (contractFunction: string, args: any) => {
    const gasConfig = await axios.get(`${network.apiAddress}/network/config`)
    const gasLimit =
      gasConfig.data.data.config.erd_min_gas_limit +
      500000 *
        (stakingData.currentStakingRound ??
          1 - addressStake.lastClaimedRound ??
          0)
    if (gasLimit > gasConfig.data.data.config.erd_max_gas_per_transaction) {
      return gasConfig.data.data.config.erd_max_gas_per_transaction
    }
    return gasLimit
  }
  /**
   * Function for unstaking the rewards
   */
  const unstake = async () => {
    // const myModal = new bootstrap.Modal(document.getElementById("modal1"), {
    //   keyboard: false
    // })
    // myModal.hide()
    setUnstakeModal(false)
    const contract = new SmartContract({
      address: new Address(stakingContract)
    })
    const gasLimit = await evaluateGasLimit("exit_staking", [
      new BigUIntValue(new BigNumber(unstakeAmount * 10 ** 5))
    ])
    // console.log("gasLimit", gasLimit)
    // return
    const callTransactionOne: any = contract.call({
      caller: new Address(wallet.address),
      func: new ContractFunction("exit_staking"),
      gasLimit,
      args: [new BigUIntValue(new BigNumber(unstakeAmount * 10 ** 5))],
      chainID: network.chainID
    })
    const { sessionId } = await sendTransactions({
      transactions: callTransactionOne,
      transactionsDisplayInfo: {
        processingMessage: "Unstaking Tokens",
        errorMessage: "Unstaking Tokens Failed",
        successMessage: "Unstaking Tokens Successful"
      },
      redirectAfterSign: false
    })
    if (sessionId) {
      setSessionId(sessionId)
    }
  }
  const blockTimer = () => {
    // console.debug("Fetch Block Information")
    axios
      .get(`${network.apiAddress}/stats`)
      .then((res) => {
        if (res.status === 200) {
          setBlocksStats(res.data)
        }
      })
      .catch(() => {})
  }
  useEffect(() => {
    blockTimer()
  }, [])
  const [timeRemaining, setTimeRemaining] = useState<any>("")
  useEffect(() => {
    if (!blockStats) {
      return
    }
    const currentTime = new Date()
    let endTime: any = new Date(
      currentTime.getTime() +
        (Number(blockStats.roundsPerEpoch) - Number(blockStats.roundsPassed)) *
          Number(blockStats.refreshRate)
    )
    let newTime: any = dayjs(props.utc_datetime)

    const interval = setInterval(async () => {
      newTime = newTime.add(1, "seconds")
      if (newTime >= endTime) {
        endTime = new Date(
          endTime.getTime() +
            Number(blockStats.refreshRate) * Number(blockStats.roundsPerEpoch)
        )
      }
      const dur: any = dayjs.duration(endTime - newTime)
      setTimeRemaining({
        days: dur.$d.days,
        hours: dur.$d.hours,
        minutes: dur.$d.minutes,
        seconds: dur.$d.seconds
      })
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [blockStats])

  const getAPY = () => {
    const apr: any = (
      (stakingConfig.totalDistribution * 100) /
      stakingData.totalStakedAmount
    ).toFixed(2)
    const apy: any = (1 + (apr * 365) / 100) ** 365 - 1
    return apr
  }

  return (
    <Layout>
      <Head>
        <title>Staking | CheckerChain</title>
        <meta name="description" content="Staking page of CheckerChain" />
      </Head>
      <div className="m-0 lg:m-12">
        <StyledRewardCard>
          <StakingHeader>
            <div className="m-3">
              <div className="grid gap-4 md:grid-cols-2 pt-4">
                <div className="staking__header__left">
                  <div>
                    <h3>Staking Portal</h3>
                  </div>
                  <div className="staking__header__amount mt-4 flex items-center">
                    <div>
                      <img src={CheckerSmallLogo.src} height={30} width={30} />{" "}
                    </div>
                    <div className="px-1">
                      {abbreviateNumber(stakingData?.totalStakedAmount) || 0}{" "}
                      CHECKR
                    </div>
                  </div>
                </div>
                <div className="staking__header__right ">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="staking__apr">
                      <h6>APR</h6>
                      <h4>
                        {stakingData.totalStakedAmount
                          ? abbreviateNumber(getAPY())
                          : 0}
                        %
                      </h4>
                    </div>
                    <div className="col-lg-8 col-md-12 offset-lg-1 col-sm-12 staking__timer">
                      <h6>Next Epoch in</h6>
                      <div className="banner__contents__timer">
                        <div className="timer__card">
                          <div className="timer__card__time">
                            {timeRemaining?.hours}
                          </div>
                          <div className="timer__card__footer">HOURS</div>
                        </div>
                        <div className="timer__divider">:</div>
                        <div className="timer__card">
                          <div className="timer__card__time">
                            {timeRemaining?.minutes}
                          </div>
                          <div className="timer__card__footer">MINS</div>
                        </div>
                        <div className="timer__divider">:</div>
                        <div className="timer__card">
                          <div className="timer__card__time">
                            {timeRemaining?.seconds}
                          </div>
                          <div className="timer__card__footer">SECS</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </StakingHeader>
          <div className="grid gap-4 md:grid-cols-12 mt-3">
            <div className="md:col-span-4 sm:col-span-12">
              <div className="card">
                <StyledStakingCard>
                  <div className="mx-3 staking__image">
                    <img src="/epoch.png" height={20} width={20} />
                  </div>
                  <div className="staking__details">
                    <h6>Current Epoch</h6>
                    <h5>{stakingData?.currentEpoch || "-"}</h5>
                  </div>
                </StyledStakingCard>
              </div>
              <div className="card mt-2">
                <StyledStakingCard>
                  <div className="mx-3 staking__image">
                    <img src={CheckerSmallLogo.src} className="scale-[.6]" />
                  </div>
                  <div className="staking__details">
                    <h6>Total Daily Rewards </h6>
                    <h5>
                      {abbreviateNumber(stakingConfig.stakingPerDay)} CHECKR
                    </h5>
                  </div>
                </StyledStakingCard>
              </div>
              <div className="card mt-2 mb-2">
                <StyledStakingCard>
                  <div className="mx-3 staking__image">
                    <img src="/locked.png" height={20} width={20} />
                  </div>
                  <div className="staking__details">
                    <h6>Total Locked Value</h6>
                    <h5>
                      $
                      {abbreviateNumber(
                        stakingData?.totalStakedAmount *
                          (pairInfo?.basePrice ?? stakingConfig.dollarValue)
                      ) || "0"}
                    </h5>
                  </div>
                </StyledStakingCard>
              </div>
            </div>
            <div className="md:col-span-8 sm:col-span-12 ">
              <StyledAddStakeCard>
                <div className="flex justify-between">
                  <h1 className="mb-4">Stake CHECKR</h1>
                  <div className="truncate ... w-40 text-right">
                    Balance: {abbreviateNumber(userBalance)}
                  </div>
                </div>
                {/* <p>Enter the number of tokens you want to stake.</p> */}
                <div className="add__stake__form">
                  <div className="add__stake__input">
                    <input
                      type="number"
                      inputMode="numeric"
                      // pattern="[0-9]*"
                      placeholder="Amount in CHECKR"
                      onChange={(e) => handleInputStaking(e.target.value)}
                      value={stakeAmount}
                      className={stakingError.hasError ? "error" : ""}
                      disabled={!wallet.connected}
                    />
                    <div
                      className="max-button !z-2"
                      onClick={() => wallet.connected && handleMaxAmount()}
                    >
                      Max
                    </div>
                  </div>
                  <div className="add__stake__button">
                    <button
                      onClick={() => addStake()}
                      disabled={
                        stakingError.hasError || pending || !wallet.connected
                      }
                    >
                      {pending && <i className="fa fa-spinner fa-spin" />}{" "}
                      {pending ? "Staking" : "Stake"}
                    </button>
                  </div>
                </div>
                <small className="py-2" style={{ color: colors.primary }}>
                  {stakingError.hasError && stakingError.message}
                </small>
                <br />
                <small className="pt-5">
                  <i>
                    * Please be noted that all your unclaimed rewards will be
                    claimed if you are re-staking any tokens.
                  </i>{" "}
                </small>
              </StyledAddStakeCard>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-12 mt-3">
            <div className="md:col-span-4 my-2">
              <StakingDisplayCard color={colors.primary}>
                <h1>Portfolio</h1>
                <div className="staking__portfolio">
                  <div className="staking__portfolio__row">
                    <h6>
                      <i className="fa fa-wallet pr-2" />
                      Wallet Address
                    </h6>

                    {wallet.connected && (
                      <h5>
                        {trimWallet(wallet.address)}
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={`${network.explorerAddress}/accounts/${wallet.address}`}
                        >
                          <i className="fa fa-link mx-3" />
                        </a>
                      </h5>
                    )}
                    {!wallet.connected && (
                      <small>Please connect your wallet.</small>
                    )}
                  </div>
                  <div className="staking__portfolio__row">
                    <h6>
                      <i className="fa fa-tachometer pr-2" />
                      Total Staked
                    </h6>
                    <div className="flex">
                      <h5>
                        {abbreviateNumber(addressStake?.stakedAmount) || "0"}{" "}
                        CHECKR{" "}
                      </h5>
                      <button
                        className="mx-2 grid place-content-center staking__row__button"
                        onClick={() => {
                          setUnstakeModal(true)
                          // const myModal = new bootstrap.Modal(
                          //   document.getElementById("modal1"),
                          //   {
                          //     keyboard: false
                          //   }
                          // )
                          // myModal.show()
                        }}
                        disabled={
                          !wallet.connected ||
                          !addressStake.stakedAmount ||
                          pending
                        }
                      >
                        Unstake
                      </button>
                    </div>
                  </div>
                </div>
              </StakingDisplayCard>
            </div>
            <div className="md:col-span-4 my-2">
              <StakingDisplayCard
                color={colors.primary}
                textColor="#1c1c1c"
                textWeight="600"
                progressColor="green"
              >
                <h1>Unclaimed Rewards</h1>
                <div className="staking__portfolio">
                  <div className="staking__portfolio__row flex pr-3 pt-1">
                    {!wallet.connected && (
                      <small>Please connect your wallet.</small>
                    )}
                    {wallet.connected && (
                      <h5 className="flex gap-2 items-center">
                        {" "}
                        <img
                          src={CheckerSmallLogo.src}
                          height={30}
                          width={30}
                        />{" "}
                        {reward || "0"} CHECKR
                      </h5>
                    )}
                  </div>
                  <div className="staking__portfolio__row">
                    <button
                      className="btn btn-primary"
                      disabled={!wallet.connected || !reward || pending}
                      onClick={() => claimRewards()}
                    >
                      {pending && <i className="fa fa-spinner fa-spin px-2" />}{" "}
                      {pending ? "Claiming" : "Claim Rewards"}
                    </button>
                  </div>
                </div>
              </StakingDisplayCard>
            </div>
            <div className="md:col-span-4">
              <a
                href="https://explorer.multiversx.com/accounts/erd1qqqqqqqqqqqqqpgqn8nsu24g9lca74fw0lus2garvhg2alfe2jpsqlysng"
                target="_blank"
                rel="noreferrer"
              >
                <div
                  style={{
                    background: `url('/maiar-bg.png')`,
                    height: "244px",
                    width: "98%",
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                    margin: "10px auto",
                    borderRadius: "20px"
                  }}
                />
              </a>
            </div>
          </div>
        </StyledRewardCard>
      </div>
      <Modal
        closeButton
        className="!w-120"
        display={unstakeModal}
        onHide={() => setUnstakeModal(false)}
      >
        <div>
          <div>
            <div className="border-0">
              <button
                type="button"
                className="btn-close bg-light"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="flex justify-center p-4 mb-3">
              <StyledUnstakeCard>
                <h1 className="text-content-secondary">
                  {addressStake.currentEpoch < addressStake.unlockEpoch
                    ? "Unstake with Penalty"
                    : "Unstake Now"}
                </h1>
                {addressStake.currentEpoch < addressStake.unlockEpoch && (
                  <i>
                    <p className="text-error mt-2">
                      {" "}
                      If you unstake right now you will be charged{" "}
                      {stakingConfig.penaltyRate} % of unstaked amount.
                    </p>
                    <small>
                      Tokens will unlock in next{" "}
                      {addressStake.unlockEpoch - addressStake.currentEpoch}{" "}
                      epochs.
                    </small>
                  </i>
                )}
                <div className="add__stake__form">
                  <div className="add__stake__input relative">
                    <div
                      className="max__amount absolute right-2 top-3 bg-primary-tertiary text-white rounded-lg px-2 py-px"
                      onClick={() =>
                        handleInputUnstaking(addressStake.stakedAmount)
                      }
                    >
                      Max
                    </div>
                    <input
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onChange={(e) => handleInputUnstaking(e.target.value)}
                      value={unstakeAmount}
                      className={`!pr-20 ${unstakingError.hasError && "error"}`}
                    />
                    {unstakingError.hasError && (
                      <small>{unstakingError.message}</small>
                    )}
                  </div>
                  <div className="mt-8">
                    <i>
                      <small>
                        Your Total Stake: {addressStake.stakedAmount} CHECKR
                      </small>
                    </i>
                    <br />

                    {addressStake.currentEpoch >= addressStake.unlockEpoch && (
                      <div className="mt-4">
                        <small>
                          You can withdraw your tokens without penalty.
                        </small>
                        <br />
                      </div>
                    )}
                  </div>
                  <div className="add__stake__button mt-3">
                    <button
                      onClick={() => unstake()}
                      disabled={unstakingError.hasError || pending}
                    >
                      {pending && <i className="fa fa-spinner fa-spin px-2" />}
                      {pending
                        ? "Unstaking"
                        : addressStake.currentEpoch < addressStake.unlockEpoch
                        ? "Unstake with Penalty"
                        : "Unstake Now"}
                    </button>
                  </div>
                </div>
              </StyledUnstakeCard>
            </div>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
export async function getServerSideProps() {
  try {
    const data = await fetch("http://worldtimeapi.org/api/timezone/Etc/UTC", {
      method: "GET"
    })
    const response = data.json()
    return {
      props: response // will be passed to the page component as props
    }
  } catch (e) {
    return {
      props: {
        utc_datetime: new Date().toISOString()
      }
    }
  }
}
export default Staking
