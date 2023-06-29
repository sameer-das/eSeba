import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { getWalletBalance } from "../API/services";


export const WalletContext = createContext<IWalletContext>({
    wallet: '',
    refreshWallet: () => { },
    isRefreshing: false
})

export interface IWalletContext {
    wallet: string,
    refreshWallet: Function,
    isRefreshing: boolean
}


export const WalletProvider = ({ children }: any) => {
    const [wallet, setWallet] = useState<string>('');
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const { userData } = useContext(AuthContext);

    const refreshWallet = async () => {
        setIsRefreshing(true);
        try {
            const { data } = await getWalletBalance(userData.user.user_EmailID);
            if (data.status === 'Success' && data.code === 200) {
                console.log('wallet context api successs ' + data.data)
                setWallet(data.data);
            }
        } catch (e) {
            console.log('error while fetching wallet in wallet context')
            console.log(e)
        } finally {
            setIsRefreshing(false);
        }
    }


    useEffect(() => {
        refreshWallet()
    },[])

    return (<WalletContext.Provider value={{ wallet, isRefreshing, refreshWallet }}>
        {children}
    </WalletContext.Provider>)
}