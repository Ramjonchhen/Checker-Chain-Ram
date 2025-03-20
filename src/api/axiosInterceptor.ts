import axios from "axios"
import config from "config/config.json"
const timeout = 20 * 10000

export const axiosInstance = axios.create({
  baseURL: config.network.apiAddress,
  timeout,
})
// axiosInstance.interceptors.request.use((config) => {
//   // eslint-disable-next-line no-param-reassign
//   config.headers.Authorization = process.env.NEXT_PUBLIC_BACKEND_AUTH

//   return config
// })

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.data) {
      if (error.response.data.message) {
        const { message } = error.response.data
        console.error(new Error(message))
        return
      }
      console.error(error.response.data)
      return
    }
    console.error(new Error("Some unusual error occurred, please try again"))
    return
  },
)
