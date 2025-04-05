import { StyleSheet, Text, View, Alert } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../../context/AuthContext';
import colors from '../../../constants/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import ButtonPrimary from '../../../components/ButtonPrimary';
import { validateWalletBalance, validateWalletPin } from '../../../utils/walletUtil';
import { dmtFundTransfer, dmtFundTransferVerifyOtp } from '../../../API/services';
import {fail, success} from './dmt_txn_result_sample_data';
import Loading from '../../../components/Loading';
const ShowConveyanceFee = () => {

    const [senderDetail, setSenderDetail] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { userData } = useContext(AuthContext);
    const route = useRoute<any>();
    const navigation = useNavigation<any>();

    const readAsyncStorage = async () => {
        const data = await AsyncStorage.getItem('dmtSenderDetail') || '{}';
        setSenderDetail(JSON.parse(data));
    }

    const onProceed = () => {
        // -------------- this is for testing
        // const data = JSON.parse(fail);
        // navigation.push('dmtTxn', { ...data.resultDt });


        // -------------- this is for testing
        // navigation.push('dmtSendMoneyPinScreen', {
        //     fromRouteName: 'showConveyanceFee',
        //     header: 'Please enter OTP!',
        //     code: 'OTP_FOR_TXN',
        //     purpose: `Sending Rs. ${route.params.amount} via DMT to ${route.params.recipientName}`
        // })
        
        // -------------- this is for Live
        navigation.setParams({ ...route.params, pin: '' });
        navigation.push('dmtSendMoneyPinScreen', {
            fromRouteName: 'showConveyanceFee',
            header: 'Please enter your secure pin!',
            code: 'PIN_FOR_WALLET',
            purpose: `Sending Rs. ${route.params.amount} via DMT to ${route.params.recipientName}`
        })

    }


    const fundTransfer = async () => {
        const sendMoneyPayload = {
            "requestType": "TXNSENDOTP",
            "agentId": "",
            "initChannel": "AGT",
            "senderMobileNo": String(userData.user.mobile_Number),
            "recipientId": route.params.recipientId,
            "txnAmount": String(route.params.amount * 100),
            "convFee": String(route.params.custConvFee),
            "txnType": route.params.transType,
            "bankId": "FINO"
        }
        console.log(sendMoneyPayload)


        setIsLoading(true);
        try {
            const { data } = await dmtFundTransfer(sendMoneyPayload)
            console.log(data);
            setIsLoading(false);
            if (data.code === 200 && data.status === 'Successful' && data.resultDt && data.resultDt?.responseCode === '000') {
                // Show OTP screen
                navigation.setParams({ ...route.params, pin: '' });
                navigation.push('dmtSendMoneyPinScreen', {
                    fromRouteName: 'showConveyanceFee',
                    header: 'Please enter OTP!',
                    code: 'OTP_FOR_TXN',
                    purpose: `Sending Rs. ${route.params.amount} via DMT to ${route.params.recipientName}`
                })

            } else {
                Alert.alert('Fail', 'Failed while transfering amount. Please try after sometime.')
            }
        } catch (e) {
            setIsLoading(false);
            console.log('error while dmt transfer');
            console.log(e);
            Alert.alert('Error', 'Error while transfering amount. Please try after sometime.')
        }
    }


    const validatePinAndWalletBalance = async (userPin: string) => {
        setIsLoading(true);
        const checkPinResponse = await validateWalletPin(userData.user.user_ID, userPin);
        console.log(checkPinResponse)
        if (checkPinResponse) {
            try{
                const checkWalletBalance = await validateWalletBalance(route.params.amount, userData.user.user_EmailID);
                console.log(checkWalletBalance);                
                if (checkWalletBalance) {
                    console.log('ok let trnsfer');
                    fundTransfer()
                }
            } catch(e) {

            } finally {
                setIsLoading(false);
            }
           
        } else {
            setIsLoading(false);
            Alert.alert('Invalid Pin', 'You have entered invalid wallet PIN.')
        }
    }


    const submitOTpForTransaction = async (otp: string) => {

        const verifyOtpPayload = {
            "requestType": "TXNVERIFYOTP",
            "agentId": "",
            "initChannel": "AGT",
            "senderMobileNo": String(userData.user.mobile_Number),
            "recipientId": route.params.recipientId,
            "txnAmount": String(route.params.amount * 100),
            "convFee": String(route.params.custConvFee),
            "txnType": route.params.transType,
            "bankId": "FINO",
            "otp": otp
        }
        const _data = await AsyncStorage.getItem('currentServiceDetails') || '{}';
        const serviceId = JSON.parse(_data)?.services_id;
        const serviceCatId = JSON.parse(_data)?.services_cat_id;
        console.log(serviceCatId, serviceId);

        setIsLoading(true)
        if (!serviceId || !serviceCatId) {
            Alert.alert('Wrong', 'Service id or Service category id not found');
            setIsLoading(false)
            return;
        }

        try {
            console.log(verifyOtpPayload);
            const { data } = await dmtFundTransferVerifyOtp(verifyOtpPayload, serviceId, serviceCatId, userData.user.user_EmailID)
            console.log(JSON.stringify(data))
            // Show Transaction Status Screen 
            navigation.push('dmtTxn', { ...data.resultDt });

        } catch (e) {
            Alert.alert('Error', 'Error while sending money!');
        } finally {
            setIsLoading(false)
        }
    }


    // Handle OTP After Its Input from OTP Screen
    useEffect(() => {
        const pin = (route.params as any)?.pin;
        if ((route.params as any)?.pin) {
            if ((route.params as any)?.code === 'PIN_FOR_WALLET') {
                console.log('Otp Found in DMT show conv screen for Wallet check ' + pin); // Reset PIN 
                if (pin !== '')
                    validatePinAndWalletBalance(pin)

                navigation.setParams({ pin: '' })
            } else if ((route.params as any)?.code === 'OTP_FOR_TXN') {
                console.log('Otp Found in DMT show conv screen for OTP for TXN ' + pin); // Reset PIN 
                if (pin !== '')
                    submitOTpForTransaction(pin);
                // navigation.popToTop();

                navigation.setParams({ pin: '' })
            }
        }
    }, [(route.params as any)?.pin])

    useEffect(() => {
        readAsyncStorage();

    }, [])


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            console.log('Show Conveyance focus');
            navigation.setParams({ ...route.params, pin: '' });
        });
        return unsubscribe;
    }, [])

    
    if(isLoading)
        return <Loading label="Processing payment, Don't press back"/>

    return (
        <View style={styles.rootContainer}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.primary500, marginVertical: 20 }}>Transaction Details</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, color: colors.primary500, fontWeight: 'bold' }}>Sending From</Text>
                <Text style={{ fontSize: 16, color: colors.primary500, fontWeight: 'bold' }}>{senderDetail.senderName}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, color: colors.primary500 }}>Sender Mobile</Text>
                <Text style={{ fontSize: 16, color: colors.primary500 }}>{userData.user.mobile_Number}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                <Text style={{ fontSize: 16, color: colors.primary500, fontWeight: 'bold' }}>Recipient Name</Text>
                <Text style={{ fontSize: 16, color: colors.primary500, fontWeight: 'bold' }}>{route.params.recipientName}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, color: colors.primary500 }}>Recipient AC No.</Text>
                <Text style={{ fontSize: 16, color: colors.primary500 }}>{route.params.acNo}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, color: colors.primary500 }}>Recipient Bank</Text>
                <Text style={{ fontSize: 16, color: colors.primary500 }}>{route.params.bankName}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, color: colors.primary500 }}>Recipient ID</Text>
                <Text style={{ fontSize: 16, color: colors.primary500 }}>{route.params.recipientId}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, color: colors.primary500 }}>Transaction Type</Text>
                <Text style={{ fontSize: 16, color: colors.primary500 }}>{route.params.transType}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                <Text style={{ fontSize: 18, color: colors.primary500, fontWeight: 'bold' }}>Amount</Text>
                <Text style={{ fontSize: 18, color: colors.primary500, fontWeight: 'bold' }}>{route.params.amount}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, color: colors.primary500 }}>Conveyance Fee</Text>
                <Text style={{ fontSize: 16, color: colors.primary500 }}>{(+route.params.custConvFee / 100)}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, paddingTop: 10, borderTopColor: colors.primary100, borderTopWidth: 0.5 }}>
                <Text style={{ fontSize: 18, color: colors.primary500, fontWeight: 'bold' }}>Total</Text>
                <Text style={{ fontSize: 20, color: colors.primary500, fontWeight: 'bold' }}>{+route.params.amount + (+route.params.custConvFee / 100)}</Text>
            </View>


            <View style={{ marginTop: 40 }}>
                <ButtonPrimary label='Proceed To Pay' onPress={onProceed} />
            </View>

        </View>
    )
}

export default ShowConveyanceFee

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        padding: 8,
        backgroundColor: colors.white
    }
})