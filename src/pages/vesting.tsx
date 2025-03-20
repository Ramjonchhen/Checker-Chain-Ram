import { Meta } from "components"
import Layout from "layout"
import Vesting from "modules/vesting"
import { NextPage } from "next"
import { constants } from "constants/common"
import { getUTCDateTime as getServerSideProps } from "api/blocks/blocks"
type Props = {
  utc_datetime: string
}
const VestingPage: NextPage<Props> = ({ utc_datetime }) => {
  return (
    <Layout>
      <Meta title={`Vesting | CheckerChain - Crypto Reviews`} url="/vesting" />
      <div
        className={`${constants.APP_CONTAINER_WIDTH} ${constants.APP_CONTAINER_PADDING}`}
      >
        <Vesting utc_datetime={utc_datetime} />
      </div>
    </Layout>
  )
}

export { getServerSideProps }

export default VestingPage
