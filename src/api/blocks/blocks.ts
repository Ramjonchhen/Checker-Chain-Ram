import { axiosInstance } from "api/axiosInterceptor"

export const getBlocks = async () => {
  const data = await axiosInstance.get(`/stats`)
  return data
}

export async function getUTCDateTime() {
  try {
    const data = await fetch("http://worldtimeapi.org/api/timezone/Etc/UTC", {
      method: "GET"
    })
    const response = data.json()
    return {
      props: response // will be passed to the page component as props
    }
  } catch (e) {
    return {
      props: {
        utc_datetime: new Date().toISOString()
      }
    }
  }
}
