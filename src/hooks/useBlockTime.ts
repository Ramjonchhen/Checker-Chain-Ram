/* eslint-disable @typescript-eslint/no-explicit-any */
// import axios from "axios"
import dayjs from "lib/dateLib"
import { useEffect, useState } from "react"
import axios from "axios"
import { getNetwork } from "config"

const network = getNetwork()

export const useBlockTime = (utc_datetime: any) => {
  const [blockStats, setBlockStats] = useState<any>("")
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const blockTimer = () => {
    console.debug("Fetch Block Information")
    axios
      .get(
        `${network.apiAddress
        }/stats`
      )
      .then((res) => {
        if (res.status === 200) {
          setBlockStats(res.data)
        }
      })
      .catch(() => { })
  }
  useEffect(() => {
    blockTimer()
  }, [])
  useEffect(() => {
    if (!blockStats) {
      return
    }
    const currentTime = new Date()
    let endTime: any = new Date(
      currentTime.getTime() +
      (Number(blockStats.roundsPerEpoch) - Number(blockStats.roundsPassed)) *
      Number(blockStats.refreshRate)
    )
    let newTime: any = dayjs(utc_datetime)

    const interval = setInterval(async () => {
      newTime = newTime.add(1, "seconds")
      if (newTime >= endTime) {
        endTime = new Date(endTime.getTime() + (Number(blockStats.roundsPerEpoch) * Number(blockStats.refreshRate)))
      }
      const dur: any = dayjs.duration(endTime - newTime)

      setTimeRemaining({
        days: dur.$d.days,
        hours: dur.$d.hours,
        minutes: dur.$d.minutes,
        seconds: dur.$d.seconds
      })
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [blockStats])
  return { timeRemaining, blockStats }
}
