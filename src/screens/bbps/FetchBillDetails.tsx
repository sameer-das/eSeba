import { Alert, Image, Pressable, StyleSheet, Text, TextInput, Touchable, View } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import colors from '../../../src/constants/colors'
import { useNavigation, useRoute } from '@react-navigation/native';
import { bbpsFetchBill, getBillerInfo, bbpsPayBill } from '../../API/services';
import Loading from '../../components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BillDetails from './BillDetails';
import { AuthContext } from '../../context/AuthContext';
import { validateWalletBalance, validateWalletPin } from '../../utils/walletUtil';

const FetchBillDetails = () => {
    const { userData } = useContext(AuthContext);


    const [buttonDisabled, setButtonDisabled] = useState(true);

    const [billerInfo, setBillerInfo] = useState<any>({});
    const [rawBillerInfo, setRawBillerInfo] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const [loadingLabel, setLoadingLabel] = useState<string>('Loading...');
    const [showBillDetails, setShowBillDetails] = useState(false);


    // for bbps bill fetch and bill pay
    const [inputParams, setInputParams] = useState<any[]>([]);
    const [requestID, setRequestID] = useState<string>('');
    const [billerResponse, setBillerResponse] = useState<any | null>(null);
    const [additionalInfo, setAdditionalInfo] = useState<any | null>(null);

    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    // console.log('in fetch bill details' + (route.params as any).blr_id);

    // 102S03778407
    const fetchBillerInfo = async (biller_id: string) => {
        setIsLoading(true);
        try {
            const { data } = await getBillerInfo(biller_id);
            // console.log(data)
            if (data.status === 'Success' && data.code === 200 && data?.resultDt?.resultDt?.billerId.length > 0) {
                const _billerInfo = data?.resultDt?.resultDt?.billerInputParams.paramInfo;

                console.log(data?.resultDt?.resultDt.billerName);
                AsyncStorage.setItem('currentBillerName', data?.resultDt?.resultDt.billerName)

                // _billerInfo.push({ "dataType": "ALPHANUMERIC", "isOptional": false, "paramName": "Consumer Name" })
                console.log(_billerInfo)
                if (_billerInfo.length > 0) {
                    const obj: any = {};
                    _billerInfo.forEach((c: any) => {
                        return obj[c.paramName] = '';
                    });
                    setBillerInfo(obj);
                    setButtonDisabled(false);
                    setRawBillerInfo(_billerInfo);
                }

            } else {
                Alert.alert('Error', 'Something wrong while fetching biller details!', [
                    {
                        text: 'Ok', onPress: () => {
                            navigation.goBack();
                        }
                    }
                ])
            }

        } catch (e) {
            console.log(e)
            Alert.alert('Error', 'Error while fetching biller details!', [
                {
                    text: 'Ok', onPress: () => {
                        navigation.goBack();
                    }
                }
            ])
        } finally {
            setIsLoading(false);
        }

    }

    const fetchBill = async (bbpsFetchBillBody: any) => {
        console.log('fetching bill')
        setLoadingLabel('Fetching Bill');
        setIsLoading(true)
        try {
            const { data } = await bbpsFetchBill(bbpsFetchBillBody);
            if (data.status === 'Success' && data.code === 200) {
                console.log(data?.resultDt.requestID);
                console.log(data?.resultDt.data);

                setRequestID(data?.resultDt.requestID);
                setBillerResponse(data?.resultDt.data?.billerResponse);
                setAdditionalInfo(data?.resultDt.data?.additionalInfo);

                if (!data?.resultDt.data?.billerResponse) {
                    Alert.alert('No Pending Amount', 'You dont have any outstanding amount to pay!')
                } else {
                    // navigation.push('BillDetails', data?.resultDt.data?.billerResponse);
                    setShowBillDetails(true);
                }
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoadingLabel('Loading...');
            setIsLoading(false)
        }
    }

    const payBill = async () => {
        const sd = await AsyncStorage.getItem('currentServiceDetails') as string;
        const serviceDetails = JSON.parse(sd);
        setLoadingLabel('Making Payment. Dont press back or close application!');
        setIsLoading(true);

        const payBillPayload = {
            "agentId": "CC01BA48AGTU00000001",
            "billerAdhoc": true,
            "agentDeviceInfo": {
                "ip": "192.168.2.73",
                "initChannel": "AGT",
                "mac": "01-23-45-67-89-ab"
            },
            "customerInfo": {
                "customerMobile": "9777117452",
                "customerEmail": "info.gskindiaorg@gmail.com",
                "customerAdhaar": "",
                "customerPan": ""
            },
            "billerId": (route.params as any).blr_id,
            "inputParams": {
                "input": [
                    ...inputParams
                ]
            },
            "billerResponse": billerResponse,
            "additionalInfo": additionalInfo,
            "amountInfo": {
                "amount": billerResponse.billAmount,
                "currency": 356,
                "custConvFee": 0,
                "amountTags": [

                ]
            },
            "paymentMethod": {
                "paymentMode": 'Wallet',
                "quickPay": "N",
                "splitPay": "N"
            },
            "paymentInfo": {
                "info": [
                    {
                        "infoName": "WalletName",
                        "infoValue": "Paytm"
                    }, {
                        "infoName": "MobileNo",
                        "infoValue": userData.user.mobile_Number
                    }
                ]
            }
        }


        try {
            // const {data} = await bbpsPayBill(requestID,payBillPayload,serviceDetails.service_cat_id,serviceDetails.service_id,userData.user.user_EmailID)
            // await AsyncStorage.removeItem('bbpsTxnStatus');
            // await AsyncStorage.setItem('bbpsTxnStatus', JSON.stringify({
            //     resp: data,
            //     rawBillerInfo,
            //     billerResponse
            // }));
            setLoadingLabel('Loading...');
            setIsLoading(false);

            setTimeout(() => {
                console.log(JSON.stringify(payBillPayload));
                setLoadingLabel('Loading...');
                setIsLoading(false);
                navigation.navigate('bbpsTxnStatus');
            }, 3000)

        } catch (e) {
            console.log(e);
            Alert.alert('Error', 'Failed to make payment, Please try later!');
        } finally {
            setLoadingLabel('Loading...');
            setIsLoading(false);
        }

    }


    const onPinInput = async (pin: string) => {
        console.log('got pin ' + pin);
        try {
            setLoadingLabel('Validating Pin');
            setIsLoading(true);
            const isPinOk = await validateWalletPin(userData.user.user_ID, pin);
            if (isPinOk) {
                console.log('BillDetails pin ok');
                // check for wallet balance
                const amount = billerResponse.billAmount / 100;
                setLoadingLabel('Checking Wallet');
                const isWalletOk = await validateWalletBalance(amount, userData.user.user_EmailID);
                if (!isWalletOk) { //TODO remove !
                    console.log('wallet ok');
                    await payBill();
                }
                setIsLoading(false);
                setLoadingLabel('Loading...')
            } else {
                Alert.alert('Invalid Pin', 'You have entered a wrong PIN!');
            }
        } catch (e) {

        } finally {
            setIsLoading(false);
            setLoadingLabel('Loading...')
        }


    }




    useEffect(() => {
        const biller_id = (route.params as any).blr_id;
        if (biller_id)
            fetchBillerInfo(biller_id);
        else {
            Alert.alert('Error', 'Biller Id not found!', [
                {
                    text: 'Ok', onPress: () => {
                        navigation.goBack();
                    }
                }
            ])
        }
    }, [])

    useEffect(() => {
        const pin = (route.params as any)?.pin;
        if ((route.params as any)?.pin) {
            console.log('otp Found in bbps fetch bill' + pin);
            onPinInput(pin);
        }
    }, [(route.params as any)?.pin])



    if (isLoading) {
        return <Loading label={loadingLabel} />
    }

    const handleInputChange = (name: string, value: string) => {
        setBillerInfo({ ...billerInfo, [name]: value })
    }

    const getDynamicFields = () => {
        if (Object.keys(billerInfo).length === 0)
            return null

        return Object.keys(billerInfo).map((curr) => {
            return (<View key={curr} style={styles.inputContainer}>
                <Text style={styles.inputLabel} >Plase Enter {curr}</Text>
                <TextInput key={curr} style={styles.inputText} placeholder={curr}
                    value={billerInfo[curr]} onChangeText={(val) => handleInputChange(curr, val)} />
            </View>)
        })
    }


    const confirmButtonHandler = () => {
        console.log('Confirm Pressed');
        console.log(billerInfo);
        Object.keys(billerInfo).forEach(curr => {
            const bi = rawBillerInfo.find((binfo: any) => {
                return binfo.paramName === curr;
            })

            if (!bi.isOptional && billerInfo[curr] === '') {
                Alert.alert('Invalid Input', `Please provide value for ${curr}`);
                return;
            }
        });

        // Validation Pass
        const input = [];

        for (let k in billerInfo) {
            input.push({
                "paramName": k,
                "paramValue": billerInfo[k]
            });
        }
        // keep it for future use 
        setInputParams(input);

        const fetchBillPayload = {
            "agentId": "CC01BA48AGTU00000001",
            "agentDeviceInfo": {
                "ip": "192.168.2.73",
                "initChannel": "AGT",
                "mac": "01-23-45-67-89-ab"
            },
            "customerInfo": {
                "customerMobile": "9777117452",
                "customerEmail": "info.gskindiaorg@gmail.com",
                "customerAdhaar": "",
                "customerPan": ""
            },
            "billerId": (route.params as any).blr_id,
            "inputParams": {
                "input": [...input]
            }
        }

        fetchBill(fetchBillPayload);


    }

    const proceedToPay = () => {
        navigation.navigate('otpScreen', {
            fromRouteName: 'FetchBill',
            purpose: `Bill payment of Rs ${billerResponse.billAmount / 100} to ${(route.params as any).blr_name}`
        });
    }

    if (showBillDetails)
        return <BillDetails billerResponse={billerResponse} proceedToPay={proceedToPay} />

    return (
        <View style={styles.rootContainer}>
            <View >
                <View style={[styles.card, styles.card_center_vertical]}>
                    {getDynamicFields()}
                </View>

                <View style={[styles.card, styles.information_card]}>
                    <Image source={require('../../../assets/logos/BharatBillPay.png')} />
                    <Text style={styles.information_text} numberOfLines={4}>Paying this bill allows GlobalPe to fetch your current and future bills so that you can view and pay them.</Text>
                </View>
            </View>

            <Pressable style={[styles.confirm_cta, buttonDisabled ? styles.cta_disable : null]}
                disabled={buttonDisabled}
                onPress={confirmButtonHandler}>
                <Text style={styles.confirm_cta_text}>Confirm</Text>
            </Pressable>

        </View >
    )
}

export default FetchBillDetails

const styles = StyleSheet.create({
    rootContainer: { flex: 1, justifyContent: 'space-between' },
    card: {
        minHeight: 100,
        margin: 8,
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 8
    },
    card_center_vertical: {
        justifyContent: 'center'
    },
    information_card: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer: { marginBottom: 20 },
    inputText: {
        borderWidth: 2,
        borderColor: colors.primary100,
        paddingHorizontal: 8,
        paddingVertical: 8,
        fontSize: 16,
        color: colors.primary500,
        borderRadius: 8,
    },
    inputLabel: {
        color: colors.primary500,
        marginBottom: 4,
        fontSize: 16
    },
    information_text: {
        flex: 1,
        color: colors.primary500,
        fontSize: 16
    },
    confirm_cta: {
        padding: 20,
        backgroundColor: colors.primary500,
        justifyContent: 'center',
        alignItems: 'center'
    },
    confirm_cta_text: {
        fontSize: 18,
        textTransform: 'uppercase',
        color: colors.white
    },
    cta_disable: {
        backgroundColor: colors.primary100,
    }
})