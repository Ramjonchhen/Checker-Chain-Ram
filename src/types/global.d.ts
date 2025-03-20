// global.d.ts
export { };

declare global {
    interface Window {
        ethereum?: any;
        phantom?: any;
        injectedWeb3?: {
            subwallet?: {
                enable: () => Promise<void>;
                getAccounts: () => Promise<{ address: string }[]>;
            };
            [key: string]: any;
        };
        coinbaseWalletExtension?: any;
    }
}
