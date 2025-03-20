import { TimestampIcon } from "assets/icons"

const dummyImg =
  "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

const RecentlyUploadedItem = () => {
  return (
    <div className="flex flex-row gap-3 p-1 hover:bg-white hover:shadow-md md:w-fit rounded-xl items-center cursor-pointer transition-all duration-300 ">
      <div className="h-16 aspect-square rounded-lg overflow-hidden flex-shrink-0">
        <img src={dummyImg} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="md:max-w-[143px] overflow-hidden flex flex-col">
        <div className="text-base leading-normal font-semibold text-neutral-900 truncate">
          Avatar: The way of the water
        </div>
        <div className="text-[10px] font-medium tracking-[0.2px] text-neutral-200 truncate">
          Blockchain. Crypto
        </div>
        <div className="flex flex-row items-center mt-1 gap-1">
          <TimestampIcon className="w-3 h-3" />
          <div className="text-[10px] font-medium leading-4 text-neutral-200">
            10 mins ago
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecentlyUploadedItem
