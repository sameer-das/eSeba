
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../screens/authentication/SignIn';
import CheckRefNo from '../screens/authentication/CheckRefNo';
import SignUpFirst from '../screens/authentication/SignUpFirst';
import SignUpSecond from '../screens/authentication/SignUpSecond';
import ForgotPassword from '../screens/authentication/ForgotPassword';
import PolicyDetails from '../screens/About ePay/PolicyDetails';
const Stack = createNativeStackNavigator();
const AuthStack = () => {

    const SignUpStack = () => {
        return (<Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='CheckRefNo'>
            <Stack.Screen name="CheckRefNo" component={CheckRefNo} />
            <Stack.Screen name="SignUpFirst" component={SignUpFirst} />
            <Stack.Screen name="SignUpSecond" component={SignUpSecond} />
            <Stack.Screen name="termsAndConditions" component={PolicyDetails} />
        </Stack.Navigator>)
    }
    
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUpStack" component={SignUpStack} />
            <Stack.Screen name="forgotPassword" component={ForgotPassword} />
        </Stack.Navigator>)
}

export default AuthStack