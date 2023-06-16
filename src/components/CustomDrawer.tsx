import { Image, Pressable, StyleSheet, Text, View, } from 'react-native'
import React, { useContext } from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import colors from '../constants/colors';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../context/AuthContext';


const CustomDrawer = (props: any) => {
    const { logout, userData } = useContext(AuthContext);
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContentStyle}>
            <View>
                <View style={[styles.profilePicContainer]}>
                    <Image source={require('../../assets/images/user-profile2.png')} style={styles.profilePic} />
                    <Text style={styles.userName}>Hello Sameer</Text>
                    <Text style={styles.balance}>Balance ₹ 5000.00</Text>
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
        marginVertical: 8
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
        marginLeft: 10
    },
    bottomMenuList: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12
    }
})