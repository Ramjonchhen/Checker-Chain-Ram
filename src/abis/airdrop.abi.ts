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
      name: "airdrop",
      version: "0.0.2",
      git_version: "23ff9bd-modified"
    },
    framework: {
      name: "elrond-wasm",
      version: "0.34.1"
    }
  },
  name: "Airdrop",
  constructor: {
    inputs: [
      {
        name: "token_id",
        type: "TokenIdentifier"
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
          name: "epoch_number",
          type: "BigUint"
        }
      ],
      outputs: []
    },
    {
      name: "set_epoch_root",
      onlyOwner: true,
      mutability: "mutable",
      inputs: [
        {
          name: "epoch_number",
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
      name: "claim_checkr",
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
      name: "getTokenId",
      mutability: "readonly",
      inputs: [],
      outputs: [
        {
          type: "TokenIdentifier"
        }
      ]
    },
    {
      name: "getEpochRoot",
      mutability: "readonly",
      inputs: [
        {
          name: "epoch_number",
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
          name: "epoch_number",
          type: "BigUint"
        }
      ],
      outputs: [
        {
          type: "bool"
        }
      ]
    }
  ],
  events: [],
  hasCallback: false,
  types: {}
}
