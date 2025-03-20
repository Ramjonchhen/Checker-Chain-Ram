import { useEffect } from "react"
import { useRouter } from "next/router"

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const trackPageView = (url: string) => {
  if (window !== undefined) {
    // @ts-ignore
    window.gtag("config", `${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`, {
      page_path: url
    })
  }
}

export const trackEvent = ({
  action,
  category,
  label,
  value
}: {
  action: string
  category: string
  label: string
  value: string
}) => {
  if (window !== undefined) {
    // @ts-ignore
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value
    })
  }
}

export const useGoogleAnalytics = () => {
  const router = useRouter()

  useEffect(() => {
    router.events.on("routeChangeComplete", trackPageView)

    return () => {
      router.events.off("routeChangeComplete", trackPageView)
    }
  }, [router.events])

  return null
}

export const GA_EVENT_SEARCH_FROM_HOMEPAGE = "search_from_homepage"
export const GA_EVENT_SEARCH_TOPBAR = "search_from_topbar"
