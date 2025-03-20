import * as Icons from "assets/icons"
import User1Img from "assets/images/avatar/user1.png"
import BronzeMedal from "assets/images/medals/bronze-medal.svg"
import GoldMedal from "assets/images/medals/gold-medal.svg"
import SilverMedal from "assets/images/medals/silver-medal.svg"
import { useRouter } from "next/router"
import { FC } from "react"
import { formatCurrency } from "utils"
import { cutAfterInputDecimalPlaces } from "utils/helper"
import { CheckerChainSmallNewLogo, ChevronDownIcon } from "assets/icons"
import { useDisclosure } from "hooks/useDisclosure"
import { twMerge } from "tailwind-merge"

interface LeaderboardRowData {
  rank: number
  name: string
  totalCPEarned: number
  previousRank: number
  image?: string
  username: string
  profileScore?: number
}

const getIconsBasedOnRank = (rank: number) => {
  if (rank > 0) {
    return <Icons.RankIncrease />
  } else if (rank < 0) {
    return <Icons.RankDecrease />
  } else {
    return <Icons.RankNoChange />
  }
}

const getMedals = (rank: number) => {
  switch (rank) {
    case 1:
      return <GoldMedal />
    case 2:
      return <SilverMedal />
    case 3:
      return <BronzeMedal />
    default:
      return ""
  }
}

const LeaderBoardRowMobile = ({ data }: { data: LeaderboardRowData }) => {
  const router = useRouter()
  const [isExpanded, { toggle }] = useDisclosure()

  return (
    <>
      <tr
        className={twMerge(
          "flex flex-col w-full h-[56px] transition-[height] duration-200 overflow-hidden",
          isExpanded && "h-[100px]"
        )}
      >
        <div className="py-2 flex items-center cursor-pointer" onClick={toggle}>
          <td className="px-2 font-medium flex items-center gap-x-2 text-sm">
            {`#${data.rank}`}{" "}
            {getIconsBasedOnRank(data.previousRank - data.rank)}
          </td>
          <td
            onClick={() => router.push(`/user/${data.username}`)}
            className="px-[5px] cursor-pointer  flex-shrink-0"
          >
            <div className="flex items-center gap-x-4 text-sm">
              <img
                src={data.image ? data.image : User1Img.src}
                className="w-[25px] h-[25px] rounded-full"
              />
              {data.name}
            </div>
          </td>
          <td className="w-full flex justify-end pr-4 items-center">
            <CheckerChainSmallNewLogo className="scale-50" />
            <div className="text-[11px]">
              {`${formatCurrency(data.totalCPEarned, "", 0)}`.replace(".", "")}
              {" CP Earned"}
            </div>
            <ChevronDownIcon
              className={`transition-all duration-200 w-3 h-3 ml-2 text-neutral-600  ${
                isExpanded && "transform rotate-180"
              }`}
            />
          </td>
        </div>

        <div className="flex items-center gap-x-4 justify-between pl-12 pr-6">
          <div className="pl-4">
            <div className="text-[11px]">
              {/* Profile score: <strong>{data?.profileScore}</strong> */}
            </div>
          </div>
          <div>
            <div className="text-[11px]">
              Profile score: <strong>{data?.profileScore}</strong>
              {/* <strong>0</strong> Followers */}
            </div>
          </div>
        </div>
      </tr>
    </>
  )
}

export const LeaderboardRow: FC<{
  data: LeaderboardRowData
  isMobile: boolean
}> = ({ data, isMobile }) => {
  const router = useRouter()

  if (isMobile) {
    return <LeaderBoardRowMobile data={data} />
  }

  return (
    <tr>
      <td className="min-w-58.75 px-3 py-2 font-medium flex items-center gap-x-2">
        <div className="w-9 -mt-2">{getMedals(data.rank)}</div>
        {`#${data.rank}`} {getIconsBasedOnRank(data.previousRank - data.rank)}
      </td>
      <td
        onClick={() => router.push(`/user/${data.username}`)}
        className="min-w-108.5 px-6 py-2 cursor-pointer"
      >
        <div className="flex items-center gap-x-4">
          <img
            src={data.image ? data.image : User1Img.src}
            className="w-[45px] h-[45px] rounded-full object-cover"
          />
          {data.name}
        </div>
      </td>
      <td className="min-w-68.25 px-6 py-2 ">
        <div className="flex items-center gap-x-4">
          {/* <Icons.CheckerChainIcon /> */}
          <CheckerChainSmallNewLogo className="scale-75" />
          {`${formatCurrency(data.totalCPEarned, "", 0)}`.replace(".", "")} CP
        </div>
      </td>
      <td className="w-full px-6 py-2">
        {cutAfterInputDecimalPlaces(data.profileScore!, 2)}
      </td>
    </tr>
  )
}
