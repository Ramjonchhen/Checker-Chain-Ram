// import { EmptyState, Modal } from "components"
import React from "react"
// import { useAirDropStore } from "stores/airdrop"
// import { useProductStore } from "stores/product"
// import { AirDrop, AirdropList } from "./AirdropList"
// import { CreateAirdrop } from "./CreateAirdrop"
// import PendingAirdropSvg from "assets/images/airdrop/pending-airdrop.svg"

export const Airdrop = () => {
  // const { airdrops, getAirdrops, singleLoading } = useAirDropStore()
  // const { product } = useProductStore()
  // React.useEffect(() => {
  //   getAirdrops(product?._id)
  // }, [])

  // return (
  //   <div className='mt-6'>
  //     <Modal
  //       display={singleLoading}
  //     >
  //       <div className='flex justify-center flex-col items-center'>
  //         <PendingAirdropSvg className="animate-spin-always" />
  //         <h1 className="text-2xl font-bold text-center">Processing Claim</h1>
  //         <p className="text-center">Your airdrop is being processed. Please wait for a while.</p>
  //       </div>
  //     </Modal>
  //     {airdrops.airdrops.length === 0 ?
  //       <EmptyState className='p-10' message="There is no offers & Airdrops." />
  //       :
  //       <AirdropList airdrops={airdrops.airdrops as AirDrop[]} />}
  //     {product.isOwner && <CreateAirdrop />}

  //   </div>

  return (
    <div className="flex items-center justify-center mt-5">
      Offers and Airdrops are coming soon. Stay tuned!
    </div>
  )
}
