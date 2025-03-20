import RecentlyUploadedItem from "./RecentlyUploadedItem"
// NOT USED

const RecentlyUploadedSection = () => {
  return (
    <div className="pt-10">
      <div className="mb-6 flex flex-row justify-between">
        <h3 className="text-xl leading-[24px] tracking-[0.2px] font-semibold text-neutral-900">
          Recently Uploaded
        </h3>
        {/* <button className="text-xs font-medium leading-normal text-neutral-900">
          View all
        </button> */}
      </div>
      <div className="flex gap-y-2  gap-x-1  flex-col md:flex-row md:justify-start md:flex-wrap ">
        <RecentlyUploadedItem />
        <RecentlyUploadedItem />
        <RecentlyUploadedItem />
        <RecentlyUploadedItem />
        <RecentlyUploadedItem />
        <RecentlyUploadedItem />
      </div>
    </div>
  )
}

export default RecentlyUploadedSection
