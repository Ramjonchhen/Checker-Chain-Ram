import { IVestingData } from "modules/vesting"
import VestingLandingTopSection from "./VestingLandingTopSection"
import VestingTable from "./VestingTable"

type Props = {
  onVestingRowClick: (id: IVestingData) => void
  vestingData: IVestingData[]
  holdersCount: number
  setPage: (page: number) => void
  page: number
}

const VestingLanding = ({ onVestingRowClick, vestingData, holdersCount, setPage, page }: Props) => {
  return (
    <div>
      <VestingLandingTopSection vestingData={vestingData} />
      <VestingTable
        onVestingRowClick={onVestingRowClick}
        vestingData={vestingData}
        holdersCount={holdersCount}
        setPage={setPage}
        page={page}
      />
    </div>
  )
}

export default VestingLanding
