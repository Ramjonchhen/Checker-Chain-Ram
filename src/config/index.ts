import config from "config/config.json";

export const getNetwork = () => {
  switch (process.env.NEXT_PUBLIC_NETWORK) {
    case "mainnet":
      return config.mainnet;
    case "devnet":
      return config.devnet;
    default:
      return config.mainnet;
  }
}

