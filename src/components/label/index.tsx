import { FC } from "react";
import { twMerge } from "tailwind-merge";
import { LabelProps } from './index.d';

export const Label:FC<LabelProps> = ({ title, className }) => {
  return (
    <div className={twMerge("h-8 flex items-center bg-background-light text-primary font-medium px-4 rounded-lg", className ?? "")}>
      {title}
    </div>
  );
}