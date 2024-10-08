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

    const [amountToBePaid, setAmountToBePaid] = useState(0)

    const [isBillFetchRequired, setIsBillFetchRequired] = useState(true);

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

                // console.log(data?.resultDt?.resultDt.billerName);
                if (data?.resultDt?.resultDt?.billerFetchRequiremet === 'NOT_SUPPORTED') {
                    const findIndex = _billerInfo.findIndex((curr: any) => curr.paramName === 'Amount')
                    // if Amount field is not there then push else dont
                    if (findIndex === -1) {
                        _billerInfo.push({ "dataType": "NUMERIC", "isOptional": false, "paramName": "Amount" })
                    }
                    setIsBillFetchRequired(false);
                }

                // console.log(data?.resultDt?.resultDt?.billerFetchRequiremet);
                AsyncStorage.setItem('currentBillerName', data?.resultDt?.resultDt.billerName)

                // _billerInfo.push({ "dataType": "ALPHANUMERIC", "isOptional": false, "paramName": "Consumer Name" })
                // console.log('-------------------------')
                // console.log(_billerInfo)
                if (_billerInfo.length > 0) {
                    const obj: any = {};

                    if ((route.params as any)?.inputParam) {
                        _billerInfo.forEach((c: any) => {
                        //    console.log((route.params as any)?.inputParam)
                            const found = (route.params as any)?.inputParam.find((curr: any) => {
                                return curr.paramName.replace(new RegExp('/', 'g'), '') == c.paramName.replace(new RegExp('/', 'g'), '')
                            })
                            // console.log('Found -->> ', JSON.stringify(found) )
                            return obj[c.paramName] = found ? found['paramValue'] : '' ;
                        });
                    } else {
                        _billerInfo.forEach((c: any) => {                           
                            return obj[c.paramName] = '';
                        });
                    }
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
        // console.log('fetching bill')
        setLoadingLabel('Fetching Bill');
        // console.log(bbpsFetchBillBody)
        setIsLoading(true)
        try {
            const { data } = await bbpsFetchBill(bbpsFetchBillBody);
            if (data.status === 'Success' && data.code === 200) {
                // console.log(data?.resultDt.requestID);
                // console.log(data?.resultDt.data);

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
        // console.log(serviceDetails)
        setLoadingLabel('Making Payment. Dont press back  or close the application!');
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
                // if amount is more than 50000 send customer pan
                "customerPan": +amountToBePaid >= 5000000 ? `${userData.kycDetail.pancard_Number} | ${userData.personalDetail.user_FName} ${userData.personalDetail.user_LName}` : "",
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
                "amount": +amountToBePaid,
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

        // If bill fetch is not required go for direct pay 
        // dont add billerresponse addtionalinfo
        if (!isBillFetchRequired) {
            delete payBillPayload.billerResponse;
            delete payBillPayload.additionalInfo;
            payBillPayload.paymentMethod.quickPay = 'Y'
        }

        try {
            const { data } = await bbpsPayBill(requestID, payBillPayload, serviceDetails.services_cat_id, serviceDetails.services_id, userData.user.user_EmailID)
            console.log("=====================reached to navigate")
            console.log(JSON.stringify(data));

            await AsyncStorage.removeItem('bbpsTxnStatus');
            await AsyncStorage.setItem('bbpsTxnStatus', JSON.stringify({
                resp: data.resultDt
            }));
            setLoadingLabel('Loading...');
            setIsLoading(false);

            navigation.navigate('bbpsTxnStatus', {
                txnStatus: data.resultDt
            });

        } catch (e) {
            console.log(e);
            Alert.alert('Error', 'Failed to make payment, Please try later!');

        } finally {
            setLoadingLabel('Loading...');
            setIsLoading(false);
            navigation.setParams({ ...route.params, pin: '' });
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
                const amount = amountToBePaid / 100;
                setLoadingLabel('Checking Wallet');
                const isWalletOk = await validateWalletBalance(amount, userData.user.user_EmailID);
                if (isWalletOk) {
                    console.log('wallet ok');
                    await payBill();
                }
                setIsLoading(false);
                setLoadingLabel('Loading...')
            } else {
                Alert.alert('Invalid Pin', 'You have entered a wrong PIN!');
                navigation.setParams({ ...route.params, pin: '' });
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


    // Runs on PIN input
    useEffect(() => {
        const pin = (route.params as any)?.pin;
        if ((route.params as any)?.pin) {
            console.log('otp Found in bbps fetch bill' + pin);
            if (pin !== '')
                onPinInput(pin);

            navigation.setParams({ pin: '' }) // Reset PIN 
        }
    }, [(route.params as any)?.pin])



    if (isLoading) {
        return <Loading label={loadingLabel} />
    }

    const handleInputChange = (name: string, value: string) => {
        // console.log(name)
        setBillerInfo({ ...billerInfo, [name]: value })
    }

    const getDynamicFields = () => {

        if (Object.keys(billerInfo).length === 0)
            return null

        console.log('Inside getDynamicFields')
        console.log(billerInfo)
        console.log((route.params as any).inputParam)

        return Object.keys(billerInfo).map((curr) => {
            return (<View key={curr} style={styles.inputContainer}>
                <Text style={styles.inputLabel} >Plase Enter {curr}</Text>
                <TextInput key={curr} style={styles.inputText} placeholder={curr}
                    value={billerInfo[curr]} onChangeText={(val) => handleInputChange(curr, val)} />
            </View>)
        })
    }

    const billPayWithoutBillFetch = () => {
        console.log('proceed')
        let proceed: boolean = true;
        Object.keys(billerInfo).forEach(curr => {
            const bi = rawBillerInfo.find((binfo: any) => {
                return binfo.paramName === curr;
            })

            if (!bi.isOptional && billerInfo[curr] === '') {
                Alert.alert('Invalid Input', `Please provide value for ${curr}`);
                proceed = false;
            }
        });

        if (!proceed)
            return;
        const input = [];

        for (let k in billerInfo) {
            if (k === 'Amount') {
                if ((route.params as any).blr_id != 'SUND00000NAT02') {
                    // dont add amount for sunTV
                    continue;
                }
            }
            input.push({
                "paramName": k,
                "paramValue": billerInfo[k]
            });
        }

        // setAmountToBePaid(+billerInfo['Amount'])

        // keep it for future use 
        setInputParams(input);

        proceedToPay(String(+billerInfo['Amount'] * 100));
    }


    const confirmButtonHandler = () => {
        console.log('Confirm Pressed');
        // console.log(billerInfo);
        let proceed: boolean = true;
        Object.keys(billerInfo).forEach(curr => {
            const bi = rawBillerInfo.find((binfo: any) => {
                return binfo.paramName === curr;
            })

            if (!bi.isOptional && billerInfo[curr] === '') {
                Alert.alert('Invalid Input', `Please provide value for ${curr}`);
                proceed = false;
            }
        });

        if (!proceed)
            return;

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

    const proceedToPay = (amount: string) => {
        console.log('Amount received ' + amount);
        setAmountToBePaid(+amount);

        navigation.navigate('otpScreen', {
            fromRouteName: 'FetchBill',
            purpose: `Bill payment of Rs ${+amount / 100} to ${(route.params as any).blr_name}`
        });
    }

    if (showBillDetails)
        return <BillDetails billerResponse={billerResponse} inputParams={inputParams} additionalInfo={additionalInfo} proceedToPay={proceedToPay} />

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

            {isBillFetchRequired ? <Pressable style={[styles.confirm_cta, buttonDisabled ? styles.cta_disable : null]}
                disabled={buttonDisabled}
                onPress={confirmButtonHandler}>
                <Text style={styles.confirm_cta_text}>Confirm</Text>
            </Pressable> : <Pressable onPress={billPayWithoutBillFetch} style={[styles.confirm_cta, buttonDisabled ? styles.cta_disable : null]}>
                <Text style={styles.confirm_cta_text}>Proceed</Text>
            </Pressable>}

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