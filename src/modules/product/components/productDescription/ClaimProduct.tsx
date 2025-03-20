import psl from "psl"
import { useProductStore } from "stores/product"
import { UpdateButton } from "components"
import { useEffect, useState } from "react"
import { useProductContract } from "hooks/useProductContract"
import { useTrackTransactionStatus } from "lib/dApp-core"
import { useUserStore } from "stores"
import { useToastStore } from "stores/toast"

type Props = {
  isCreateProduct?: boolean
}

const ClaimProduct = ({ isCreateProduct = false }: Props) => {
  const { product, checkClaim, syncProduct } = useProductStore()
  const { claimProduct } = useProductContract()
  const { user } = useUserStore()
  const { errorToast, successToast } = useToastStore()

  const [sid, setSid] = useState<string | null>("")

  const { isCancelled, isPending, isSuccessful, isFailed } =
    useTrackTransactionStatus({
      transactionId: sid
    })

  const [claimLoading, setClaimLoading] = useState(false)

  useEffect(() => {
    if (isSuccessful) {
      setClaimLoading(false)
      setSid(null)
      successToast({
        message: "Product claim requested successfully"
      })
      syncProduct(product?._id || "")
    } else if (isCancelled) {
      setClaimLoading(false)
      setSid(null)
      errorToast({
        message: "Product claim cancelled"
      })
    } else if (isFailed) {
      setClaimLoading(false)
      setSid(null)
      errorToast({
        message: "Product claim failed"
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCancelled, isFailed, isSuccessful, errorToast, successToast])

  const productWebsiteOwner = psl.get(
    product.url.replace("http://", "").replace("https://", "").toLowerCase()
  )

  return (
    <div>
      {!product.isClaimed && product.status !== "draft" && (
        <div className="bg-secondary-500 p-4 flex flex-col justify-center rounded-sm">
          <span className="text-white font-semibold leading-6 text-sm">
            This product has not been claimed yet!
          </span>
          {!isCreateProduct && (
            <span className="text-white font-semibold leading-6 text-sm">
              <br />
              Only admin{productWebsiteOwner ? `@${productWebsiteOwner} ` : " "}
              can claim this product.
            </span>
          )}
          <UpdateButton
            title="Claim Product"
            loading={claimLoading || isPending}
            variant="outlined"
            className="mt-4 text-white w-full !outline-none border-[2px] border-white hover:bg-white hover:text-black hover:border-white text-xs"
            onClick={async () => {
              setClaimLoading(true)
              const res = await checkClaim(product._id)
              // console.debug(res)
              if (res.status === "success" && res.allowed) {
                claimProduct({
                  productId: product._id,
                  walletAddress: product.createdBy?.wallet || "",
                  callback: (sid) => {
                    setSid(sid)
                  }
                })
              } else {
                errorToast({
                  message: res?.message || "Failed to claim product"
                })
              }
            }}
            disabled={
              isCreateProduct ||
              `admin@${psl.get(
                product.url
                  .replace("http://", "")
                  .replace("https://", "")
                  .toLowerCase()
              )}` !== (user?.email || "")
            }
          />
        </div>
      )}
    </div>
  )
}

export default ClaimProduct
