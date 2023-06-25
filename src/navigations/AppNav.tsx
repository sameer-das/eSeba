import { NavigationContainer } from '@react-navigation/native'
import React, { useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import Loading from '../components/Loading'
import { AuthContext, IAuthContext } from '../context/AuthContext'
import AppStack from './AppStack'
import AuthStack from './AuthStack'
import OtpScreen from '../screens/common/OtpScreen'

const AppNav = () => {
    const { isLoading, token, userData } = useContext<IAuthContext>(AuthContext);

    
    if (isLoading) {
       return <Loading label="Let's hope it's worth the wait!" />
    }

    return (
        <NavigationContainer>
            <View style={styles.container}>
                {userData ? <AppStack /> : <AuthStack />}
            </View>
        </NavigationContainer>
    )
}

export default AppNav

const styles = StyleSheet.create({
    container: { flex: 1 }

})