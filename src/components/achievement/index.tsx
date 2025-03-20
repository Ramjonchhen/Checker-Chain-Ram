import AcheivementBackground from "../../assets/images/acheivement-bg.png"
import AcheivementImage from "../../assets/images/acheivement-1.png"
import Image from "next/image"
import { FC } from "react"
import { AchievementCardProps } from "./index.d"

export const Achievement: FC<AchievementCardProps> = ({ active = false }) => (
  <div className="bg-white h-full w-full ">
    <div className="h-1/2 flex justify-center items-end">
      <div className="h-[60%] w-[60%] relative">
        <Image
          src={AcheivementImage.src}
          alt="acheivement"
          layout="fill"
          className="absolute left-0"
        />
      </div>
    </div>
    <div
      className="h-1/2 top-1/2 w-full bg-[length:100%_100%] no-repeat mt-[-10px] text-center"
      style={{ backgroundImage: `url('${AcheivementBackground.src}')` }}
    >
      {active && (
        <>
          <h6 className="font-semibold text-base pt-16">CLASS OF 2022</h6>
          <p className="text-xs">
            Each user is given a badge for joining that particular year
          </p>
        </>
      )}
      {!active && (
        <>
          <h6 className="font-semibold text-base  pt-8">CLASS OF 2022</h6>
        </>
      )}
    </div>
  </div>
)
