import { StyleSheet, Text, View, BackHandler } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native';
import colors from '../../constants/colors';

const BBPSTransactionStatus = () => {
    const [txnStatus, setTxnStatus] = useState<any>({});
    const navigation = useNavigation<any>();

    const readAsynchStorage = async () => {
        const _bbpsTxnStatus = await AsyncStorage.getItem('bbpsTxnStatus') || '{}';
        setTxnStatus(JSON.parse(_bbpsTxnStatus));
    }
    const handleBackButton = () => {
        // console.log('back button pressed'); 
        navigation.popToTop(); // goes to the main screen
        return true; // do not default go back if true
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        readAsynchStorage();
        
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton)
        }
    }, [])



    return (
        <View style={[styles.rootContainer]}>
            <Text style={styles.text}>BBPS Transaction Status</Text>
        </View>
    )
}

export default BBPSTransactionStatus

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1, justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 20,
        color:colors.primary500,
        textAlign:'center'
    }
})