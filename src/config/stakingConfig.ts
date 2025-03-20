/**
 * Staking Configurations that are required for staking
 */

import { getNetwork } from "config"

const network = getNetwork()
export const stakingConfig = network.chainID === "1" ? {
  fullCycleEpoch: 1,
  lockPeriod: 15,
  minimumStakingAmount: 3000,
  stakingPerDay: 36986.30136, // 36986.30136
  totalDistribution: 13500000,
  penaltyRate: 20,
  dollarValue: 0.03,
  epochInSeconds: 86400
}: {
  fullCycleEpoch: 1,
  lockPeriod: 60,
  minimumStakingAmount: 20,
  stakingPerDay: 369.30136,
  totalDistribution: 134794.9964,
  penaltyRate: 20,
  dollarValue: 0.03,
  epochInSeconds: 3600
}
