export const abi = {
  buildInfo: {
    rustc: {
      version: "1.70.0-nightly",
      commitHash: "f63ccaf25f74151a5d8ce057904cd944074b01d2",
      commitDate: "2023-03-06",
      channel: "Nightly",
      short: "rustc 1.70.0-nightly (f63ccaf25 2023-03-06)"
    },
    contractCrate: {
      name: "farming",
      version: "0.0.1",
      git_version: "a48feaa-modified"
    },
    framework: {
      name: "elrond-wasm",
      version: "0.35.0"
    }
  },
  name: "Farming",
  constructor: {
    inputs: [
      {
        name: "checkr_token_identifier",
        type: "TokenIdentifier"
      },
      {
        name: "checkr_egld_token_identifier",
        type: "TokenIdentifier"
      }
    ],
    outputs: []
  },
  endpoints: [
    {
      name: "start_farming",
      onlyOwner: true,
      mutability: "mutable",
      inputs: [
        {
          name: "active",
          type: "bool"
        }
      ],
      outputs: []
    },
    {
      name: "flip_pause",
      onlyOwner: true,
      mutability: "mutable",
      inputs: [],
      outputs: []
    },
    {
      name: "set_team_wallet",
      onlyOwner: true,
      mutability: "mutable",
      inputs: [
        {
          name: "team_wallet",
          type: "Address"
        }
      ],
      outputs: [
        {
          type: "bool"
        }
      ]
    },
    {
      name: "rescue_token",
      onlyOwner: true,
      mutability: "mutable",
      inputs: [
        {
          name: "token_address",
          type: "TokenIdentifier"
        },
        {
          name: "token_amount",
          type: "BigUint"
        }
      ],
      outputs: []
    },
    {
      name: "rescue_egld",
      onlyOwner: true,
      mutability: "mutable",
      inputs: [],
      outputs: []
    },
    {
      name: "claim_rewards",
      mutability: "mutable",
      inputs: [],
      outputs: []
    },
    {
      name: "enter_farming",
      mutability: "mutable",
      payableInTokens: ["*"],
      inputs: [],
      outputs: []
    },
    {
      name: "exit_farming",
      mutability: "mutable",
      payableInTokens: ["*"],
      inputs: [
        {
          name: "unstake_amount",
          type: "BigUint"
        }
      ],
      outputs: []
    },
    {
      name: "calculate_remaining_reward",
      mutability: "readonly",
      inputs: [
        {
          name: "caller",
          type: "Address"
        }
      ],
      outputs: [
        {
          type: "BigUint"
        }
      ]
    },
    {
      name: "getFarmingState",
      mutability: "readonly",
      inputs: [],
      outputs: [
        {
          type: "FarmingState"
        }
      ]
    },
    {
      name: "getAddressState",
      mutability: "readonly",
      inputs: [
        {
          name: "address",
          type: "Address"
        }
      ],
      outputs: [
        {
          type: "AddressState"
        }
      ]
    },
    {
      name: "getNextRewardRemainingEpoch",
      mutability: "readonly",
      inputs: [],
      outputs: [
        {
          type: "u64"
        }
      ]
    },
    {
      name: "currentRunningRound",
      mutability: "readonly",
      inputs: [],
      outputs: [
        {
          type: "u64"
        }
      ]
    },
    {
      name: "isActive",
      mutability: "readonly",
      inputs: [],
      outputs: [
        {
          type: "bool"
        }
      ]
    },
    {
      name: "genesisEpoch",
      mutability: "readonly",
      inputs: [],
      outputs: [
        {
          type: "u64"
        }
      ]
    },
    {
      name: "checkrTokenIdentifier",
      mutability: "readonly",
      inputs: [],
      outputs: [
        {
          type: "TokenIdentifier"
        }
      ]
    },
    {
      name: "checkrEgldTokenIdentifier",
      mutability: "readonly",
      inputs: [],
      outputs: [
        {
          type: "TokenIdentifier"
        }
      ]
    },
    {
      name: "teamWallet",
      mutability: "readonly",
      inputs: [],
      outputs: [
        {
          type: "Address"
        }
      ]
    },
    {
      name: "paused",
      mutability: "readonly",
      inputs: [],
      outputs: [
        {
          type: "bool"
        }
      ]
    },
    {
      name: "stakedAmount",
      mutability: "readonly",
      inputs: [
        {
          name: "address",
          type: "Address"
        }
      ],
      outputs: [
        {
          type: "BigUint"
        }
      ]
    },
    {
      name: "totalStakedAmount",
      mutability: "readonly",
      inputs: [
        {
          name: "reward_round",
          type: "u64"
        }
      ],
      outputs: [
        {
          type: "BigUint"
        }
      ]
    },
    {
      name: "grandTotalAmount",
      mutability: "readonly",
      inputs: [],
      outputs: [
        {
          type: "BigUint"
        }
      ]
    },
    {
      name: "unlockEpoch",
      mutability: "readonly",
      inputs: [
        {
          name: "address",
          type: "Address"
        }
      ],
      outputs: [
        {
          type: "u64"
        }
      ]
    },
    {
      name: "lastClaimedReward",
      mutability: "readonly",
      inputs: [
        {
          name: "address",
          type: "Address"
        }
      ],
      outputs: [
        {
          type: "u64"
        }
      ]
    },
    {
      name: "set_current_round",
      onlyOwner: true,
      mutability: "mutable",
      inputs: [
        {
          name: "_current_round",
          type: "u64"
        }
      ],
      outputs: []
    },
    {
      name: "currentRound",
      mutability: "readonly",
      inputs: [],
      outputs: [
        {
          type: "u64"
        }
      ]
    }
  ],
  events: [],
  hasCallback: false,
  types: {
    AddressState: {
      type: "struct",
      fields: [
        {
          name: "staked_amount",
          type: "BigUint"
        },
        {
          name: "unlock_epoch",
          type: "u64"
        },
        {
          name: "current_epoch",
          type: "u64"
        },
        {
          name: "last_claimed_round",
          type: "u64"
        }
      ]
    },
    FarmingState: {
      type: "struct",
      fields: [
        {
          name: "is_active",
          type: "bool"
        },
        {
          name: "current_epoch",
          type: "u64"
        },
        {
          name: "current_running_round",
          type: "u64"
        },
        {
          name: "total_staked_amount",
          type: "BigUint"
        }
      ]
    }
  }
}
