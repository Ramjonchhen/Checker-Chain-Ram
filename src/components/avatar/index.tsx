import AvatarImgNFT from "assets/images/avatar/nftavatar.png";
import { Badge } from "components";
import { FC } from "react";
import { getBaseBackendImageUrl } from "utils";
import { AvatarProps } from "./index.d";

const levelsMapping = {
  private: 1,
  specialist: 2,
  corporal: 3,
  sergeant: 4,
  commander: 5,
  lieutenant: 6,
  captain: 7,
  major: 8,
  colonel: 9,
  brigadier: 10,
  general: 11
}

type LevelMapping = keyof typeof levelsMapping

const getLevel = (level: LevelMapping | undefined)=> {
if(level){
    return `${levelsMapping[level] ?? ''}`
  } 
  return level
}

export const Avatar: FC<AvatarProps> = ({ variant = "default", percentage = 80, level = 12, className = "", image, onClick }) => {
  return (
    <div
      className={`relative w-32 h-32 flex justify-center items-center ${
        variant === "default" && "outline outline-8 outline-white rounded-full"
      } ${className}`}
      onClick={onClick}
    >
      {percentage && variant === "nft" && (
        <>
          <svg
            width="128"
            height="128"
            viewBox="0 0 128 128"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <polygon
              className="hex"
              strokeWidth="8px"
              stroke="#E6E7EC"
              
              points="64 12, 
                      108 36,108 90,
                      64 116,
                      20 90, 20 36"
              fill="#E6E7EC"
            ></polygon>
            <polygon
              className="hex"
              strokeWidth="8px"
              strokeDasharray={percentage === 100 ? 0 : 310}
              strokeDashoffset={310* (100 - percentage)/100}
              stroke="url(#paint0_linear_705_5552)"
              
              points="64 12, 
                      108 36,108 90,
                      64 116,
                      20 90, 20 36"
              fill="#E6E7EC"
            ></polygon>
            <polygon
              className="hex"
             fill="url(#pattern0)"
              points="64 20, 
                      101.52 40.48,101.52 87.52,
                      64 108,
                      26.48 87.52, 26.48 40.48"
            ></polygon>
            
            <defs>
              <pattern
                id="pattern0"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use
                  xlinkHref="#image0_705_5552"
                  transform="scale(0.00158479)"
                />
              </pattern>
              <linearGradient
                id="paint0_linear_705_5552"
                x1="75.1836"
                y1="11.3094"
                x2="75.1836"
                y2="138.691"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#9F66E4" />
                <stop offset="1" stopColor="#59D2F0" />
              </linearGradient>
              <image
                id="image0_705_5552"
                width="631"
                height="631"
                xlinkHref={AvatarImgNFT.src}
              />
            </defs>
          </svg>
        </>
      )}
      {percentage && variant === "default" && (
        <svg width={128} height={128}>
          <defs>
            <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9F66E4" />
              <stop offset="100%" stopColor="#59D2F0" />
            </linearGradient>
          </defs>
          <circle
            className="text-outline-avatar"
            stroke="currentColor"
            r="59.5"
            cx="64"
            cy="64"
            strokeWidth="9px"
          />
          <circle
            strokeLinecap="round"
            stroke="url(#linear)"
            fill="transparent"
            r="60"
            cx="64"
            cy="64"
            strokeWidth="6px"
            transform={`rotate(-90 64 64)`}
            style={{
              strokeDasharray: 373.84952577718536,
              strokeDashoffset: (373.84952577718536 * (100 - percentage)) / 100,
            }}
          />
        </svg>
      )}
      {variant === "default" && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="absolute object-cover top-[9.5px] left-[9.5px] rounded-full w-[110px] h-[110px]"
            alt="avatar"
            src={getBaseBackendImageUrl(image, "avatar")}
          />
        </>
      )}
      {level && (
        <Badge
          title={`${getLevel(level.toString().toLowerCase() as LevelMapping)}`}
          className={`absolute ${
                variant === "default" ? "right-1 bottom-3 px-2" : "right-7 bottom-5"
              } border-2 border-white`}
        />
      )}
    </div>
  );
};
