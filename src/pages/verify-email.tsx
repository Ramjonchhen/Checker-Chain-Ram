import { Meta, EmptyState, Button } from "components"
import Layout from "layout"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { api } from "stores"
let dots = "."
const VerifyEmailPage: NextPage = () => {
  //   const {
  //     user
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } = useUserStore((state) => state)
  const router = useRouter()
  const [message, setMessage] = useState("Verifying email address")
  const [isVerified, setVerified] = useState(false)

  useEffect(() => {
    if (router.query) {
      if (router.query?.token) {
        setVerified(false)
        const interval = setInterval(() => {
          if (dots.length < 3) {
            dots += "."
          } else {
            dots = "."
          }
          setMessage(`Verifying email address ${dots}`)
        }, 500)
        api
          .post("/verifyEmail", { token: router.query.token })
          .then((res) => {
            setVerified(res.status === 200)
            clearInterval(interval)
            setMessage("Verification Successful !")
          })
          .catch((err) => {
            clearInterval(interval)
            setVerified(false)
            setMessage(err.response.data.message || "Verification failed.")
          })
      }
    }
  }, [router])

  return (
    <Layout>
      <Meta
        title={`Verify Email | CheckerChain - Crypto Reviews`}
        url="/verify-email"
      />
      <EmptyState
        message={message}
        button={
          isVerified && (
            <Button
              type="button"
              onClick={() => {
                router.replace("/")
              }}
              title="Go to Home"
              variant="outlined"
            />
          )
        }
      />
    </Layout>
  )
}

export default VerifyEmailPage
