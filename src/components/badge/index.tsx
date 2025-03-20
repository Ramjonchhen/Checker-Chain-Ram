import { FC } from "react";
import { twMerge } from "tailwind-merge";
import { BadgeProps } from "./index.d";

export const Badge:FC<BadgeProps> = ({ title, className}) => {
    return ((
        <div
          className={twMerge("font-semibold w-6 h-6 text-xs bg-secondary text-white flex justify-center items-center rounded-full", className ?? "")}
        >
          {title}
        </div>
      ))
}