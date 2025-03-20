import { axiosInstance } from "api/axiosInterceptor"

export const getWalletInfo = async (walletAddress: string | undefined) => {
  const data = await axiosInstance.get(`/accounts/${walletAddress}`)
  return data
}
export const getWalletTokenInfo = async (walletAddress: string,tokenId: string) => {
  const data = await axiosInstance.get(`/accounts/${walletAddress}/tokens/${tokenId}`)
  return data
}
