import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../screens/authentication/SignIn';
import SignUp from '../screens/authentication/SignUp';
import CheckRefNo from '../screens/authentication/CheckRefNo';
const Stack = createNativeStackNavigator();
const AuthStack = () => {
    const SignUpStack = () => {
        return (<Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='CheckRefNo'>
            <Stack.Screen name="CheckRefNo" component={CheckRefNo} />
            <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>)
    }
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUpStack" component={SignUpStack} />
        </Stack.Navigator>
    )
}

export default AuthStack