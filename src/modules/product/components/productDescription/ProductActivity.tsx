/* eslint-disable @next/next/no-img-element */
import { FC } from "react"
import { User } from "stores"
import { DangerIcon } from "assets/icons"
import { getBaseBackendImageUrl } from "utils"
import { useRouter } from "next/router"
import { UserMeta } from "interfaces/user"

export interface ProductActivityProps {
  createdBy: User | UserMeta
  claimedBy?: User | UserMeta
}

export const ProductActivity: FC<ProductActivityProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createdBy,
  claimedBy
}) => {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-4 border p-4 border-separator my-6 rounded-lg">
      <span className="block text-neutral-900 text-base font-semibold leading-6">
        Product Activities
      </span>

      {!claimedBy?._id && (
        <p className="m-0 p-0 text-neutral-700 flex gap-x-[10px] items-center text-sm font-normal">
          <DangerIcon className="text-primary-500 w-[15px] h-[13.33px]" />
          This product is not claimed
        </p>
      )}

      {claimedBy?._id && (
        <div className="m-0 p-0 flex items-center text-neutral-700 gap-2 text-sm">
          <img
            onClick={() => router.push(`/user/${createdBy.username}`)}
            className="transition-transform duration-300 cursor-pointer w-6 object-cover rounded-full h-6 hover:transform hover:scale-125"
            alt="Creator"
            src={`${getBaseBackendImageUrl(
              claimedBy?.profilePicture,
              "avatar"
            )}`}
          />
          Claimed by {claimedBy?.name}
        </div>
      )}

      <div className="m-0 p-0 flex items-center text-neutral-700 gap-2 text-sm">
        <img
          onClick={() => router.push(`/user/${createdBy.username}`)}
          className="transition-transform duration-300 cursor-pointer w-6 object-cover rounded-full h-6 hover:transform hover:scale-125"
          alt="Creator"
          src={`${getBaseBackendImageUrl(createdBy?.profilePicture, "avatar")}`}
        />
        Created by {createdBy?.name}
      </div>
    </div>
  )
}
