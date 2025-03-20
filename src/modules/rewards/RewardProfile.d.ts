import React from "react";

export interface RewardProfileProps extends React.HTMLAttributes<HTMLDivElement> {
    cpEarned?: number,
    overralRanking?: number
}