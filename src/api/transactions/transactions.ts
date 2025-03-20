/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "api/axiosInterceptor"

export const getContractSuccessfulTransactions = async (contractAddr:any) => {
  const data = await axiosInstance.get(
    `/accounts/${contractAddr}/transactions?status=success&size=10000`,
  )
  return data
}
