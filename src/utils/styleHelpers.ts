
export function getProductTrustScoreColor(trustScore: number) {
    if (trustScore <= 24) {
        return "#FF3722"
    }
    else if (trustScore >= 25 && trustScore <= 49) {
        return "#FF8622"
    }
    else if (trustScore >= 50 && trustScore <= 69) {
        return "#EBBE00"
    }
    else if (trustScore >= 70 && trustScore <= 79) {
        return "#73CF11"
    }
    else {
        return "#009B68"
    }

}
export function getProductRatingScoreColor(ratingScore: number) {
    if (ratingScore <= 1) {
        return "#FF3722"
    }
    else if (ratingScore > 1 && ratingScore <= 2) {
        return "#FF8622"
    }
    else if (ratingScore > 2 && ratingScore <= 3) {
        return "#EBBE00"
    }
    else if (ratingScore > 3 && ratingScore <= 4) {
        return "#73CF11"
    }
    else {
        return "#009B68"
    }

}