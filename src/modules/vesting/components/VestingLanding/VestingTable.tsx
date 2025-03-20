import PaginateBtn from "components/paginationBtns"
import { useState } from "react"
import VestingTableItem from "./VestingTableItem"
import { IVestingData } from "modules/vesting"

const cols = ["Type", "Amount", "Duration", "Age", "Unlocked", ""]

type Props = {
  onVestingRowClick: (id: IVestingData) => void
  vestingData: IVestingData[]
  holdersCount: number
  setPage: (page: number) => void
  page: number
}

function VestingTable({
  onVestingRowClick,
  vestingData,
  holdersCount,
  setPage,
  page
}: Props) {
  const [currentPage, setCurrentPage] = useState(page)
  return (
    <div className="mt-5">
      <div className="bg-white rounded-lg overflow-hidden overflow-x-auto">
        <table className="min-w-full bg-white p-0 border-collapse border-spacing-0">
          <thead>
            <tr className="bg-neutral-50">
              {cols.map((col) => (
                <th
                  className="py-4 pl-6 text-left text-xs leading-4 font-medium text-neutral-600"
                  key={`vesting${col}`}
                >
                  {col}
                </th>
              ))}
              <th colSpan={2}></th>
            </tr>
          </thead>
          <tbody>
            {vestingData.map((vestingDataItem) => (
              <VestingTableItem
                key={vestingDataItem.vesting_schedule_id.toString()}
                onVestingRowClick={onVestingRowClick}
                vestingDataItem={vestingDataItem}
              />
            ))}
          </tbody>
        </table>
        <div className="h-20 pt-6 pr-6 flex justify-end">
          <PaginateBtn
            totalData={holdersCount}
            currentLimit={6}
            onPageChange={(page) => {
              setCurrentPage(page)
              setPage(page)
            }}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  )
}
export default VestingTable
