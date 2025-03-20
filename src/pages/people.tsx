import { Meta } from "components"
import Layout from "layout"
import { People } from "modules/people"
import { NextPage } from "next"

const PeoplePage: NextPage = () => {
  return (
    <Layout>
      <Meta title={`People | CheckerChain - Crypto Reviews`} url="/people" />
      <People />
    </Layout>
  )
}

export default PeoplePage
