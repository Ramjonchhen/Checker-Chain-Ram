export const constants = {
  ALLOWED_FILES: ["jpg", "png", "jpeg", "gif", "webp", "avif", "bmp", "svg"],
  MAX_FILE_SIZE: 1 * 1024 * 1024, // 5MB,
  WALLET_PVT_KEY: "@#@$@#SDFSD@#@sddfls1212",
  APP_CONTAINER_WIDTH: "max-w-[1440px] mx-auto",
  PRODUCT_CREATION_FEE_NUMBER: 5000,
  APP_CONTAINER_PADDING: "px-3 pt-5",
  APP_QR_MODAL_OPEN_SLUG: "#connectqr"

} as const

export const claimedVestingColor = "#5898D5"
export const availableVestingColor = "#FFD024"
export const vestingColor = "#FF4B69"

export const allVestingColors = [
  claimedVestingColor,
  availableVestingColor,
  vestingColor
]
