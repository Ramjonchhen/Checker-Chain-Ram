import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useWallet } from "./useWallet";
import { useNotificationStore } from "stores/notification";

// const serverPath = `ws://localhost:8000`;
// const serverPath = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;

const serverPath = (process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://mvp-backend-testnet.checkerchain.com/api/v1").replace("/api/v1", "")

let isInitialized = false;
export const useSocket = () => {
    const { setNotificationData } = useNotificationStore()
    const { wallet: { address } } = useWallet()
    const [messageData, setMessageData] = useState<any>({});

    const socket = useMemo(() => {
        if (!address || address === '') return null
        const sock = io(serverPath, {
            transports: ['websocket'],
        });
        return sock;
    }, [address]);

    useEffect(() => {
        if (!socket) return
        if (!address || address === '') return
        if (socket.connected && isInitialized) return
        if (!socket.connected) socket.connect();
        socket.on('connect', () => {
            socket.emit('privateSubscribe', {
                walletAddress: address,
            });

        });
        socket.on('message', (data: any) => {
            setMessageData(data);
        });
        socket.on('show_notification', (data: any) => {
            setNotificationData(data)
        })
        isInitialized = true;
        return () => {
            socket.disconnect();
            isInitialized = false;
        }
    }, [socket, address]);

    return {
        socket,
        messageData,
    };
}