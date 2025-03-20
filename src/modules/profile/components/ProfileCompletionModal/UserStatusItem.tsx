import { SharpTick } from "assets/icons"
import { IUserStatus } from "modules/profile/components/BasicInformation/ProfileStatus"

type Props = {
  userStatus: IUserStatus
}

const UserStatusItem = ({ userStatus: { key, value, description } }: Props) => {
  return (
    <div className="bg-white pl-4 pt-[9px] pb-[10px] pr-6 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-primary-700 text-sm font-medium">{key}</div>
          <div className="text-neutral-400 text-xs tracking-[0.02em]">
            {description}
          </div>
        </div>
        <div>
          {value ? (
            <SharpTick />
          ) : (
            <div className="text-neutral-200 text-xs font-normal tracking-wide font-georgia">
              In Progress
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserStatusItem
