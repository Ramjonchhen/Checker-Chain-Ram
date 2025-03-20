import { Meta } from "components"
import Layout from "layout"
import { DiscussionsLanding } from "modules/discussions"
import { NextPage } from "next"

const DiscussionPage: NextPage = () => {
  return (
    <Layout>
      <Meta title="CheckerChain - Crypto Reviews" url="/community" />
      <DiscussionsLanding />
    </Layout>
  )
}

export default DiscussionPage
