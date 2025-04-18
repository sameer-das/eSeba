import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import colors from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import SearchDMTRecipient from '../screens/TransferMoneyFromHomeScreen/SearchDMTRecipient';
import FetchBillDetails from '../screens/bbps/FetchBillDetails';
import ListBillers from '../screens/bbps/ListBillers';
import BBPSTransactionStatus from '../screens/common/BBPSTransactionStatus';
import AboutEPayMain from '../screens/About ePay/AboutEPayMain';
import PolicyDetails from '../screens/About ePay/PolicyDetails';
import NewOtpScreen from '../screens/common/NewOtpScreen';
import PrepaidTransactionStatus from '../screens/common/PrepaidTransactionStatus';
import DMTTabs from '../screens/dmt/DmtTabs';
import AddRecipient from '../screens/dmt/RecipientTab/AddRecipient';
import SendMoneyForm from '../screens/dmt/SendMoneyTab/SendMoneyForm';
import ShowConveyanceFee from '../screens/dmt/SendMoneyTab/ShowConveyanceFee';
import HelpSupportStack from '../screens/help-support/HelpSupportStack';
import Home from '../screens/home/Home';
import MyTeams from '../screens/myTeams/MyTeams';
import Notification from '../screens/notification/Notification';
import ProceedToPay from '../screens/prepaid recharge/ProceedToPay';
import SearchContact from '../screens/prepaid recharge/SearchContact';
import ShowPlans from '../screens/prepaid recharge/ShowPlans';
import ChangePassword from '../screens/profile-screen/ChangePassword';
import Documents from '../screens/profile-screen/Documents/Documents';
import UpdateAdhar from '../screens/profile-screen/Documents/UpdateAdhar';
import UpdateGST from '../screens/profile-screen/Documents/UpdateGST';
import UpdatePan from '../screens/profile-screen/Documents/UpdatePan';
import UpdateProfilePic from '../screens/profile-screen/Documents/UpdateProfilePic';
import Profile from '../screens/profile-screen/Profile';
import ProfileMainScreen from '../screens/profile-screen/ProfileMainScreen';
import ListTransactions from '../screens/transactions/ListTransactions';
import ChangeWalletPin from '../screens/wallet/ChangeWalletPin';
import ConfirmRechargePage from '../screens/wallet/ConfirmRechargePage';
import EnterOtpForPinChange from '../screens/wallet/EnterOtpForPinChange';
import RechargeWallet from '../screens/wallet/RechargeWallet';
import SetNewWalletPin from '../screens/wallet/SetNewWalletPin';
import Wallet from '../screens/wallet/Wallet';
import { windowHeight, windowWidth } from '../utils/dimension';
import EnterPinToHome from './EnterPinToHome';
import PmfbyHome from '../screens/pmfby/PmfbyHome';
import AadharMain from '../screens/aadhar/AadharMain';
import Icard from '../screens/profile-screen/Icard';
import OtpScreen from '../screens/common/OtpScreen';
import DMTTxnStatus from '../screens/dmt/SendMoneyTab/DMTTxnStatus';


const Tab = createBottomTabNavigator();
const HomeScreen = () => {
    const { userData } = useContext(AuthContext);
    // const navigation = useNavigation<any>();
    // const router = useRoute();
    // console.log(router.params);
    let profileUri: any;

    if (!userData.kycDetail.passport_Photo) {
        profileUri = require('../../assets/images/user-profile2.png');
    }
    else {

        profileUri = { uri: `https://api.esebakendra.com/api/User/Download?fileName=${userData.kycDetail?.passport_Photo}` }
    }
    const CustomHeader = () => {
        const navigation = useNavigation<any>();


        // console.log('In CustomHeader URL ' + profileUri.uri);
        return <View style={{ backgroundColor: colors.primary400, height: 60, paddingHorizontal: 12, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

            <Pressable onPress={() => { navigation.navigate('profileStack') }} style={{ flex: 5, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Image source={profileUri} style={{ height: 50, width: 50, resizeMode: 'center', borderRadius: 8 }} />
                <View style={{ marginLeft: 8 }}>
                    <Text style={{ color: colors.white, fontSize: 14, fontWeight: 'bold' }}>{userData.personalDetail?.user_FName?.trim()}</Text>
                    <Text style={{ color: colors.white, fontSize: 14, }} selectable={true}>Mob: {userData.user.mobile_Number}</Text>
                </View>
            </Pressable>

            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                <Pressable onPress={() => { navigation.push('notification') }}>
                    <MaterialIcon name="notifications-none" size={35} color={colors.white} />
                </Pressable>
            </View>
        </View>
    }

    const TabBarIcon = ({ iconName, label }: any) => {
        // For Tab and mobile
        return <View style={{ alignItems: 'center', width: windowWidth > 768 ? (windowWidth / 8) : (windowWidth / 6) }} >
            <View style={{ width: windowWidth / 16, height: windowWidth / 16, borderRadius: 18, backgroundColor: colors.primary300, justifyContent: 'center', alignItems: 'center' }}>
                <MaterialIcon name={iconName} size={windowWidth / 20} color={colors.white} />
            </View>
            <Text style={{ fontSize: 12, color: colors.white }}>{label}</Text>
        </View>
    }
    return (
        <Tab.Navigator screenOptions={{
            headerShown: true,
            header: CustomHeader,
            tabBarStyle: { backgroundColor: colors.primary400, height: windowHeight / 14 },
            tabBarShowLabel: false,
            tabBarHideOnKeyboard: true // hide when keyboard appears 

        }}>
            <Tab.Screen name='Home' component={Home}
                options={{ tabBarIcon: ({ color, size, focused }) => <TabBarIcon color={color} focused={focused} size={size} iconName={'home'} label={'Home'} /> }} />
            <Tab.Screen name='My Team' component={MyTeams}
                options={{ headerShown: false, tabBarIcon: ({ color, size, focused }) => <TabBarIcon color={color} focused={focused} size={size} iconName={'people'} label={'My Team'} /> }} />
            <Tab.Screen name='Help' component={HelpSupportStack}
                options={{ headerShown: false, tabBarIcon: ({ color, size, focused }) => <TabBarIcon color={color} focused={focused} size={size} iconName={'help-outline'} label={'Help'} /> }} />
            <Tab.Screen name='History' component={ListTransactions}
                options={{ headerShown: false, tabBarIcon: ({ color, size, focused }) => <TabBarIcon color={color} focused={focused} size={size} iconName={'compare-arrows'} label={'History'} /> }} />
        </Tab.Navigator>
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

    </Stack.Navigator>)
}

const PrepaidRechargeStack = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: { backgroundColor: colors.primary500 },
            headerTintColor: colors.white
        }}>
            <Stack.Screen name='searchContact' component={SearchContact} options={{ title: 'Prepaid Recharge' }} />
            <Stack.Screen name='showPlan' component={ShowPlans} options={{ title: 'Choose Plans' }} />
            <Stack.Screen name='proceedToPay' component={ProceedToPay} options={{ title: 'Confirm Payment' }} />
        </Stack.Navigator>
    )
}

const DMTStack = () => {
    return (<Stack.Navigator>
        <Stack.Screen name='DMTTabMenus' component={DMTTabs} options={{ headerShown: false }} />
    </Stack.Navigator>)
}

const PMFBYStack = () => {
    return (<Stack.Navigator>
        <Stack.Screen name='pmfbyHome' component={PmfbyHome} options={{ headerShown: false }} />
    </Stack.Navigator>)
}


const WalletStack = () => {
    return (<Stack.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: colors.primary500 },
            headerTintColor: colors.white
        }}>

        <Stack.Screen
            name="walletMainScreen"
            component={Wallet}
            options={{
                title: 'My Wallet'
            }} />
        <Stack.Screen
            name="rechargeWallet"
            component={RechargeWallet}
            options={{
                title: 'Reacharge Wallet'
            }} />
        <Stack.Screen
            name="changeWalletPin"
            component={ChangeWalletPin}
            options={{
                title: 'Change Wallet PIN'
            }} />

        <Stack.Screen
            name="enterOTPForPinChange"
            component={EnterOtpForPinChange}
            options={{
                title: 'Enter OTP For PIN Change'
            }} />
        <Stack.Screen
            name="setNewWalletPin"
            component={SetNewWalletPin}
            options={{
                title: 'Set New Wallet PIN'
            }} />
        <Stack.Screen
            name="confirmWalletRechargePage"
            component={ConfirmRechargePage}
            options={{
                title: 'Confirm',
                headerShown: false
            }} />

    </Stack.Navigator>)
}

const profileStackHeaderOption = {
    headerShown: true,
    headerStyle: { backgroundColor: colors.primary400 },
    headerTintColor: colors.white
}
const ProfileStack = () => {

    return <Stack.Navigator>
        <Stack.Screen name='profileMainScreen' component={ProfileMainScreen} options={{ title: 'My Details', ...profileStackHeaderOption }} />
        <Stack.Screen name='profile' component={Profile} options={{ title: 'My Profile Details', ...profileStackHeaderOption }} />
        <Stack.Screen name='documents' component={Documents} options={{ title: 'My Documents', ...profileStackHeaderOption }} />
        <Stack.Screen name='updateAdhar' component={UpdateAdhar} options={{ title: 'Update Adhar', ...profileStackHeaderOption }} />
        <Stack.Screen name='updatePan' component={UpdatePan} options={{ title: 'Update PAN', ...profileStackHeaderOption }} />
        <Stack.Screen name='updateProfilePic' component={UpdateProfilePic} options={{ title: 'Update Profile Pic', ...profileStackHeaderOption }} />
        <Stack.Screen name='updateGst' component={UpdateGST} options={{ title: 'Update GSTN', ...profileStackHeaderOption }} />
        <Stack.Screen name='changePassword' component={ChangePassword} options={{ title: 'Change Login Password', ...profileStackHeaderOption }} />
        <Stack.Screen name='icard' component={Icard} options={{ title: 'My Identity Card', ...profileStackHeaderOption }} />

        <Stack.Screen name='aboutEPayMain' component={AboutEPayMain} options={{ title: 'About e-Pay', ...profileStackHeaderOption }} />
        <Stack.Screen name='policyDetails' component={PolicyDetails} options={{ title: 'e-Pay Policies', ...profileStackHeaderOption }} />

    </Stack.Navigator>
}

const TransferMoneyFromHomeScreenStack = () => {
    return <Stack.Navigator screenOptions={{
        headerShown: false
    }}>
        <Stack.Screen name='searchDMTRecipient' component={SearchDMTRecipient} />
        <Stack.Screen name='sendMoneyForm' component={SendMoneyForm} />
        <Stack.Screen name='showConveyanceFee' component={ShowConveyanceFee} />
        <Stack.Screen name='dmtSendMoneyPinScreen' component={OtpScreen} />
        <Stack.Screen name='dmtTxn' component={DMTTxnStatus} />
    </Stack.Navigator>
}



const AadharStack = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator>
            <Stack.Screen name='AadharHome' component={AadharMain} options={{ headerShown: false }}></Stack.Screen>
        </Stack.Navigator>
    )
}




const Stack = createNativeStackNavigator();
const AppStackTab = () => {
    return (
        <Stack.Navigator >
            <Stack.Screen name='EnterPinToHome' component={EnterPinToHome} options={{ headerShown: false }} />
            <Stack.Screen name='HomeScreen' component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name='bbpsStack' component={BBPSStack} options={{ headerShown: false }} />
            <Stack.Screen name='prepaidRechargeStack' component={PrepaidRechargeStack} options={{ headerShown: false }} />
            <Stack.Screen name='wallet' component={WalletStack} options={{ headerShown: false }} />
            <Stack.Screen name='profileStack' component={ProfileStack} options={{ headerShown: false }} />
            <Stack.Screen name='DMTStack' component={DMTStack} options={{ headerShown: false }} />
            <Stack.Screen name='AddDMTRecipientFromHomeScreen' component={AddRecipient} options={{ headerShown: false }} />
            <Stack.Screen name='transferMoneyFromHomeScreenStack' component={TransferMoneyFromHomeScreenStack} options={{ headerShown: false }} />
            <Stack.Screen name='notification' component={Notification} options={{ headerShown: true, title: 'Notifications', headerStyle: { backgroundColor: colors.primary500 }, headerTintColor: colors.white }} />
            <Stack.Screen name='PMFBYStack' component={PMFBYStack} options={{ headerShown: false }} />
            <Stack.Screen name='AadharStack' component={AadharStack} options={{ headerShown: false }} />

            {/* Common Screens */}
            <Stack.Screen name='otpScreen' component={NewOtpScreen} options={{ headerShown: false }} />
            <Stack.Screen name='prepaidTransSuccess' component={PrepaidTransactionStatus} options={{ headerShown: false }} />
            <Stack.Screen name='bbpsTxnStatus' component={BBPSTransactionStatus} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

export default AppStackTab

const styles = StyleSheet.create({})