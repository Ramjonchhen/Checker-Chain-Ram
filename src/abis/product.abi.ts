export const abi = {
  buildInfo: {
    rustc: {
      version: "1.66.0-nightly",
      commitHash: "5e9772042948002f9c6f60c4c81603170035fffa",
      commitDate: "2022-10-29",
      channel: "Nightly",
      short: "rustc 1.66.0-nightly (5e9772042 2022-10-29)"
    },
    contractCrate: {
      name: "brand",
      version: "0.0.2",
      git_version: "7de5609-modified"
    },
    framework: {
      name: "elrond-wasm",
      version: "0.35.0"
    }
  },
  name: "BrandPage",
  constructor: {
    inputs: [
      {
        name: "dead_wallet",
        type: "Address"
      },
      {
        name: "checker",
        type: "EgldOrEsdtTokenIdentifier"
      },
      {
        name: "creator_fee",
        type: "BigUint"
      },
      {
        name: "claim_fee",
        type: "BigUint"
      }
    ],
    outputs: []
  },
  endpoints: [
    {
      name: "create_brand",
      mutability: "mutable",
      payableInTokens: ["*"],
      inputs: [
        {
          name: "brand_id",
          type: "bytes"
        }
      ],
      outputs: []
    },
    {
      name: "claim_brand",
      mutability: "mutable",
      payableInTokens: ["*"],
      inputs: [
        {
          name: "brand_id",
          type: "bytes"
        }
      ],
      outputs: []
    },
    {
      name: "approve_claim",
      onlyOwner: true,
      mutability: "mutable",
      inputs: [
        {
          name: "brand_id",
          type: "bytes"
        }
      ],
      outputs: []
    },
    {
      name: "update_creator_fee",
      onlyOwner: true,
      mutability: "mutable",
      inputs: [
        {
          name: "fee",
          type: "BigUint"
        }
      ],
      outputs: []
    },
    {
      name: "update_brand_fee",
      onlyOwner: true,
      mutability: "mutable",
      inputs: [
        {
          name: "fee",
          type: "BigUint"
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
      onlyOwner: true,
      mutability: "mutable",
      inputs: [
        {
          name: "amount",
          type: "BigUint"
        }
      ],
      outputs: []
    },
    {
      name: "getCreateBrandFee",
      mutability: "readonly",
      inputs: [],
      outputs: [
        {
          type: "BigUint"
        }
      ]
    },
    {
      name: "getClaimBrandFee",
      mutability: "readonly",
      inputs: [],
      outputs: [
        {
          type: "BigUint"
        }
      ]
    },
    {
      name: "getBrands",
      mutability: "readonly",
      inputs: [
        {
          name: "brand_count",
          type: "bytes"
        }
      ],
      outputs: [
        {
          type: "Brand"
        }
      ]
    },
    {
      name: "getDeadWallet",
      mutability: "readonly",
      inputs: [],
      outputs: [
        {
          type: "Address"
        }
      ]
    },
    {
      name: "getCheckerToken",
      mutability: "readonly",
      inputs: [],
      outputs: [
        {
          type: "EgldOrEsdtTokenIdentifier"
        }
      ]
    }
  ],
  events: [],
  hasCallback: false,
  types: {
    Brand: {
      type: "struct",
      fields: [
        {
          name: "creator",
          type: "Address"
        },
        {
          name: "claimer",
          type: "Address"
        },
        {
          name: "create_time",
          type: "BigUint"
        },
        {
          name: "claim_time",
          type: "BigUint"
        },
        {
          name: "approved",
          type: "bool"
        }
      ]
    }
  }
}
