/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Card } from "components"
// import { RewardProfile } from "modules/rewards"
// import { ClaimCheckerPoints } from "modules/rewards/dashboard/ClaimCheckerPoints"
// import { RewardsRow } from "modules/rewards/dashboard/RewardsRow"
import Head from "next/head"

import Layout from "layout"
import { twMerge } from "tailwind-merge"
import { constants } from "constants/common"
import RewardsPage from "modules/rewardsV2"

const Rewards = () => {
  return (
    <Layout>
      <Head>
        <title>Rewards | CheckerChain</title>
      </Head>
      <div className={twMerge(`${constants.APP_CONTAINER_WIDTH}`)}>
        <RewardsPage />
      </div>

      {/* <div
        className={twMerge(
          "flex gap-4 py-5 flex-col md:flex-row ",
          constants.APP_CONTAINER_WIDTH
        )}
      >
        <RewardProfile className="w-full md:max-w-[400px] " />
        <Card className="w-full">
          <ClaimCheckerPoints />
          <RewardsRow />
        </Card>
      </div> */}
      {/* m-2 sm:m-12 grid md:grid-cols-8 grid-cols-1 gap-8 mb-20 bg-rose-300 */}
      {/* col-span-6 sm:col-span-2 */}
    </Layout>
  )
}

export default Rewards
