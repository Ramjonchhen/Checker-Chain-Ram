export const reviewAbi = {
    "buildInfo": {
        "rustc": {
            "version": "1.72.0-nightly",
            "commitHash": "83964c156db1f444050a38b2498dbd0da6d5d503",
            "commitDate": "2023-07-08",
            "channel": "Nightly",
            "short": "rustc 1.72.0-nightly (83964c156 2023-07-08)"
        },
        "contractCrate": {
            "name": "review",
            "version": "0.0.2"
        },
        "framework": {
            "name": "multiversx-sc",
            "version": "0.39.8"
        }
    },
    "name": "Reviews",
    "constructor": {
        "inputs": [
            {
                "name": "checker",
                "type": "TokenIdentifier"
            },
            {
                "name": "feedback_fee",
                "type": "BigUint"
            },
            {
                "name": "review_fee",
                "type": "BigUint"
            }
        ],
        "outputs": []
    },
    "endpoints": [
        {
            "name": "post_review",
            "mutability": "mutable",
            "payableInTokens": [
                "*"
            ],
            "inputs": [
                {
                    "name": "product_id",
                    "type": "bytes"
                },
                {
                    "name": "question_id",
                    "type": "array32<u8>"
                },
                {
                    "name": "answer_id",
                    "type": "array32<u8>"
                },
                {
                    "name": "wallet_id",
                    "type": "Address"
                },
                {
                    "name": "review_cycle_id",
                    "type": "BigUint"
                }
            ],
            "outputs": []
        },
        {
            "name": "submit_feedback",
            "mutability": "mutable",
            "inputs": [
                {
                    "name": "user_feedback",
                    "type": "bytes"
                },
                {
                    "name": "user_message",
                    "type": "bytes"
                },
                {
                    "name": "user_rating",
                    "type": "u64"
                },
                {
                    "name": "product_id",
                    "type": "bytes"
                }
            ],
            "outputs": []
        },
        {
            "name": "flag_user_feedback",
            "mutability": "mutable",
            "payableInTokens": [
                "*"
            ],
            "inputs": [
                {
                    "name": "feedback_user",
                    "type": "Address"
                },
                {
                    "name": "feedback_product",
                    "type": "bytes"
                }
            ],
            "outputs": []
        },
        {
            "name": "update_flag_feedback_fees",
            "onlyOwner": true,
            "mutability": "mutable",
            "inputs": [
                {
                    "name": "feedback_fee",
                    "type": "BigUint"
                }
            ],
            "outputs": []
        },
        {
            "name": "getUserReview",
            "mutability": "readonly",
            "inputs": [
                {
                    "name": "user",
                    "type": "Address"
                },
                {
                    "name": "product_id",
                    "type": "bytes"
                }
            ],
            "outputs": [
                {
                    "type": "ProductReview"
                }
            ]
        },
        {
            "name": "getUserFeedback",
            "mutability": "readonly",
            "inputs": [
                {
                    "name": "user",
                    "type": "Address"
                },
                {
                    "name": "product_id",
                    "type": "bytes"
                }
            ],
            "outputs": [
                {
                    "type": "ProductFeedback"
                }
            ]
        },
        {
            "name": "getFlagFeedbackFee",
            "mutability": "readonly",
            "inputs": [],
            "outputs": [
                {
                    "type": "BigUint"
                }
            ]
        },
        {
            "name": "getReviewFee",
            "mutability": "readonly",
            "inputs": [],
            "outputs": [
                {
                    "type": "BigUint"
                }
            ]
        },
        {
            "name": "getCheckerToken",
            "mutability": "readonly",
            "inputs": [],
            "outputs": [
                {
                    "type": "TokenIdentifier"
                }
            ]
        }
    ],
    "events": [],
    "hasCallback": false,
    "types": {
        "ProductFeedback": {
            "type": "struct",
            "fields": [
                {
                    "name": "feedback",
                    "type": "bytes"
                },
                {
                    "name": "message",
                    "type": "bytes"
                },
                {
                    "name": "rating",
                    "type": "u64"
                },
                {
                    "name": "flag_count",
                    "type": "BigUint"
                }
            ]
        },
        "ProductReview": {
            "type": "struct",
            "fields": [
                {
                    "name": "question_id",
                    "type": "array32<u8>"
                },
                {
                    "name": "answer_id",
                    "type": "array32<u8>"
                },
                {
                    "name": "product_id",
                    "type": "bytes"
                },
                {
                    "name": "wallet_id",
                    "type": "Address"
                },
                {
                    "name": "review_cycle_id",
                    "type": "BigUint"
                }
            ]
        }
    }
}
