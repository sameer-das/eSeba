import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState, useEffect } from "react";
import { getUserInfo, validateUser } from "../API/services";
import { Alert } from 'react-native';
import { decode } from 'base-64';

export const AuthContext = createContext<IAuthContext>({
    userData: null,
    isLoading: false,
    token: null,
    menuCategories: null,
    login: () => { },
    logout: () => { },
    refreshUserDataInContext: () => { },
    getFreshUserData: () => { }
});
export interface IAuthContext {
    userData: any | null,
    isLoading: boolean,
    token: string | null,
    menuCategories: any | null,
    login: Function,
    logout: Function,
    refreshUserDataInContext: Function,
    getFreshUserData: Function,
}
//555401005338
export const AuthProvider = ({ children }: { children: any }) => {
    const [userData, setUserData] = useState<any | null>(null);
    const [menuCategories, setMenuCategories] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    const login = async (loginId: string, password: string) => {
        console.log(`logging in ${loginId} and ${password}`);
        if (!loginId || !password) {
            Alert.alert('Login Error', 'Please enter Login ID and Password!');
            return;
        }
        setIsLoading(true);
        const credentials = { userid: loginId, password: password };
        try {
            const resp = await validateUser(credentials);
            console.log(resp.data);
            if (resp.data.status === 'Success' && resp.data.data && resp.data?.data?.userDetais && resp.data?.data?.userDetais?.user_ID) {
                await AsyncStorage.setItem('token', resp.data.data?.tokens?.token);
                setToken(resp.data.data?.tokens?.token);
                // call user Info 
                const userInfoResp = await getUserInfo(resp.data.data.userDetais.user_ID);
                if (userInfoResp.data.status === 'Success' && userInfoResp.data.code === 200) {
                    await AsyncStorage.setItem('userData', JSON.stringify(userInfoResp.data.data));

                    const menuCategories = getFormattedServices(resp.data.data);
                    await AsyncStorage.setItem('menuCategories', JSON.stringify(menuCategories));

                    setMenuCategories(menuCategories);
                    setUserData(userInfoResp.data.data);
                    setIsLoading(false);
                } else {
                    clearAsyncStorageForUserData();
                    // show modal that login failed
                    Alert.alert('Login Error', 'Something went wrong! Contact helpdesk.');
                }
            } else {
                clearAsyncStorageForUserData();
                // show modal that login failed
                Alert.alert('Login Error', 'Invalid Credentials!')
            }
        } catch (e) {
            console.log(e);
            clearAsyncStorageForUserData();
            // show modal that login failed
            Alert.alert('Login Error', 'Something went wrong! Contact helpdesk.');
        }
    }

    const logout = async () => {
        await clearAsyncStorageForUserData();
    }

    const refreshUserDataInContext = async (userId?: number) => {
        let userID;
        if (!userId) {
            // read from current AsyncStorage 
            const _userData = await AsyncStorage.getItem('userData') || '{}';
            userID = JSON.parse(_userData).user.user_ID
        } else {
            userID = userId;
        }
        const userInfoResp = await getUserInfo(userID);
        if (userInfoResp.data.status === 'Success' && userInfoResp.data.code === 200) {
            await AsyncStorage.removeItem('userData');
            // console.log('in auth context kk')
            // console.log(JSON.stringify(userInfoResp.data.data));
            setUserData(() => { return userInfoResp.data.data });
            await AsyncStorage.setItem('userData', JSON.stringify(userInfoResp.data.data));
        } else {
            // setUserData(null);
        }
    }

    const getFreshUserData = async () => {
        const x = await AsyncStorage.getItem('userData') || '{}';
        return JSON.parse(x);

    }

    const clearAsyncStorageForUserData = async () => {
        setUserData(null);
        setIsLoading(false);
        setToken(null);
        setMenuCategories(null);
        await AsyncStorage.setItem('userData', '');
        await AsyncStorage.removeItem('token');
        await AsyncStorage.setItem('menuCategories', '');
    }

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            const userData = await AsyncStorage.getItem('userData') as string;
            const token = await AsyncStorage.getItem('token') as string;
            const menuCategories = await AsyncStorage.getItem('menuCategories') as string;

            if (userData === '' || !userData || menuCategories === '' || token === '') {
                console.log('Login Not Found')
                clearAsyncStorageForUserData();
            } else if (token) {
                console.log('Token found')
                console.log(token)
                const _payload = token.split('.')[1];
                const payload = decode(_payload);
                const expiry = (JSON.parse(payload)).exp;
                console.log(new Date(expiry * 1000))
                if (Math.floor((new Date).getTime() / 1000) > expiry) {
                    console.log('Token invalid');
                    await logout();
                }
                console.log('Token valid')
                setUserData(JSON.parse(userData));
                setToken(JSON.stringify(token));
                setMenuCategories(JSON.parse(menuCategories));

            } else {
                // console.log('Login Found')
                // setUserData(JSON.parse(userData));
                // setToken(JSON.stringify(token));
                // setMenuCategories(JSON.parse(menuCategories));
            }
            setIsLoading(false);
        } catch (e) {
            console.log('isLoggedIn error');
            console.log(e)
        }
    }

    const getFormattedServices = (data: any) => {
        const categories = data.services.map((serv: any) => {
            return {
                ...serv,
                services: data.categories.filter((cat: any) => cat.services_ID === serv.services_ID)
            }
        });

        // console.log(categories);
        return categories
    }

    useEffect(() => {
        console.log('checking login')
        isLoggedIn();
    }, [])


    return (<AuthContext.Provider value={{ userData, isLoading, token, menuCategories, login, logout, refreshUserDataInContext, getFreshUserData }}>
        {children}
    </AuthContext.Provider>)
}