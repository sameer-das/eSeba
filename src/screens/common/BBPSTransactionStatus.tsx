import { StyleSheet, Text, View, BackHandler, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../constants/colors';
import { windowHeight } from '../../utils/dimension';

const BBPSTransactionStatus = () => {
    const [txnStatus, setTxnStatus] = useState<any>({});
    const navigation = useNavigation<any>();

    const readAsynchStorage = async () => {
        //  
        const _bbpsTxnStatus = await AsyncStorage.getItem('bbpsTxnStatus') || '{}';
        setTxnStatus(JSON.parse(_bbpsTxnStatus).resp);
        // console.log('------ in BBPS TXN Status Page -------')
        // console.log(JSON.parse(_bbpsTxnStatus).resp)
    }
    const handleBackButton = () => {
        navigation.popToTop(); // goes to the main screen
        return true; // do not default go back if true
    }
    // console.log(txnStatus)

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        readAsynchStorage();

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton)
        }
    }, [])

    return (
        <View style={[styles.rootContainer, { backgroundColor: txnStatus.responseCode == 0 ? colors.success500 : colors.secondary200 }]}>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Image style={{ width: 70, height: 70 }} source={require('../../../assets/logos/BeAssured.png')} />
            </View>

            <View style={{ marginTop: windowHeight / 4, width: '100%', alignItems: 'center', justifyContent: 'center' }}>

                <Text style={styles.header}>You Bill Payment Status</Text>
                <Text style={styles.text}>Transaction {txnStatus?.responseReason}</Text>
                {txnStatus?.respAmount && <Text style={styles.amount}>₹ {txnStatus?.respAmount}</Text>}
                {txnStatus?.respCustomerName && <Text style={styles.details}>Name:  {txnStatus?.respCustomerName}</Text>}
                {txnStatus?.txnRefId && <Text style={styles.details}>Ref Id:  {txnStatus?.txnRefId}</Text>}
            </View>
        </View>
    )
}

export default BBPSTransactionStatus

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        // padding:8
    },
    text: {
        marginTop: 30,
        fontSize: 22,
        color: colors.primary500,
        textAlign: 'center'
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center'
    }, amount: {
        marginVertical: 20,
        fontSize: 28,
        color: colors.white,
        fontWeight: 'bold',
    },
    details: {
        fontSize: 16,
        color: colors.white,
    }
})