/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"

export const useInterval = (callback:any, delay:any) => {
  const intervalRef = React.useRef<any>(null)
  const savedCallback = React.useRef(callback)
  React.useEffect(() => {
    savedCallback.current = callback
  }, [callback])
  React.useEffect(() => {
    const tick = () => savedCallback.current()
    if (typeof delay === "number") {
      intervalRef.current = window.setInterval(tick, delay)
      return () => window.clearInterval(intervalRef.current)
    }
  }, [delay])
  return intervalRef
}
