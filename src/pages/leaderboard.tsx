import { Meta } from "components"
import Layout from "layout"
import { LeaderboardMain } from "modules/leaderboard/LeaderboardMain"

const Leaderboard = () => {
  return (
    <Layout>
      <Meta
        title={`Leaderboard | CheckerChain - Crypto Reviews`}
        url="/leaderboard"
      />
      <LeaderboardMain />
    </Layout>
  )
}

export default Leaderboard
