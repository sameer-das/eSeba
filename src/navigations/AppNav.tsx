import { NavigationContainer } from '@react-navigation/native'
import React, { useContext } from 'react'
import { StyleSheet, View, Image, Text } from 'react-native'
import Loading from '../components/Loading'
import { AuthContext, IAuthContext } from '../context/AuthContext'
import AuthStack from './AuthStack'
import AppStackTab from './AppStackTab'
import colors from '../constants/colors'

const AppNav = () => {
    const { isLoading, userData } = useContext<IAuthContext>(AuthContext);


    const Splash = () => {
       return <View style={{ flex: 1, backgroundColor: colors.white, alignItems:'center', justifyContent:'center', gap: 4 }}>
            <Image source={require('../../assets/logos/mob.png')} style={{ height: 80, width: 80 }} />
            <Text style={{color:colors.primary500, fontSize: 48, fontWeight:'bold' }}>e-Pay</Text>
        </View>
    }

    if (isLoading) {
        // return <Loading label="Let's hope it's worth the wait!" />
        return <Splash />
    }

    return (
        <NavigationContainer>
            <View style={styles.container}>
                {userData ? <AppStackTab /> : <AuthStack />}
            </View>
        </NavigationContainer>
    )
}

export default AppNav

const styles = StyleSheet.create({
    container: { flex: 1 }

})