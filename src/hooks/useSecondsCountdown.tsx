import { useState, useEffect, useCallback } from "react"

type CountdownTimer = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const useSecondsCountdown = (initialSeconds: number): CountdownTimer => {
  const calculateTimeLeft = useCallback((seconds: number) => {
    if (seconds <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    return {
      days: Math.floor(seconds / 86400),
      hours: Math.floor((seconds % 86400) / 3600),
      minutes: Math.floor((seconds % 3600) / 60),
      seconds: Math.floor(seconds % 60)
    }
  }, [])

  const [timeLeft, setTimeLeft] = useState<CountdownTimer>(() =>
    calculateTimeLeft(initialSeconds)
  )
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds)

  useEffect(() => {
    const interval: NodeJS.Timeout = setInterval(() => {
      setSecondsRemaining((prev) => {
        const newSeconds = prev - 1
        setTimeLeft(calculateTimeLeft(newSeconds))
        if (newSeconds <= 0) {
          clearInterval(interval)
        }
        return newSeconds
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [calculateTimeLeft])

  return timeLeft
}

export default useSecondsCountdown
