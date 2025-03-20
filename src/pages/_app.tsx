import {
  DappProvider,
  useGetAccountInfo,
  useGetLoginInfo,
  TransactionsToastList,
  SignTransactionsModals,
  NotificationModal
} from "lib/dApp-core"
import { Button, Meta, Modal, Text } from "components"
import { Toasts } from "components/toasts"
import { getNetwork } from "config"
import config from "config/config.json"
import type { AppProps } from "next/app"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { useSettingStore, useUserStore, useWalletDialogStore } from "stores"
import { useToastStore } from "stores/toast"
import "../styles/globals.css"
import "animate.css"

// import "@elrondnetwork/dapp-core/dist/index.css"
import { Onboarding } from "modules/onboarding"
import { Toaster } from "react-hot-toast"
import LoadingComponent from "components/Loading/LoadingComponent"
import { useGoogleAnalytics } from "lib/GoogleAnalytics"
import { useSocket } from "hooks/useSocket"
import { useWallet } from "hooks/useWallet"
import { useNotificationStore } from "stores/notification"
import ConnectionModal from "modules/connection/ConnectionModal"
// import RestrictedModal from "components/App_Modals/RestrictedModal"
// export { EnvironmentsEnum } from '@multiversx/sdk-dapp/types/enums.types';

const Main = () => {
  useGoogleAnalytics()
  useSocket()

  const {
    isLoggedIn,
    signInWallet,
    connectWallet,
    signup,
    authorization,
    fetchProfile,
    checkWalletExists,
    isOnboarded,
    checkOnboarded,
    isOnboardedLoaded,
    reset: resetUser,
    getRecommendedFollowers,
    getMe
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useUserStore((state) => state)

  const { reset: resetSettings } = useSettingStore()
  const { errorToast } = useToastStore((state) => state)

  const [maiarLoginDialog, setMaiarLoginDialog] = useState<boolean>(false)
  const { setLoginDialog } = useWalletDialogStore((state) => state)
  const [onboardModal, setOnboardModal] = useState<boolean>(false)

  const router = useRouter()
  const token = window.localStorage.getItem("token") as string

  const { getNotificationData, fetchUnseen } = useNotificationStore()

  const modalRef = useRef<HTMLDivElement>(null)

  // checking whether the token exists on local storage or not
  // and then getting user based on the user and assigning it
  useEffect(() => {
    if (token) {
      getMe(token)
      checkOnboarded()
    }
  }, [])

  useEffect(() => {
    if (router.query.referrer) {
      window.localStorage.setItem("referrer", `${router.query?.referrer}` ?? "")
    }
    if (process.env.NEXT_PUBLIC_NETWORK === "mainnet") {
      console.log = console.debug
    }
  }, [router.query])

  // get notification for user
  useEffect(() => {
    if (token) {
      getNotificationData()
      fetchUnseen()
    }
  }, [token])

  // when user connect any wallets then
  // checking whether user has already been sign up or not
  // if not then creating user account otherwise signing in user
  useEffect(() => {
    // if (!isLoggedIn && !["/"].includes(router.pathname)) {
    //   router.push("/")
    // } else
    if (signInWallet) {
      setMaiarLoginDialog(false)
      checkWalletExists(signInWallet).then((response) => {
        response.data.exists
          ? connectWallet(signInWallet)
          : signup(signInWallet)
              .then(() => {
                setOnboardModal(true)
              })
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .catch((err: any) => {
                if (err.response.status === 429) {
                  errorToast({
                    title: "Onboarding Failed",
                    message:
                      "Too many onboarding attempts please try again later."
                  })
                } else {
                  clearData()
                  errorToast({
                    title: "Onboarding Failed",
                    message: "Something went wrong. Please try again later."
                  })
                }
                setOnboardModal(false)
              })
      })
      checkOnboarded()
      setLoginDialog(false)
    }
    return () => {
      setLoginDialog(false)
      setMaiarLoginDialog(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signInWallet])

  useEffect(() => {
    if (authorization) {
      fetchProfile()
    }
    getRecommendedFollowers()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorization])

  const clearData = () => {
    window.localStorage.clear()
    resetUser()
    resetSettings()
  }

  useEffect(() => {
    if (!isOnboarded && isOnboardedLoaded && isLoggedIn) {
      setOnboardModal(true)
    } else {
      setOnboardModal(false)
    }
  }, [isOnboarded, isOnboardedLoaded, isLoggedIn])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const eachElement = entry.target as HTMLElement
        const animateClass = eachElement.dataset.animate || ""
        if (entry.isIntersecting) {
          if (animateClass) {
            entry.target.classList.add(...animateClass.split(" "))
          }
        } else {
          if (animateClass) {
            entry.target.classList.remove(...animateClass.split(" "))
          }
        }
      })
    })
    const slides = document.querySelectorAll(".animate")
    slides.forEach((slide) => {
      observer.observe(slide)
    })
    return () => {
      slides.forEach((slide) => {
        observer.unobserve(slide)
      })
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const eachElement = entry.target as HTMLElement
        const animateClass = eachElement.dataset.animate || ""
        if (entry.isIntersecting) {
          if (animateClass) {
            entry.target.classList.add(...animateClass.split(" "))
          }
        }
      })
    })
    const slides = document.querySelectorAll(".animate-once")
    slides.forEach((slide) => {
      observer.observe(slide)
    })
    return () => {
      slides.forEach((slide) => {
        observer.unobserve(slide)
      })
    }
  }, [])

  return (
    <>
      {/* <RestrictedModal /> */}

      <Modal display={false} onHide={() => setOnboardModal(false)} closeButton>
        <div className="flex gap-2 flex-col items-center justify-center p-8">
          <span className="text-xl font-semibold block text-center text-primary-tertiary">
            CheckerChain Onboarding is 🔥Live🔥
          </span>
          <Button
            onClick={() => {
              if (authorization) {
                setOnboardModal(false)
                router.push("/onboarding")
                return
              }
              signInWallet &&
                signup(signInWallet)
                  .then(() => {
                    setOnboardModal(false)
                    router.push("/onboarding")
                  })
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .catch((err: any) => {
                    if (err.response.status === 429) {
                      errorToast({
                        title: "Onboarding Failed",
                        message:
                          "Too many onboarding attempts please try again later."
                      })
                    } else {
                      errorToast({
                        title: "Onboarding Failed",
                        message: "Something went wrong. Please try again later."
                      })
                    }
                    setOnboardModal(false)
                  })
            }}
            className="w-full mt-4"
            title="Onboard Now"
          />
        </div>
      </Modal>
      <Modal
        display={maiarLoginDialog}
        onHide={() => setMaiarLoginDialog(false)}
      >
        <div className="flex gap-2 flex-col items-center justify-center">
          <Text
            variant="modal-header"
            className="!text-[16px] block text-center"
          >
            Connect with Maiar
          </Text>
          <div
            ref={modalRef}
            className="text-content-tertiary mb-6 text-center"
          >
            <span>
              Please connect your wallet for using CheckerChain Platform.
            </span>
          </div>
          <div className="text-content-tertiary mb-6 text-center">
            <span>Scan the QR code using Maiar app for login</span>
          </div>
          <Button
            title="Cancel"
            variant="outlined"
            onClick={() => {
              setMaiarLoginDialog(false)
              setLoginDialog(true)
              window.location.reload()
            }}
          />
        </div>
      </Modal>
      <ConnectionModal />
      {/* <LegacyConnectionModal /> */}
      <Onboarding isOpen={onboardModal} setIsOpen={setOnboardModal} />
    </>
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  const walletConnectBridgeAddresses = ["https://bridge.walletconnect.org"]
  const walletConnectBridge =
    walletConnectBridgeAddresses[
      Math.floor(Math.random() * walletConnectBridgeAddresses.length)
    ]
  // const { TransactionsToastList, SignTransactionsModals, NotificationModal } =
  //   DappUI
  const network = getNetwork()
  const walletConnectDeepLink = config.walletConnectLink
  const walletConnectV2ProjectId = config.walletConnectV2ProjectId

  return (
    <>
      <>
        <Meta {...(pageProps?.meta ?? {})} />
        <DappProvider
          customNetworkConfig={{
            name: "customConfig",
            apiTimeout: 6000,
            network,
            walletConnectBridge,
            walletConnectDeepLink,
            walletConnectV2ProjectId
          }}
          dappConfig={{
            shouldUseWebViewProvider: true
          }}
          environment={network.id}
        >
          <>
            <LoadingComponent />
            <Component {...pageProps} />
            <TransactionsToastList />
            <NotificationModal />
            <SignTransactionsModals className="signTransaction" />
            <Main />
            <Toasts />
            <Toaster
              position="bottom-right"
              toastOptions={{
                success: {
                  style: {
                    background: "#2e844a",
                    color: "#fff"
                  }
                },
                error: {
                  style: {
                    background: "#ea001e",
                    color: "#fff"
                  }
                }
              }}
            />
          </>
        </DappProvider>
      </>
    </>
  )
}

export default MyApp
