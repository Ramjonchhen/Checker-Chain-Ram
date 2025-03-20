import { useState, useEffect } from "react"

type CountdownTimer = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const useCountdownTimer = (epochTime: number): CountdownTimer => {
  const [countdown, setCountdown] = useState<CountdownTimer>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const timeDifference = epochTime - Math.floor(Date.now() / 1000)

      if (timeDifference <= 0) {
        clearInterval(interval)
      } else {
        setCountdown({
          days: Math.floor(timeDifference / 86400),
          hours: Math.floor((timeDifference % 86400) / 3600),
          minutes: Math.floor((timeDifference % 3600) / 60),
          seconds: Math.floor(timeDifference % 60)
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [epochTime])

  return countdown
}

export default useCountdownTimer
