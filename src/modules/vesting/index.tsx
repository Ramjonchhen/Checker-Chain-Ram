/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"
import VestingDetail from "./components/VestingDetail/VestingDetail"
import VestingLanding from "./components/VestingLanding/VestingLanding"
import { useVestingContract } from "hooks/useVestingContract"
import { useUserStore } from "stores"
import { ArrayVecType } from "lib/dApp-js"
import _ from "lodash"
import { useGetActiveTransactionsStatus } from "@multiversx/sdk-dapp/hooks"

type Props = {
  utc_datetime: string
}

export type IVestingData = {
  initialized: boolean
  beneficiary: string
  creator: string
  cliff: number
  start: number
  duration: number
  revocable: boolean
  amount_total: number
  released: number
  revoked: boolean
  vesting_schedule_id: any
  claimable: number
}

let isFetching = false

const Vesting = ({ utc_datetime }: Props) => {
  const { getHoldersCount, getVestingSchedulesByHash, getVestingScheduleId } =
    useVestingContract()
  const limit = 6
  const [page, setPage] = useState<number>(1)
  const [totalHolding, setTotalHolding] = useState<number>(0)
  const { user } = useUserStore()
  // const [user, setUser] = useState<any>({
  //   wallet: "erd1hhxnkg7k8udnjmx2fxslyf4jytjvmg8c7dqyl9dn2g5fuux00k2qxa2uuu",
  // })
  const { success } = useGetActiveTransactionsStatus()

  const [vestingData, setVestingData] = useState<IVestingData[]>([])

  const [selectedVestingDataItem, setSelectedVestingDataItem] = useState<
    IVestingData | null | undefined
  >(null)

  const onVestingRowClick = (vestingDataItem: IVestingData) => {
    if (vestingDataItem.amount_total === vestingDataItem.released) {
      return
    }
    setSelectedVestingDataItem(vestingDataItem)
    // let cachedVestingData = window.localStorage.getItem("vesting")
    // if (cachedVestingData) {
    //   const cachedVesting = JSON.parse(cachedVestingData)
    //   cachedVestingData = JSON.stringify({
    //     ...cachedVesting,
    //     vestingItem: vestingDataItem,
    //     utc_datetime: Date.now(),
    //   })
    // } else {
    //   cachedVestingData = JSON.stringify({
    //     vestingItem: vestingDataItem,
    //     utc_datetime: Date.now(),
    //     wallet: user.wallet
    //   })
    // }
    // window.localStorage.setItem("vesting", cachedVestingData)
  }

  const onGoBack = () => {
    setSelectedVestingDataItem(null)
  }

  const fetchHoldersCount = async (): Promise<number> => {
    // return Promise.resolve(41)
    const holdersCount = await getHoldersCount(user.wallet)
    const holdersCountNumber = Number(holdersCount)
    return holdersCountNumber
  }

  const getVestingSchedulesIdArrayFromHoldersCount = async (
    holdersCountValue: number
  ) => {
    let vestingSchedulesIdArray: any = []
    if (!isNaN(holdersCountValue)) {
      console.log("holdersCountValue", holdersCountValue)
      const fromPage = Math.ceil(holdersCountValue / limit) - page + 1
      const from = (fromPage - 1) * limit
      const to =
        fromPage * limit > holdersCountValue
          ? holdersCountValue
          : fromPage * limit
      for (let i = from; i < to; i++) {
        const vestingSchedulesIndividualIdData = getVestingScheduleId(
          user.wallet,
          i
        )
        vestingSchedulesIdArray = [
          ...vestingSchedulesIdArray,
          vestingSchedulesIndividualIdData
        ]
        // enhancement: can clean up from here to remove undefined values
      }
    }
    return vestingSchedulesIdArray
  }

  const getVestingSchedules = async (
    vestingSchedulesIdArray: ArrayVecType[]
  ) => {
    let finalVestingData: any = []
    for (const scheduleId of vestingSchedulesIdArray) {
      const individualData = await getVestingSchedulesByHash(scheduleId)
      if (!individualData) continue
      finalVestingData = [...finalVestingData, individualData]
    }
    const orderedVestingDetails = _.reverse(finalVestingData)
    setVestingData(orderedVestingDetails)
    // window.localStorage.setItem("vesting", JSON.stringify({
    //   vestingData: orderedVestingDetails,
    //   utc_datetime: Date.now(),
    //   wallet: user.wallet
    // }))
  }

  const fetchVestingData = async () => {
    if (isFetching) return
    isFetching = true
    setVestingData([])
    const holdersCountValue = await fetchHoldersCount()
    setTotalHolding(holdersCountValue)
    if (!holdersCountValue) return

    const vestingSchedulesIdArray: ArrayVecType[] =
      await getVestingSchedulesIdArrayFromHoldersCount(holdersCountValue)
    console.log("vestingSchedulesIdArray", vestingSchedulesIdArray)
    getVestingSchedules(vestingSchedulesIdArray)
    isFetching = false
  }

  useEffect(() => {
    if (success) {
      getVestingSchedulesByHash(
        selectedVestingDataItem?.vesting_schedule_id
      ).then((data) => {
        if (!data) return
        setSelectedVestingDataItem(data)
        // update vestingData array too
        const updatedVestingData = vestingData.map((vestingDataItem) => {
          if (
            vestingDataItem.vesting_schedule_id === data.vesting_schedule_id
          ) {
            return data
          }
          return vestingDataItem
        })
        setVestingData(updatedVestingData)
        // window.localStorage.setItem("vesting", JSON.stringify({
        //   vestingData: updatedVestingData,
        //   utc_datetime: Date.now(),
        //   wallet: user.wallet

        // }))
      })
    }
  }, [success])

  useEffect(() => {
    if (user.wallet && page) {
      fetchVestingData()
    }
  }, [user.wallet, page])

  return (
    <div className="min-h-[calc(100vh-316px)] py-4 md:py-8 lg:py-12">
      {selectedVestingDataItem ? (
        <VestingDetail
          vestingDataItem={selectedVestingDataItem}
          onGoBack={onGoBack}
          utc_datetime={utc_datetime}
        />
      ) : (
        <VestingLanding
          onVestingRowClick={onVestingRowClick}
          vestingData={vestingData}
          holdersCount={totalHolding}
          setPage={setPage}
          page={page}
        />
      )}
    </div>
  )
}

export default Vesting
