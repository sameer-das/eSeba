import { StyleSheet, Text, View, BackHandler, Image } from 'react-native'
import React, { useEffect } from 'react'
import colors from '../../constants/colors'
import { useNavigation, useRoute } from '@react-navigation/native'
import { windowHeight } from '../../utils/dimension'

const PrepaidTransactionStatus = () => {
    const route = useRoute();
    const navigation = useNavigation<any>();

    const handleBackButton = () => {
        // console.log('back button pressed'); 
        navigation.popToTop(); // goes to the main screen
        return true; // do not default go back if true
    }
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton)
        }
    }, []);



    return (
        <View style={styles.rootContainer}>
            <View style={{flexDirection:'row', justifyContent:'flex-end', width:'100%'}}>
                <Image style={{width: 70, height: 70}} source={require('../../../assets/logos/BeAssured.png')} />
            </View>
            <View style={{marginTop: windowHeight / 4}}>
                <Text style={styles.headerLabel}>Your Recharge Status</Text>
                <Text style={styles.message}>{(route.params as any).message}</Text>
            </View>
        </View>
    )
}

export default PrepaidTransactionStatus

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: colors.success500,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    headerLabel: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center'
    },
    render: {
        marginTop: 20
    }, message: {
        fontSize: 24, color: colors.white, textAlign: 'center', marginTop: 20
    }
})