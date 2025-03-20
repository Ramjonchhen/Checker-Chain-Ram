export const abi = {
  buildInfo: {
    rustc: {
      version: "1.68.0-nightly",
      commitHash: "ad8ae0504c54bc2bd8306abfcfe8546c1bb16a49",
      commitDate: "2022-12-29",
      channel: "Nightly",
      short: "rustc 1.68.0-nightly (ad8ae0504 2022-12-29)"
    },
    contractCrate: {
      name: "airdrop",
      version: "0.0.2",
      git_version: "9ba4c61-modified"
    },
    framework: {
      name: "elrond-wasm",
      version: "0.34.1"
    }
  },
  name: "MultiAirdrop",
  constructor: {
    inputs: [
      {
        name: "fee",
        type: "BigUint"
      },
      {
        name: "treasury",
        type: "Address"
      }
    ],
    outputs: []
  },
  endpoints: [
    {
      name: "claim",
      mutability: "mutable",
      inputs: [
        {
          name: "proof",
          type: "List<array32<u8>>"
        },
        {
          name: "index",
          type: "BigUint"
        },
        {
          name: "amount",
          type: "BigUint"
        },
        {
          name: "airdrop_id",
          type: "BigUint"
        }
      ],
      outputs: []
    },
    {
      name: "multi_claim",
      mutability: "mutable",
      inputs: [
        {
          name: "proofs",
          type: "List<List<array32<u8>>>"
        },
        {
          name: "indexs",
          type: "List<BigUint>"
        },
        {
          name: "amounts",
          type: "List<BigUint>"
        },
        {
          name: "airdrop_ids",
          type: "List<BigUint>"
        }
      ],
      outputs: []
    },
    {
      name: "create_airdrop",
      mutability: "mutable",
      payableInTokens: ["*"],
      inputs: [
        {
          name: "admin",
          type: "Address"
        },
        {
          name: "start_time",
          type: "BigUint"
        },
        {
          name: "duration",
          type: "BigUint"
        },
        {
          name: "airdrop_root",
          type: "array32<u8>"
        },
        {
          name: "_airdrop_token",
          type: "EgldOrEsdtTokenIdentifier"
        },
        {
          name: "present_airdrop_id",
          type: "BigUint"
        }
      ],
      outputs: []
    },
    {
      name: "set_airdrop_root",
      mutability: "mutable",
      inputs: [
        {
          name: "airdrop_id",
          type: "BigUint"
        },
        {
          name: "merkle_root",
          type: "array32<u8>"
        }
      ],
      outputs: []
    },
    {
      docs: ["Claims the funds in the SmartContract."],
      name: "claim_egld",
      onlyOwner: true,
      mutability: "mutable",
      inputs: [],
      outputs: []
    },
    {
      name: "rescue_token",
      mutability: "mutable",
      inputs: [
        {
          name: "amount",
          type: "BigUint"
        },
        {
          name: "airdrop_id",
          type: "BigUint"
        }
      ],
      outputs: []
    },
    {
      name: "getAirdropRoot",
      mutability: "readonly",
      inputs: [
        {
          name: "airdrop_id",
          type: "BigUint"
        }
      ],
      outputs: [
        {
          type: "array32<u8>"
        }
      ]
    },
    {
      name: "getClaimStatus",
      mutability: "readonly",
      inputs: [
        {
          name: "user",
          type: "Address"
        },
        {
          name: "airdrop_id",
          type: "BigUint"
        }
      ],
      outputs: [
        {
          type: "bool"
        }
      ]
    },
    {
      name: "getCurrentAirdropCount",
      mutability: "readonly",
      inputs: [],
      outputs: [
        {
          type: "BigUint"
        }
      ]
    },
    {
      name: "getAirdrops",
      mutability: "readonly",
      inputs: [
        {
          name: "airdrop_id",
          type: "BigUint"
        }
      ],
      outputs: [
        {
          type: "TokenAirdrop"
        }
      ]
    },
    {
      name: "getFeePercentage",
      mutability: "readonly",
      inputs: [],
      outputs: [
        {
          type: "BigUint"
        }
      ]
    },
    {
      name: "getTreasuryWallet",
      mutability: "readonly",
      inputs: [],
      outputs: [
        {
          type: "Address"
        }
      ]
    },
    {
      name: "getCurrentTime",
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
    TokenAirdrop: {
      type: "struct",
      fields: [
        {
          name: "admin",
          type: "Address"
        },
        {
          name: "total_allocation",
          type: "BigUint"
        },
        {
          name: "total_claimed",
          type: "BigUint"
        },
        {
          name: "start_time",
          type: "BigUint"
        },
        {
          name: "duration",
          type: "BigUint"
        },
        {
          name: "airdrop_token",
          type: "EgldOrEsdtTokenIdentifier"
        }
      ]
    }
  }
}
