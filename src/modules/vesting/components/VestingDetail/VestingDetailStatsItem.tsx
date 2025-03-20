export type IVestngDetailStatsItemProps = {
  label: string
  subLabel: string
  icon?: JSX.Element | null
}

function VestingDetailStatsItem({
  icon = null,
  label,
  subLabel
}: IVestngDetailStatsItemProps) {
  return (
    <div className="flex flex-col gap-[2px] items-center">
      <div className="flex gap-2 items-center">
        <div>{icon}</div>
        <div className="text-base font-medium leading-6 text-neutral-900">
          {label}
        </div>
      </div>
      <div className="text-center text-[10px] leading-[15px] font-medium text-neutral-600">
        {subLabel}
      </div>
    </div>
  )
}
export default VestingDetailStatsItem
