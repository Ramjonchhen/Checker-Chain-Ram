import {
  AcheivementTrophy
  // , CheckerChainIcon
} from "assets/icons"
import NoProfileImage from "assets/images/avatar/no_profile.png"
import MyRanking from "assets/images/ranking.svg"
import { Card, LeaderboardTable, Stats, TableBody, Text } from "components"
import { useEffect, useState } from "react"
import { LeaderboardState, useUserStore } from "stores"
import { twMerge } from "tailwind-merge"
import { LeaderboardRow } from "./LeaderboardRow"
import { CheckerChainSmallNewLogo } from "assets/icons"
import useMediaQuery from "hooks/useMediaQuery"

const desktopHeaders = [
  {
    label: "Rank",
    width: "58.75"
  },
  {
    label: "Name",
    width: "108.5"
  },
  {
    label: "Total CP Earned",
    width: "58.75"
  },
  {
    label: "Profile Score",
    width: "68.75"
  }
]
const mobileHeaders = [
  {
    label: "Rankings",
    width: "58.75"
  }
]

// const data = [
//   {
//     rank: 1,
//     name: "James Charles",
//     totalCPEarned: 12000,
//     previousRank: 3,
//     image: User1Img.src
//   },
//   {
//     rank: 2,
//     name: "Mike Conley",
//     totalCPEarned: 8000,
//     previousRank: 3,
//     image: User2Img.src
//   },
//   {
//     rank: 3,
//     name: "Adam Smith",
//     totalCPEarned: 4000,
//     previousRank: 3,
//     image: User3Img.src
//   },
//   {
//     rank: 4,
//     name: "Nial Horran",
//     totalCPEarned: 3500,
//     previousRank: 3,
//     image: User4Img.src
//   },
//   {
//     rank: 5,
//     name: "Jaylen Bryant",
//     totalCPEarned: 2000,
//     previousRank: 3,
//     image: User5Img.src
//   }
// ]

export const LeaderboardMain = () => {
  const [activeLeaderboard, setActive] = useState("global")
  const matchesMobile = useMediaQuery("(max-width: 600px)")

  const [data, setData] = useState<LeaderboardState>({
    myRank: 0,
    users: []
  })
  const {
    fetchConnectedLeaderboards,
    fetchGlobalLeaderboards,
    connectedLeaderboards,
    globalLeaderboards,
    user,
    authorization
  } = useUserStore((state) => state)

  useEffect(() => {
    if (authorization) {
      fetchConnectedLeaderboards()
    }
    fetchGlobalLeaderboards()
  }, [fetchConnectedLeaderboards, fetchGlobalLeaderboards, authorization])

  useEffect(() => {
    if (activeLeaderboard === "connected") {
      setData(connectedLeaderboards)
    } else {
      setData(globalLeaderboards)
    }
  }, [activeLeaderboard, connectedLeaderboards, globalLeaderboards])

  return (
    <div className="md:mx-20 md:py-14 bg-[#f7f7f7]">
      <Card className=" grid bg-[#fafafa] gap-y-6 relative min-h-[540px]">
        <div className=" min-h-35 mt-8 border-b border-outline-secondary">
          <Text variant="subtitle" className="font-semibold">
            Leaderboard
          </Text>
          <div className="absolute z-10 hidden sm:block top-0 right-10 lg:right-20 w-[171px] h-[182px] p-10 text-white text-center">
            My Ranking
            <br />
            <Text variant="title">
              {activeLeaderboard === "connected"
                ? connectedLeaderboards.myRank
                : globalLeaderboards.myRank}
            </Text>
          </div>

          <div className="absolute hidden sm:block top-0 right-10 lg:right-20">
            <MyRanking />
          </div>
          <div className="mt-6 flex gap-12">
            <Stats
              topText="Total CP Earned"
              // bottomText="End"
              value={`${user.points} CP`}
              startIcon={<CheckerChainSmallNewLogo className="scale-75 " />}
            />
            <Stats
              topText="Achievements"
              // bottomText="End"
              value={user.achievementPoints}
              startIcon={<AcheivementTrophy />}
            />
          </div>
        </div>
        <div className="absolute hidden md:flex -rotate-90 top-60 -left-[10.5rem]">
          <div
            aria-disabled
            onClick={() => setActive("connected")}
            className={twMerge(
              "cursor-pointer border-4 border-b-0 uppercase text-[20px] font-medium p-4 rounded-t-3xl",
              activeLeaderboard === "connected"
                ? "bg-[#d10404] border-[#efba1a] text-white"
                : "bg-[#FEF1F1] border-[#CFBEBE]  text-[#CFBEBE]"
            )}
          >
            Connected
          </div>
          <div
            aria-disabled
            onClick={() => setActive("global")}
            className={twMerge(
              "cursor-pointer border-4 border-b-0 uppercase text-[20px] font-medium p-4 rounded-t-3xl",
              activeLeaderboard === "global"
                ? "bg-[#d10404] border-[#efba1a] text-white"
                : "bg-[#FEF1F1] border-[#CFBEBE]  text-[#CFBEBE]"
            )}
          >
            Global
          </div>
        </div>
        <LeaderboardTable
          headers={matchesMobile ? mobileHeaders : desktopHeaders}
          isMobile={matchesMobile}
        >
          <TableBody>
            {data.users.map((item) => (
              <LeaderboardRow
                isMobile={matchesMobile}
                key={item.wallet}
                data={{
                  rank: item.rank,
                  name: item.name || "Guest User",
                  totalCPEarned: item.points,
                  previousRank: item.previousRank,
                  username: item.username,
                  profileScore: item?.profileScore ?? 0,
                  image:
                    (item.image &&
                      `${process.env.NEXT_PUBLIC_SPACE_BASE}${item.image}`) ||
                    NoProfileImage.src
                }}
              />
            ))}
          </TableBody>
        </LeaderboardTable>
      </Card>
    </div>
  )
}
