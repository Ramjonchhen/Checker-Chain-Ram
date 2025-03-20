/* eslint-disable @typescript-eslint/no-explicit-any */
import { Meta } from "components"
import { Liquidity } from "modules/liquidity"
import Layout from "layout"

export default function LiquidityPage() {
  return (
    <Layout>
      <Meta
        title={`Liquidity | CheckerChain - Crypto Reviews`}
        url="liquidity"
      />
      <Liquidity />
    </Layout>
  )
}
