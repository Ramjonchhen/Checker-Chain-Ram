import {
    useExtensionLogin,
    useWalletConnectV2Login,
    useLedgerLogin,
    useWebWalletLogin,
} from '@multiversx/sdk-dapp/hooks';

type Props = {
    loginMethod: 'MultiversX' | 'Web Wallet' | 'Ledger' | 'Web Wallet';
}

type ReturnType = {
    initiateLogin: () => void


}

// Inprogress not currently used
// TODO: abstract all login methods in this hook
const useLogin = ({ loginMethod }: Props): ReturnType => {

    let loginHook: any

    switch (loginMethod) {
        case "MultiversX":
            loginHook = useExtensionLogin
            break;
        case "Web Wallet":
            loginHook = useWalletConnectV2Login
            break;
        case "Ledger":
            loginHook = useLedgerLogin
            break;
        case "Web Wallet":
            loginHook = useWebWalletLogin
            break;
        default:
            break;
    }


    // console.log(loginHook)

    const initiateLogin = async () => {
        try {
            const [initiateLogin] = loginHook({
                callbackRoute: "/"
            });
            initiateLogin()
        }
        catch (err) {
            console.log(err)
        }
    }


    return {
        initiateLogin: initiateLogin
    }

}

export default useLogin