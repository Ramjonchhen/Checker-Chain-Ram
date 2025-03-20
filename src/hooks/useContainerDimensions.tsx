import { useState, useEffect, RefObject } from "react"

export const useContainerDimensions = (myRef: RefObject<HTMLDivElement>) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const getDimensions = () => ({
      width: myRef?.current?.offsetWidth ?? 0,
      height: myRef?.current?.offsetHeight ?? 0
    })

    const handleResize = () => {
      setDimensions(getDimensions())
    }

    if (myRef.current) {
      setDimensions(getDimensions())
    }

    const resizeObserver = new ResizeObserver(() => {
      // Do what you want to do when the size of the element changes
      handleResize()
    })
    if (myRef.current) resizeObserver.observe(myRef.current)
    return () => resizeObserver.disconnect()

    // window.addEventListener("resize", handleResize)

    // return () => {
    //   window.removeEventListener("resize", handleResize)
    // }
  }, [myRef])

  return dimensions
}
