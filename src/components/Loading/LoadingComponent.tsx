import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { LoadingIcon } from "assets/icons"

function LoadingComponent() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleStart = (url: string) => {
      url !== router.asPath && setLoading(true)
    }
    const handleComplete = (url: string) => {
      setLoading(false)
    }

    router.events.on("routeChangeStart", handleStart)
    router.events.on("routeChangeComplete", handleComplete)
    router.events.on("routeChangeError", handleComplete)

    return () => {
      router.events.off("routeChangeStart", handleStart)
      router.events.off("routeChangeComplete", handleComplete)
      router.events.off("routeChangeError", handleComplete)
    }
  })

  if (loading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center fixed top-0 left-0 z-[99999999] bg-white fill-orange-800">
        <LoadingIcon className="w-16 h-16 text-primary" />
      </div>
    )
  }
  return null
}

export default LoadingComponent
