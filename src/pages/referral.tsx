import { Meta } from "components"
import Layout from "layout"
import { ReferralMain } from "modules/referral/ReferralMain"
const Referral = () => {
  return (
    <Layout>
      <Meta title={`Referal | CheckerChain - Crypto Reviews`} url="/referral" />
      <ReferralMain />
    </Layout>
  )
}

export default Referral
