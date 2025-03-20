/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "api/axiosInterceptor"

export const getTokensInfo = async (tokenId:any) => {
  const data = await axiosInstance.get(`/tokens/${tokenId}`)
  return data
}
