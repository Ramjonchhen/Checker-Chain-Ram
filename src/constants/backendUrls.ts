export const backendUrls = {
  getCheckSlug: (slug: string) => `/products/checkSlug/${slug}`,

  getProductReviews: (productId: string) => `/products/${productId}/reviews`,
  postProductReviews: (productId: string) => `/products/${productId}/reviews`,
  getMyReviews: `/reviews/myReviews`,
  getReviews: "/reviews",
  getMyVotes: "/reviews/myVotes",
  getMyFlags: "/reviews/myFlags",

  postVoteReview: (reviewId: string) => `/reviews/${reviewId}/vote`,
  postFlagReview: (reviewId: string) => `/reviews/${reviewId}/flag`,
  deleteReview: (reviewId: string) => `/reviews/${reviewId}`,

  getProducts: "/products",
  getProduct: (productId: string) => `/products/${productId}`,
  getMyProducts: "/products/myProducts",
  putUpdateProduct: (productId: string) => `/products/${productId}`,

  postSubscribeProduct: (productId: string) =>
    `/products/${productId}/subscribe`,
  postUploadProductImage: (productId: string) =>
    `/products/${productId}/uploadImage`,
  postRemoveProductImage: (productId: string) =>
    `/products/${productId}/removeImage`,
  postCheckClaim: (productId: string) => `/products/${productId}/checkClaim`,
  postCheckProductStatus: (productId: string) =>
    `/products/${productId}/checkProductStatus`,

  postAddTeamMember: (productId: string) => `/products/${productId}/addTeam`,
  postRemoveTeamMember: (productId: string) =>
    `/products/${productId}/removeTeam`,

  postSyncProduct: (productId: string) => `/products/${productId}/syncProduct`,
  getTrending: "/trending",
  deleteProduct: (productId: string) => `/products/${productId}`,

  getProductReviewRating: (productId: string) =>
    `/reviews/${productId}/reviewOverallCard`,

  getQuizQuestions: (category: string) =>
    `/trcm/reviewquestions?category=${category}`,
  postQuizResponse: `/trcm/recordresponse`,
  getTrcmCheck: (productId: string) => `/trcm/check/${productId}`,

  getNotifications: () => `/notifications`,
  getUnreadNotifications: () => `/notifications/unread`,
  postMarkAsReadNotifications: "/notifications/markAsRead",

  getRewardData: (walletId: string) => `rewards/data/${walletId}`,

  getTrendingItems: (itemSlug: "reviewers" | "products") => `/trending/${itemSlug}`,
} as const
