export const vestingAbi = {
    "buildInfo": {
        "rustc": {
            "version": "1.70.0-nightly",
            "commitHash": "28a29282f6dde2e4aba6e1e4cfea5c9430a00217",
            "commitDate": "2023-04-06",
            "channel": "Nightly",
            "short": "rustc 1.70.0-nightly (28a29282f 2023-04-06)"
        },
        "contractCrate": {
            "name": "vesting",
            "version": "0.0.2"
        },
        "framework": {
            "name": "multiversx-sc",
            "version": "0.39.8"
        }
    },
    "name": "Vesting",
    "constructor": {
        "inputs": [
            {
                "name": "checkr_token",
                "type": "EgldOrEsdtTokenIdentifier"
            }
        ],
        "outputs": []
    },
    "endpoints": [
        {
            "name": "rescue_token",
            "onlyOwner": true,
            "mutability": "mutable",
            "inputs": [
                {
                    "name": "token_address",
                    "type": "EgldOrEsdtTokenIdentifier"
                },
                {
                    "name": "token_amount",
                    "type": "BigUint"
                }
            ],
            "outputs": []
        },
        {
            "name": "rescue_egld",
            "onlyOwner": true,
            "mutability": "mutable",
            "inputs": [],
            "outputs": []
        },
        {
            "name": "revoke",
            "onlyOwner": true,
            "mutability": "mutable",
            "inputs": [
                {
                    "name": "vesting_schedule_id",
                    "type": "array32<u8>"
                }
            ],
            "outputs": []
        },
        {
            "name": "set_current_epoch",
            "mutability": "mutable",
            "inputs": [
                {
                    "name": "new_epoch",
                    "type": "u64"
                }
            ],
            "outputs": []
        },
        {
            "name": "create_vesting_schedule",
            "mutability": "mutable",
            "payableInTokens": [
                "*"
            ],
            "inputs": [
                {
                    "name": "caller",
                    "type": "bytes"
                },
                {
                    "name": "beneficiary",
                    "type": "Address"
                },
                {
                    "name": "start",
                    "type": "BigUint"
                },
                {
                    "name": "cliff",
                    "type": "BigUint"
                },
                {
                    "name": "duration",
                    "type": "BigUint"
                },
                {
                    "name": "revocable",
                    "type": "bool"
                }
            ],
            "outputs": []
        },
        {
            "name": "release",
            "mutability": "mutable",
            "inputs": [
                {
                    "name": "vesting_schedule_id",
                    "type": "array32<u8>"
                },
                {
                    "name": "amount",
                    "type": "BigUint"
                }
            ],
            "outputs": []
        },
        {
            "name": "compute_releasable_amount",
            "mutability": "readonly",
            "inputs": [
                {
                    "name": "vesting_schedule_id",
                    "type": "array32<u8>"
                }
            ],
            "outputs": [
                {
                    "type": "BigUint"
                }
            ]
        },
        {
            "name": "compute_vesting_schedule_id",
            "mutability": "readonly",
            "inputs": [
                {
                    "name": "holder",
                    "type": "Address"
                },
                {
                    "name": "index",
                    "type": "BigUint"
                }
            ],
            "outputs": [
                {
                    "type": "array32<u8>"
                }
            ]
        },
        {
            "name": "get_holders_all_vesting",
            "mutability": "readonly",
            "inputs": [
                {
                    "name": "holder",
                    "type": "Address"
                }
            ],
            "outputs": [
                {
                    "type": "List<VestingDetail>"
                }
            ]
        },
        {
            "name": "get_holders_total_vested_amount",
            "mutability": "readonly",
            "inputs": [
                {
                    "name": "holder",
                    "type": "Address"
                }
            ],
            "outputs": [
                {
                    "type": "BigUint"
                }
            ]
        },
        {
            "name": "get_holders_total_released_amount",
            "mutability": "readonly",
            "inputs": [
                {
                    "name": "holder",
                    "type": "Address"
                }
            ],
            "outputs": [
                {
                    "type": "BigUint"
                }
            ]
        },
        {
            "name": "get_holders_total_releasable_amount",
            "mutability": "readonly",
            "inputs": [
                {
                    "name": "holder",
                    "type": "Address"
                }
            ],
            "outputs": [
                {
                    "type": "BigUint"
                }
            ]
        },
        {
            "name": "get_current_epoch",
            "mutability": "readonly",
            "inputs": [],
            "outputs": [
                {
                    "type": "u64"
                }
            ]
        },
        {
            "name": "checkrTokenIdentifier",
            "mutability": "readonly",
            "inputs": [],
            "outputs": [
                {
                    "type": "EgldOrEsdtTokenIdentifier"
                }
            ]
        },
        {
            "name": "vestingSchedulesIds",
            "mutability": "readonly",
            "inputs": [],
            "outputs": [
                {
                    "type": "variadic<array32<u8>>",
                    "multi_result": true
                }
            ]
        },
        {
            "name": "getUserVestingSchedules",
            "mutability": "readonly",
            "inputs": [
                {
                    "name": "vesting_schedule_id",
                    "type": "array32<u8>"
                }
            ],
            "outputs": [
                {
                    "type": "VestingSchedule"
                }
            ]
        },
        {
            "name": "getLastClaimedRound",
            "mutability": "readonly",
            "inputs": [
                {
                    "name": "vesting_schedule_id",
                    "type": "array32<u8>"
                }
            ],
            "outputs": [
                {
                    "type": "u64"
                }
            ]
        },
        {
            "name": "holdersCount",
            "mutability": "readonly",
            "inputs": [
                {
                    "name": "user",
                    "type": "Address"
                }
            ],
            "outputs": [
                {
                    "type": "BigUint"
                }
            ]
        },
        {
            "name": "currentEpoch",
            "mutability": "readonly",
            "inputs": [],
            "outputs": [
                {
                    "type": "u64"
                }
            ]
        }
    ],
    "events": [],
    "hasCallback": false,
    "types": {
        "VestingDetail": {
            "type": "struct",
            "fields": [
                {
                    "name": "vesting_schedule",
                    "type": "VestingSchedule"
                },
                {
                    "name": "vesting_releasable_amount",
                    "type": "BigUint"
                }
            ]
        },
        "VestingSchedule": {
            "type": "struct",
            "fields": [
                {
                    "name": "initialized",
                    "type": "bool"
                },
                {
                    "name": "beneficiary",
                    "type": "Address"
                },
                {
                    "name": "creator",
                    "type": "bytes"
                },
                {
                    "name": "cliff",
                    "type": "BigUint"
                },
                {
                    "name": "start",
                    "type": "BigUint"
                },
                {
                    "name": "duration",
                    "type": "BigUint"
                },
                {
                    "name": "revocable",
                    "type": "bool"
                },
                {
                    "name": "amount_total",
                    "type": "BigUint"
                },
                {
                    "name": "released",
                    "type": "BigUint"
                },
                {
                    "name": "revoked",
                    "type": "bool"
                },
                {
                    "name": "last_claimed_epoch",
                    "type": "u64"
                },
                {
                    "name": "available",
                    "type": "BigUint"
                }
            ]
        }
    }
}
