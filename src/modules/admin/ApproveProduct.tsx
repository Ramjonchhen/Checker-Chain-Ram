import { useTrackTransactionStatus } from "lib/dApp-core"
import { Button, UpdateButton } from "components"
import { useProductContract } from "hooks/useProductContract"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Product, useProductStore } from "stores/product"
import { getBaseBackendImageUrl } from "utils"

export const ApproveProduct = () => {
  const [sid, setSid] = useState<string | null>("")
  const [productId, setProductId] = useState("")
  const [isSyncing, setIsSyncing] = useState(false)

  const {
    pendingProducts: products,
    getPendingProducts,
    syncProduct
  } = useProductStore()
  const router = useRouter()

  const { isCancelled, isSuccessful, isFailed } = useTrackTransactionStatus({
    transactionId: sid
  })

  useEffect(() => {
    getPendingProducts()
  }, [getPendingProducts])

  useEffect(() => {
    if (isSuccessful) {
      syncProduct(productId)
      setSid(null)
    } else if (isCancelled || isFailed) {
      setSid(null)
      syncProduct(productId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCancelled, isFailed, isSuccessful])

  const { approveClaim } = useProductContract()
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Approve Products</h1>
      <div className="pt-4 flex flex-col gap-8">
        {products.products.map((item: Product) => (
          <div
            key={item._id}
            className="flex gap-6 items-center cursor-pointer justify-between"
          >
            <div
              className="flex gap-6 items-center cursor-pointer justify-between"
              onClick={() => {
                router.push(`/product/${item.slug}`)
              }}
            >
              {item.logo && (
                // eslint-disable-next-line jsx-a11y/alt-text
                <img
                  className={`w-10 h-10 object-contain`}
                  src={getBaseBackendImageUrl(item.logo, "other")}
                />
              )}
              {!item.logo && (
                <div
                  className={`font-[500] select-none ${"bg-secondary-gradient"} w-10 h-10 flex items-center justify-center text-3xl text-white`}
                >
                  {item.name[0]?.toUpperCase()}
                </div>
              )}
              <div className="flex-grow flex-wrap">
                <div className="font-medium text-xl leading-6">{item.name}</div>
                <div className="flex gap-2 text-sm leading-5 text-neutral-900">
                  {item.description}
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <UpdateButton
                loading={isSyncing}
                variant="outlined"
                title="Sync"
                onClick={() => {
                  setIsSyncing(true)
                  syncProduct(item._id).then(() => {
                    setIsSyncing(false)
                    getPendingProducts()
                  })
                }}
              />
              <Button
                variant="outlined"
                title="Approve"
                onClick={() => {
                  approveClaim({
                    productId: item._id,
                    walletAddress: item.createdBy?.wallet || "",
                    callback: (sid) => {
                      setSid(sid)
                      setProductId(item._id)
                    }
                  })
                }}
              />
            </div>
          </div>
        ))}
        {products.products.length === 0 && (
          <div className="text-neutral-900 text-center text-sm font-medium mt-10">
            No products to approve
          </div>
        )}
      </div>
    </div>
  )
}
