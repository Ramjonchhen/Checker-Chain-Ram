import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { ethers } from 'ethers';

/**
 * Connects to MetaMask.
 * - Checks if window.ethereum is injected and flagged as MetaMask.
 * - If not available, opens the MetaMask download page.
 * - If available, requests accounts and returns the first account.
 */
export async function connectMetaMask() {
    if (typeof window.ethereum === 'undefined' || !window.ethereum.isMetaMask) {
        // Redirect to MetaMask installation page.
        window.open('https://metamask.io/download/', '_blank');
        return null;
    }
    try {
        const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        return accounts[0];
    } catch (error) {
        console.error('MetaMask connection error:', error);
        return null;
    }
}

/**
 * Connects to Phantom (Solana).
 * - Checks if window.solana is available and flagged as Phantom.
 * - If not, opens the Phantom website.
 * - If available, connects and returns the public key.
 */
export async function connectPhantom() {
    const isPhantomInstalled = window.phantom?.solana?.isPhantom;
    console.log("is phantom installed: ", isPhantomInstalled)

    if (!isPhantomInstalled) {
        // Redirect to Phantom installation page.
        window.open('https://phantom.app/', '_blank');
        return null;
    }
    try {
        const response = await window.phantom.solana.connect();
        return response.publicKey.toString();
    } catch (error) {
        console.error('Phantom connection error:', error);
        return null;
    }
}

/**
 * Connects to Trust Wallet.
 * - Checks if window.ethereum is available and flagged as Trust Wallet.
 * - If not, opens the Trust Wallet website.
 * - If available, requests accounts and returns the first account.
 *
 * Note: Trust Wallet usually injects window.ethereum with a flag (commonly `isTrust`).
 * Adjust the flag as per your integration.
 */
export async function connectTrustWallet() {
    if (typeof window.ethereum === 'undefined' || !window.ethereum.isTrust) {
        // Redirect to Trust Wallet website.
        window.open('https://trustwallet.com/', '_blank');
        return null;
    }
    try {
        const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        return accounts[0];
    } catch (error) {
        console.error('Trust Wallet connection error:', error);
        return null;
    }
}

/**
 * Connects to Coinbase Wallet.
 * - Checks if window.ethereum is available and flagged as Coinbase Wallet.
 * - If not, opens the Coinbase Wallet download page.
 * - If available, requests accounts and returns the first account.
 */
export async function connectCoinbaseWallet() {
    // Approach 1: Check if Coinbase Wallet is injected in the browser.
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isCoinbaseWallet) {
        try {
            const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
            return accounts[0];
        } catch (error) {
            console.error('Coinbase Wallet connection error (injected):', error);
            return null;
        }
    } else {
        // Approach 2: Use Coinbase Wallet SDK as a fallback.
        try {
            // Configure your app details and network settings.
            const APP_NAME = "Checker Chain";

            // Initialize the Coinbase Wallet SDK
            const coinbaseWallet = new CoinbaseWalletSDK({
                appName: APP_NAME,
            });

            // Create a Web3 provider using Coinbase Wallet SDK.
            const ethereum = coinbaseWallet.makeWeb3Provider();

            // Request account access.
            const accounts: string[] = await ethereum.request({ method: 'eth_requestAccounts' }) as string[];
            return accounts[0];
        } catch (error) {
            console.error('Coinbase Wallet connection error (SDK):', error);
            return null;
        }
    }
}

/**
 * Connects using WalletConnect.
 * - Dynamically imports WalletConnectProvider.
 * - Creates a new instance and triggers the QR code modal for connection.
 * - Returns the first account after connection.
 */
// export async function connectWalletConnect(): Promise<WalletData | null> {
//     let WalletConnectProvider;
//     try {
//         // Dynamically import the WalletConnect provider package.
//         const module = await import('@walletconnect/web3-provider');
//         WalletConnectProvider = module.default;
//     } catch (error) {
//         console.error('WalletConnectProvider module not found:', error);
//         return null;
//     }

//     if (!WalletConnectProvider) {
//         console.error('WalletConnectProvider is not available.');
//         return null;
//     }

//     try {
//         // Create a new WalletConnect provider instance with your Infura ID (or another RPC provider).
//         const provider = new WalletConnectProvider({
//             infuraId: 'YOUR_INFURA_ID',
//         });
//         // Enable the provider (this will open the QR code modal).
//         const accounts: string[] = await provider.enable();
//         return { provider: 'walletconnect', account: accounts[0] };
//     } catch (error) {
//         console.error('WalletConnect connection error:', error);
//         return null;
//     }
// }

/**
 * Connects to SubWallet.
 * - Checks if SubWallet's injection is available via window.injectedWeb3.
 * - If not, opens the SubWallet website.
 * - If available, enables the extension and retrieves accounts.
 *
 * Note: The exact API might differ; adjust according to SubWallet's documentation.
 */
export async function connectSubWallet() {
    const SubWalletExtension = window.injectedWeb3?.['subwallet-js']

    if (!SubWalletExtension) {
        // Redirect to SubWallet website.
        window.open('https://subwallet.app/', '_blank');
        return null;
    }
    try {
        // Enable the SubWallet extension.
        const extension = await SubWalletExtension.enable();
        // Retrieve accounts from SubWallet (assumes a method getAccounts is available).
        const accounts = await extension.accounts.get();
        console.log("accounts is: ", accounts)
        if (accounts && accounts.length > 0) {
            return accounts[0].address;
        } else {
            console.error('No accounts found in SubWallet.');
            return null;
        }
    } catch (error) {
        console.error('SubWallet connection error:', error);
        return null;
    }
}

export async function connectMultiVerseX() {

}
