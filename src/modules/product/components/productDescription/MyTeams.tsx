import { useRouter } from "next/router"
import { useProductStore } from "stores/product"
import { getBaseBackendImageUrl } from "utils"

type Props = {
  isCreateProduct?: boolean
}

const MyTeams = ({ isCreateProduct = false }: Props) => {
  const { product } = useProductStore()
  const router = useRouter()

  return (
    <div>
      <div className="flex flex-col gap-4 pt-4 bg-emerald-50">
        <div className="flex justify-between items-center">
          <span className="block text-neutral-900 text-base font-semibold leading-6">
            Teams
          </span>
          {/* <span className="block text-secondary-900 text-[12px] leading-[18px] cursor-pointer select-none">
              See all
            </span> */}
        </div>
        <p className="flex items-center p-0 text-neutral-700">
          {!isCreateProduct && product?.teams?.length === 0 && (
            <span className="block text-neutral-700 text-[12px] leading-[18px]">
              No teams
            </span>
          )}
          {!isCreateProduct &&
            product?.teams?.map((each) => (
              <span
                key={`img${each}`}
                className="border border-separate hover:cursor-pointer hover:transform hover:scale-125 hover:shadow-sm flex justify-center items-center w-8 h-8 -ml-3 rounded-full bg-white shadow-sm"
              >
                <img
                  src={getBaseBackendImageUrl(each.profilePicture, "avatar")}
                  className="w-7 h-7 rounded-full object-contain"
                  alt=""
                  onClick={() => {
                    router.push(`/user/${each.username}`)
                  }}
                />
              </span>
            ))}
        </p>
      </div>
    </div>
  )
}

export default MyTeams
