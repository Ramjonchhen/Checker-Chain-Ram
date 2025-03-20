/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Address, ContractFunction, Query } from "lib/dApp-js"
import { getPairs } from "api/pairs/pairs"
import { CopyIcon } from "assets/icons"
import { StyledLiquidityCard } from "assets/styles/component/Card.style"
import { Button } from "components/button"
import config from "config/config.json"
import { useWallet } from "hooks/useWallet"
import Layout from "layout"
import Head from "next/head"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { proxyNetworkProvider as proxy } from "lib/dApp-network-js"

import { getWalletTokenInfo } from "../api/wallet/wallet"
import { Meta } from "components"

const Liquidity = () => {
  const [pairInfo, setPairInfo] = useState<any>({})
  const [pair, setPair] = useState<any>({
    checkrReserve: 0,
    egldReserve: 0,
    totalSupply: 0
  })
  const [adminBalance, setAdminBalance] = useState<any>(0)
  const [userPair, setUserPair] = useState<any>("")
  const poolAddress =
    "erd1qqqqqqqqqqqqqpgqn8nsu24g9lca74fw0lus2garvhg2alfe2jpsqlysng"
  const pairAddress =
    "erd1qqqqqqqqqqqqqpgqn8nsu24g9lca74fw0lus2garvhg2alfe2jpsqlysng"
  const totalRewardAmount = 500000000000 * 12

  const getPairData = async () => {
    const pairQuery = new Query({
      address: new Address(pairAddress),
      func: new ContractFunction("getReservesAndTotalSupply")
    })
    const { returnData } = await proxy.queryContract(pairQuery)
    return returnData
  }
  const { wallet, abbreviateNumber } = useWallet()
  useEffect(() => {
    ;(async () => {
      const pairInfo: any = await getPairs("CHECKR-60108b", "WEGLD-bd4d79")
      setPairInfo(pairInfo)
      const tokenPairInfo = await getPairData()
      const checkrReserve = parseInt(
        Buffer.from(tokenPairInfo[0], "base64").toString("hex"),
        16
      )
      const egldReserve = parseInt(
        Buffer.from(tokenPairInfo[1], "base64").toString("hex"),
        16
      )
      const totalSupply = parseInt(
        Buffer.from(tokenPairInfo[2], "base64").toString("hex"),
        16
      )
      setPair({
        checkrReserve,
        egldReserve,
        totalSupply
      })
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const adminTokenBalance: any = await getWalletTokenInfo(
        "erd1etc40u484jry3wtu0ch5hzndhs87xuvd6wwcu92wnleau3vgp8dsg77rmm",
        "CHECKREGLD-73c669"
      )
      if (adminTokenBalance) {
        const adminBalance = adminTokenBalance.balance as number
        setAdminBalance(
          ((adminBalance / pair.totalSupply) * pair.checkrReserve).toFixed(0)
        )
      }
      if (wallet.address && pair.totalSupply !== 0) {
        const pairTokenBalance: any = await getWalletTokenInfo(
          wallet.address,
          "CHECKREGLD-73c669"
        )
        if (pairTokenBalance) {
          setUserPair({
            checkr: (
              ((pairTokenBalance.balance / pair.totalSupply) *
                pair.checkrReserve) /
              10 ** 5
            ).toFixed(0),
            egld: (
              ((pairTokenBalance.balance / pair.totalSupply) *
                pair.egldReserve) /
              10 ** 18
            ).toFixed(0)
          })
        }
      }
    })()
  }, [wallet, pair])
  return (
    <Layout>
      <Meta
        title={"Liquidity | Checkerchain - Crypto Reviews"}
        url="liquidity-old"
      />

      <div className="m-12">
        <div className="">
          <div className="col-md-12">
            <StyledLiquidityCard className="bg-white">
              <div className="text-content-primary font-medium text-3xl mx-3">
                Liquidity
              </div>
              <div className="grid grid-cols-3 mt-3">
                <div className="col-lg-4 col-md-12  p-0">
                  <div className="card info-card ml-3">
                    <div className="icon">
                      <i className="fas fa-coins " />
                    </div>
                    <h6>Price</h6>
                    <h5>$ {pairInfo?.basePrice?.toFixed(5)}</h5>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12  p-0">
                  <div className="card info-card  ml-3">
                    <div className="icon">
                      <i className="fab fa-hive " />
                    </div>
                    <h6>Total Liquidity</h6>
                    <h5>
                      $ {abbreviateNumber(pairInfo?.totalValue?.toFixed(2))}
                    </h5>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12  p-0 ">
                  <div className="card info-card border-none  ml-3">
                    <div className="icon">
                      <i className="fas fa-chart-line" />
                    </div>
                    <h6>24h Volume</h6>
                    <h5>
                      $ {abbreviateNumber(pairInfo?.volume24h?.toFixed(2))}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="pt-5 card-row mx-3">
                <h4 className="mb-4">Active Pools</h4>
                <div
                  className="bg-[#cff4fc] p-4 mb-5 flex gap-2 flex-wrap"
                  role="alert"
                >
                  Import this pool address in Maiar:
                  <div className="flex gap-2">
                    <span className="block md:hidden">
                      {poolAddress.slice(0, 6)}
                      ...
                      {poolAddress.slice(
                        poolAddress.length - 6,
                        poolAddress.length
                      )}
                    </span>
                    <span className="hidden md:block">{poolAddress}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(poolAddress)
                        toast.success("Copied Successfully.")
                      }}
                    >
                      <CopyIcon className="text-black w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="card p-4 flex flex-row justify-between pool-card">
                  <div className="col-lg-2 col-md-12 col-sm-12 flex gap-2 items-center">
                    <div className="flex flex-col">
                      <img
                        src="/egld.png"
                        height="25px"
                        width="25px"
                        className="ml-1 object-contain"
                      />
                      <img
                        className="mt-2 object-contain"
                        src="/Checker.png"
                        height="30px"
                        width="35px"
                      />
                    </div>
                    <div className="ml-3">
                      <h6>Pool Name</h6>
                      <h5>CHECKR-EGLD</h5>
                      <a
                        href="https://explorer.multiversx.com/accounts/erd1qqqqqqqqqqqqqpgqn8nsu24g9lca74fw0lus2garvhg2alfe2jpsqlysng"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <small>View Pool</small>
                      </a>
                    </div>
                  </div>

                  <div className="col-lg-2 col-md-12  col-sm-12  flex justify-center flex-col">
                    <h6>Your Liquidity</h6>
                    <h5 className="flex gap-2">
                      <img
                        src="/Checker.png"
                        height="15px"
                        width="15px"
                        className="mr-1 object-contain"
                      />
                      {userPair?.checkr > 0
                        ? abbreviateNumber(userPair.checkr)
                        : 0}
                    </h5>
                    <h5 className="flex gap-2">
                      <img
                        src="/egld.png"
                        height="15px"
                        width="15px"
                        className="mr-1 object-contain"
                      />
                      {userPair?.egld > 0 ? abbreviateNumber(userPair.egld) : 0}
                    </h5>
                  </div>
                  <div className="col-lg-2 col-md-12  col-sm-12  flex justify-center flex-col">
                    <h6>Pool Liquidity</h6>
                    <h5 className="flex gap-2">
                      <img
                        src="/Checker.png"
                        height="15px"
                        width="15px"
                        className="mr-1 object-contain"
                      />
                      {abbreviateNumber(
                        (pair.checkrReserve / 10 ** 5)?.toFixed(0)
                      )}
                    </h5>
                    <h5 className="flex gap-2">
                      <img
                        src="/egld.png"
                        height="15px"
                        width="15px"
                        className="mr-1 object-contain"
                      />
                      {abbreviateNumber(
                        (pair.egldReserve / 10 ** 18)?.toFixed(0)
                      )}
                    </h5>
                  </div>
                  <div className="col-lg-1 col-md-12 col-sm-12  flex justify-center flex-col">
                    <h6>APR</h6>
                    <h5>
                      {(
                        parseFloat(
                          (
                            totalRewardAmount /
                            (pair.checkrReserve - adminBalance)
                          ).toFixed(2)
                        ) * 100
                      ).toFixed(0)}
                      %
                    </h5>
                  </div>
                  <div className="col-lg-1 col-md-12  col-sm-12  flex justify-center flex-col">
                    <h6>Rewards</h6>
                    <h5
                      style={{
                        fontSize: 14,
                        fontWeight: 300,
                        color: "#1c1c1c !important"
                      }}
                    >
                      <a
                        href="https://docs.google.com/spreadsheets/d/1JfJJcGhB4_Kh0-rmUu7k9y3moEcmVvY8JQg4d0Gg9hI/edit?usp=sharing"
                        target="_blank"
                        style={{ color: "#1c1c1c !important" }}
                        rel="noreferrer"
                      >
                        View Here
                      </a>
                    </h5>
                  </div>

                  <div className="col-lg-2 col-md-12  col-sm-12  flex justify-center flex-col">
                    <a
                      href="https://maiar.exchange/liquidity/add?firstToken=CHECKR-60108b&secondToken=EGLD"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button title="Add Liquidity" />
                    </a>
                  </div>
                </div>
              </div>
              <h4 className="mb-4 pt-5 mx-3">Listed On</h4>
              <div className="grid md:grid-cols-3 card-row mx-3">
                <div className="col-md-4 flex items-center justify-center">
                  <div className=" listed-logo">
                    <a
                      href="https://www.xt.com/tradePro/checkr_usdt"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {" "}
                      <img
                        src="/xt.png"
                        alt="xt"
                        className="img-fluid"
                        width="200px"
                      />
                    </a>
                  </div>
                </div>
                <div className="col-md-4 flex items-center justify-center">
                  <div className=" listed-logo">
                    <a
                      href=" https://www.bitmart.com/trade/en?symbol=CHECKR_USDT&layout=basic"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src="/bitmart-logo.png"
                        alt="xt"
                        className="img-fluid"
                        width="200px"
                      />
                    </a>
                  </div>
                </div>
                <div className="col-md-4 flex items-center justify-center">
                  <div className=" listed-logo">
                    <a
                      href="   https://maiar.exchange/swap?firstToken=CHECKR-60108b&secondToken=EGLD"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src="/maiar-logo.png"
                        alt="xt"
                        className="img-fluid"
                        width="200px"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </StyledLiquidityCard>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Liquidity
