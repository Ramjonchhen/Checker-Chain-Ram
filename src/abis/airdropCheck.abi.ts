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
    inputs: [],
    outputs: []
  },
  endpoints: [
    {
      name: "check",
      mutability: "mutable",
      inputs: [
        {
          name: "root",
          type: "array32<u8>"
        },
        {
          name: "user",
          type: "Address"
        },
        {
          name: "proof",
          type: "List<array32<u8>>"
        },
        {
          name: "amount",
          type: "BigUint"
        },
        {
          name: "index",
          type: "BigUint"
        }
      ],
      outputs: []
    }
  ],
  events: [],
  hasCallback: false,
  types: {}
}
