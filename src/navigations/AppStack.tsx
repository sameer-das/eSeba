import { createDrawerNavigator } from '@react-navigation/drawer';
import { useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import CustomDrawer from '../components/CustomDrawer';
import colors from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import BillDetails from '../screens/bbps/BillDetails';
import FetchBillDetails from '../screens/bbps/FetchBillDetails';
import ListBillers from '../screens/bbps/ListBillers';
import Home from '../screens/home/Home';
import Profile from '../screens/home/Profile';
import RechargeWallet from '../screens/wallet/RechargeWallet';
import Wallet from '../screens/wallet/Wallet';
import SearchContact from '../screens/prepaid recharge/SearchContact';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const DrawNav = () => {
    return (
        <Drawer.Navigator
            drawerContent={props => <CustomDrawer {...props} />}
            screenOptions={{
                drawerLabelStyle: { marginLeft: -25, fontSize: 18 },
                drawerActiveTintColor: colors.white,
                drawerInactiveTintColor: colors.primary100,
                drawerActiveBackgroundColor: colors.primary200,
                headerTintColor: colors.white,
                headerStyle: {
                    backgroundColor: colors.primary500
                },
            }}>
            <Drawer.Screen component={Home} name='Dashboard' options={{
                drawerIcon: ({ color }) => <MaterialIcon name='home' size={30} color={color} />
            }} />
            <Drawer.Screen component={Wallet} name='Wallet' options={{
                drawerIcon: ({ color }) => <MaterialIcon name='account-balance-wallet' size={30} color={color} />
            }} />
            {/* <Drawer.Screen component={Profile} name='Profile' options={{
                drawerLabel: 'My Profile', title: 'My Profile',
                drawerIcon: ({ color }) => <MaterialIcon name='person' size={30} color={color} />
            }} /> */}
        </Drawer.Navigator>
    )
}

const BBPSStack = () => {
    const route = useRoute()
    // console.log('focused route')
    // console.log(route);
    // console.log(focusedRoute);

    return (<Stack.Navigator>
        <Stack.Screen
            name='ListBillers'
            options={{ title: (route.params as any).bbpsSeviceName }}
            initialParams={route.params} component={ListBillers} />

        <Stack.Screen
            name='FetchBill'
            options={({ route }: any) => {
                return {
                    title: (route.params as any).blr_name,
                    headerStyle: { backgroundColor: colors.primary500 },
                    headerTintColor: colors.white
                }
            }}
            initialParams={route.params} component={FetchBillDetails} />

        <Stack.Screen name='BillDetails'
            options={{ title: 'Bill Details' }}
            component={BillDetails} />

    </Stack.Navigator>)
}

const WalletStack = () => {
    return (<Stack.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: colors.primary500 },
            headerTintColor: colors.white
        }}>

        <Stack.Screen
            name="rechargeWallet"
            component={RechargeWallet}
            options={{
                title: 'Reacharge Wallet'
            }} />

    </Stack.Navigator>)
}

const PrepaidRechargeStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: { backgroundColor: colors.primary500 },
            headerTintColor: colors.white
        }}>
            <Stack.Screen name='searchContact' component={SearchContact} options={{ title: 'Prepaid Recharge' }} />
        </Stack.Navigator>
    )
}

const AppStack = () => {

    const { logout, userData } = useContext(AuthContext);

    return (
        <Stack.Navigator>
            <Stack.Screen name='Home' component={DrawNav} options={{ headerShown: false }} />
            <Stack.Screen name='bbps' component={BBPSStack} options={{ headerShown: false }} />
            <Stack.Screen name='wallet' component={WalletStack} options={{ headerShown: false }} />
            <Stack.Screen name='prepaidRecharge' component={PrepaidRechargeStack} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

export default AppStack

const styles = StyleSheet.create({})