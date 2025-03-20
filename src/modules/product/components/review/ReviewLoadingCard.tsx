import { Card } from "components"
// TODO
function ReviewLoadingCard() {
  return (
    <Card>
      <div className="animate-pulse">
        <div className="flex gap-4 items-center">
          <div className="circle h-10 w-10 rounded-full bg-neutral-50" />
          <div className="flex flex-col gap-2">
            <div className="h-4 w-[127px] bg-neutral-50"></div>
            <div className="h-[5px] w-[72] bg-neutral-50"></div>
          </div>
        </div>
      </div>
    </Card>
  )
}
export default ReviewLoadingCard
