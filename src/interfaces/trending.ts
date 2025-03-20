export type ITrendingProducts = {
    name?: string;
    subcategories?: string[];
    slug?: string;
    logo?: string;
    ratingScore?: number;
    ratings?: number;
    reviewCount?: number;
    subscriberCount?: number;
    rewards?: number;
    ageInHours?: number;
    rankingScore?: number;
    rank?: number;
}

export type ITrendingReviewers = {
    username?: string;
    follower?: number;
    following?: number;
    profilePicture?: string;
    name?: string;
    profileScore?: number;
    reviewCount?: number;
    actualReviewCount?: number;
    totalVotes?: number;
    reward?: number;
    rank?: number;
}
