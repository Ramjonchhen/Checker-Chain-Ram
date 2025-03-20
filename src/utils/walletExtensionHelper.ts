export const navigateToWalletExtension = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Firefox')) {
        window.open(
            "https://addons.mozilla.org/en-US/firefox/addon/multiversx-defi-wallet/",
            "_blank"
        )

    } else {
        window.open(
            "https://chrome.google.com/webstore/detail/multiversx-defi-wallet/dngmlblcodfobpdpecaadgfbcggfjfnm",
            "_blank"
        )
    }
}