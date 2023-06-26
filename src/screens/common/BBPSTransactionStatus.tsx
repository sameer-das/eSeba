import { StyleSheet, Text, View, BackHandler, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native';
import colors from '../../constants/colors';
import { windowHeight } from '../../utils/dimension';

const BBPSTransactionStatus = () => {
    const [txnStatus, setTxnStatus] = useState<any>({});
    const navigation = useNavigation<any>();


    const readAsynchStorage = async () => {
        //  await AsyncStorage.getItem('bbpsTxnStatus') ||
        const _bbpsTxnStatus = '{"responseCode":0,"responseReason":"Successful","txnRefId":"CC013177BAAA34796545","approvalRefNumber":"3875769870170882","txnRespType":"FORWARD TYPE RESPONSE","inputParams":{"input":[{"paramName":"Consumer Id","paramValue":"102S03778407"}]},"custConvFee":0,"respAmount":72600,"respBillDate":"2023-06-18T00:00:00","respBillNumber":"202306182306102S03778407","respBillPeriod":"1","respCustomerName":"SAMEER KU DAS.","respDueDate":"2023-06-26T00:00:00"}';
        setTxnStatus(JSON.parse(_bbpsTxnStatus));
    }
    const handleBackButton = () => {
        // console.log('back button pressed'); 
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
                {txnStatus?.respAmount && <Text style={styles.amount}>₹ {txnStatus?.respAmount / 100}</Text>}
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