import { WalletIcon } from "assets/icons"
import { IConnectionItem, ISocailLogin } from "./ConnectionItem"
import {
  BinanceIcon,
  BinancePayIcon,
  CoinbaseIcon,
  LedgerIcon,
  MetamaskIcon,
  MultiverseIcon,
  TrustwalletIcon,
  WalletConnectIcon,
  XAliasIcon,
  XPortalIcon,
  PhantomIcon,
  SubWalletIcon,
  XIcon,
  GoogleIcon
} from "assets/icons/walletIcons"

export const mainConnectionItems: IConnectionItem[] = [
  {
    isComingSoon: false,
    walletName: "MetaMask",
    walletType: "Web/Mobile",
    icon: <MetamaskIcon />,
    isPrimary: false
  },
  {
    isComingSoon: false,
    walletName: "Phantom",
    walletType: "Mobile",
    icon: <PhantomIcon />,
    isPrimary: false
  },
  {
    isComingSoon: false,
    walletName: "Trust Wallet",
    walletType: "Mobile",
    icon: <TrustwalletIcon />,
    isPrimary: false
  },
  {
    isComingSoon: false,
    walletName: "Coinbase",
    walletType: "Web/Mobile",
    icon: <CoinbaseIcon />,
    isPrimary: false
  },
  {
    isComingSoon: true,
    walletName: "WalletConnect",
    walletType: "Web/ Mobile",
    icon: <WalletConnectIcon />,
    isPrimary: false
  },
  {
    isComingSoon: false,
    walletName: "SubWallet",
    walletType: "Web/ Mobile",
    icon: <SubWalletIcon />,
    isPrimary: false
  },
  {
    isComingSoon: false,
    walletName: "MultiversX",
    walletType: "Web",
    icon: <MultiverseIcon />,
    isPrimary: true
  }
]

export const allConnectionItems: IConnectionItem[] = [
  ...mainConnectionItems,
  {
    isComingSoon: false,
    walletName: "Ledger",
    walletType: "Web",
    icon: <LedgerIcon />,
    isPrimary: true
  },
  {
    isComingSoon: false,
    walletName: "Web Wallet",
    walletType: "Web",
    icon: <WalletIcon className="text-black" />,
    isPrimary: true
  },
  {
    isComingSoon: false,
    walletName: "xPortal",
    walletType: "Web",
    icon: <XPortalIcon />,
    isPrimary: true
  }
]

export const socialLoginItems: ISocailLogin[] = [
  {
    name: "Google",
    icon: <GoogleIcon />
  },
  {
    name: "X",
    icon: <XIcon />
  }
]
