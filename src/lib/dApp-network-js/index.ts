// import { ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers/out"
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers"
import { getNetwork } from "config"

const network = getNetwork()

export const proxyNetworkProvider = new ApiNetworkProvider(network.apiAddress, {
  timeout: 8000
})
