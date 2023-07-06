import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React, { useContext, useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { getWalletBalance } from '../API/services';
import colors from '../constants/colors';
import { AuthContext } from '../context/AuthContext';


const CustomDrawer = (props: any) => {
    const { logout, userData } = useContext(AuthContext);
    const [wallet, setWallet] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchWalletBalance = async () => {
        const email = userData.user.user_EmailID
        setIsLoading(true)
        try {
            const { data } = await getWalletBalance(email);
            if (data.status === 'Success' && data.code === 200) {
                const [walletBalance, commission] = data.data.split(',');
                setWallet(walletBalance);
            } else {

            }
        } catch (e) {
            console.log('error while fetching wallet balance in custoom drawer screen')
            console.log(e)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchWalletBalance()
    }, [])


    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContentStyle}>
            <View>
                <View style={[styles.profilePicContainer]}>
                    <Image source={require('../../assets/images/user-profile2.png')} style={styles.profilePic} />
                    <Text style={styles.userName}>Hello {userData.personalDetail.user_FName}</Text>
                    <Text style={styles.loginCode} selectable>{userData.user.login_Code}</Text>
                    {!isLoading ?
                        <Pressable style={{ alignItems: 'center' }} onPress={() => fetchWalletBalance()}>
                            <Text style={styles.balance}>Balance ₹ {wallet}</Text>
                            <Text style={{ fontSize: 12, color: colors.primary100}}>Tap to Refresh</Text>
                        </Pressable> :
                        <ActivityIndicator color={colors.white} size={30} />
                    }

                </View>
                <View style={styles.itemListContainer}>
                    <DrawerItemList {...props} />
                </View>

            </View>
            <View style={[styles.bottomMenu]}>
                <Pressable style={styles.bottomMenuList} onPress={() => logout()}>
                    <MaterialIcon name="logout" style={{ fontSize: 30, color: colors.white }} />
                    <Text style={styles.bottomMenuItemLabel}>Sign Out</Text>
                </Pressable>
                <Pressable style={styles.bottomMenuList}>
                    <MaterialIcon name="contact-support" style={{ fontSize: 30, color: colors.white }} />
                    <Text style={styles.bottomMenuItemLabel}>Support</Text>
                </Pressable>
            </View>
        </DrawerContentScrollView >
    )
}

export default CustomDrawer

const styles = StyleSheet.create({
    drawerContentStyle: {
        backgroundColor: colors.primary500,
        flex: 1,
        justifyContent: 'space-between',
    },
    profilePicContainer: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    profilePic: {
        height: 80,
        width: 80,
        borderRadius: 40,
    },
    userName: {
        color: colors.white,
        fontSize: 20,
        // marginVertical: 4
    },
    loginCode: {
        color: colors.primary100,
        fontSize: 14,
        fontWeight: '500'
    },
    balance: {
        color: colors.white,
        fontSize: 16,
    },
    itemListContainer: {
        // backgroundColor:colors.primary300,
        paddingTop: 10
    },
    borderRed: {
        borderWidth: 2,
        borderColor: 'red',
        borderStyle: 'solid'
    },
    bottomMenu: {
        padding: 20,
        height: 150,
        borderTopColor: colors.primary300,
        borderTopWidth: 2


    },
    bottomMenuItemLabel: {
        fontSize: 18,
        color: colors.white,
        marginLeft: 10,
    },
    bottomMenuList: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12
    }
})