import { axiosInstance } from "api/axiosInterceptor"

export const getPairs = async (firstToken: string, secondToken: string) => {
    const data = await axiosInstance.get(
        `/mex/pairs/${firstToken}/${secondToken}`,
    )
    return data
}