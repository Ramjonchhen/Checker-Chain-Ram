import React from 'react'
import { AirdropItem } from './AirdropItem'

export interface AirDrop {
  title?: string,
  description?: string,
  image?: string,
  file?: File,
  amount?: number,
  startDate?: Date,
  endDate?: Date,
  _id: string,
  reward?: {
    amount: number,
    proof: string[]
    index: number
    airdropId: number
  }
}

interface AirdropListProps {
  airdrops: AirDrop[]
}

export const AirdropList:React.FC<AirdropListProps> = ({
  airdrops
}) => {
  return (
    <div>
      {airdrops.map((airdrop) => <AirdropItem airdrop={airdrop} key={`airdrop-${airdrop._id}`}/>)}
    </div>
  )
}
