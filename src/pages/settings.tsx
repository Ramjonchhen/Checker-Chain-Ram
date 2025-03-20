import { Meta } from "components"
import Layout from "layout"
import { Settings } from "modules/settings"
import { NextPage } from "next"

const SettingPage: NextPage = () => {
  return (
    <Layout>
      <Meta
        title={`Settings | CheckerChain - Crypto Reviews`}
        url="/settings"
      />
      <Settings />
    </Layout>
  )
}

export default SettingPage
