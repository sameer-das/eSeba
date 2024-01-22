import { StyleSheet, Text, View, Pressable, Alert } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import ContactAndOperatorDetailCard from '../../components/ContactAndOperatorDetailCard'
import colors from '../../constants/colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loading from '../../components/Loading'
import { useNavigation, useRoute } from '@react-navigation/native'
import { AuthContext } from '../../context/AuthContext'
import { operatorList } from '../../constants/mobile-operator-billerid-mapping'
import { validateWalletBalance, validateWalletPin } from '../../utils/walletUtil'
import { prepaidRecharge } from '../../API/services'


const ProceedToPay = () => {
    const { userData } = useContext(AuthContext);
    const [item, setItem] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const [loadingLabel, setLoadingLabel] = useState('Loading...');
    const [mobileDetails, setMobileDetails] = useState<any>({})
        ;
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    const readAsynchStorage = async () => {
        setIsLoading(true);
        const rechargePlan = await AsyncStorage.getItem('rechargePlan') || '{}';
        setItem(JSON.parse(rechargePlan));
        setIsLoading(false);

        const details = await AsyncStorage.getItem('rechargeContactDetail') || '{}';
        setMobileDetails(JSON.parse(details));
    }

    const goForRecharge = async () => {
        let bRet = false;
        setLoadingLabel('Contacting operator for recharge!');

        try {
            console.log(mobileDetails);
            const operatorId = operatorList.find(x => x.provider.toLowerCase().trim() === mobileDetails?.currentOperator?.toLowerCase().trim())

            const rechargePayload = {
                "apiToken": "",
                "mn": mobileDetails.mobileNo + '',
                "op": operatorId?.op + '',
                "amt": item.amount + '',
                "reqid": `${new Date().getTime()}`,
                "field1": "",
                "field2": "",
                "serviceId": 1,
                "categoryId": 1,
                "userId": userData.user.user_EmailID
            };

            console.log(rechargePayload);

            /**
             * {
    "status": "Success",
    "code": 200,
    "data": "{\"reqid\":\"e4293054-4de2-49be-8cfd-f967dda3cd1a\",\"status\":\"SUCCESS\",\"remark\":\"Recharge Success.\",\"balance\":\"872.2240\",\"mn\":\"8480899980\",\"field1\":\"6458768744\",\"ec\":\"1000\",\"apirefid\":\"22897998185396\",\"amt\":\"49\"}"
}
             */


            let message = '';
            const rechargeResponse = await prepaidRecharge(rechargePayload);
            JSON.stringify(rechargeResponse)
            if (rechargeResponse.data.data.includes('status')) {
                const data = JSON.parse(rechargeResponse.data.data);
                message = data.remark;
            } else {
                message = rechargeResponse.data.data;
            }
            navigation.navigate('prepaidTransSuccess', { message });

            bRet = true;
        } catch (e) {
            console.log(e)
            bRet = false;
            Alert.alert('Error', 'Error while making recharge! Please try after sometime.');
            navigation.setParams({ ...route.params, pin: '' });
        } finally {
            navigation.setParams({ ...route.params, pin: '' });
        }

        return bRet;

    }


    const onPinInput = async (pin: string) => {
        console.log('got pin ' + pin);
        setLoadingLabel('Validating Pin')
        setIsLoading(true);
        try {
            // check for pin
            const isPinOk = await validateWalletPin(userData.user.user_ID, pin);
            if (isPinOk) {
                console.log('pin OK')
                // correct pin
                // check for wallet
                setLoadingLabel('Checking Wallet');
                const isWalletOk = await validateWalletBalance(+item.amount, userData.user.user_EmailID);
                if (isWalletOk) {
                    console.log('wallet ok');
                    const rechargeResp = await goForRecharge();
                }
            } else {
                // incorrect pin
                Alert.alert('Invalid Pin', 'You have entered a wrong PIN!');
                navigation.setParams({ ...route.params, pin: '' });
            }

            // call pay API 
        } catch (e) {
            console.log(e)
            Alert.alert('Error', 'Something went wrong. Please try after sometime.');
        } finally {
            setIsLoading(false);
            setLoadingLabel('Loading...');
        }

    }

    const payHandler = () => {
        navigation.navigate('otpScreen', {
            fromRouteName: 'proceedToPay',
            purpose: `Prepaid recharge of Rs. ${item.amount}`
        });
    }

    useEffect(() => {
        const pin = (route.params as any)?.pin;
        if ((route.params as any)?.pin) {
            console.log('otp found in prepaid ' + pin);
            if (pin !== '') {
                onPinInput(pin);
            }
            navigation.setParams({pin: ''}) // Reset PIN 
        }
    }, [(route.params as any)?.pin])

    useEffect(() => {
        readAsynchStorage()
    }, [])

    if (isLoading)
        return <Loading label={loadingLabel} />

    return (
        <View style={styles.rootContainer}>
            <View>
                <ContactAndOperatorDetailCard />

                <Text style={styles.planLable}>Below is the selected plan</Text>

                <View style={styles.planCard}>
                    <Text style={styles.planName}>{item.planName}</Text>
                    <View style={styles.planContainer}>
                        <Text style={styles.planAmount}>{item.amount}</Text>
                        <Text style={styles.validity}> Validy : {item.validity}</Text>
                    </View>
                    <View>
                        <Text style={styles.details} numberOfLines={5}>{item.description}</Text>
                    </View>
                </View>
            </View>
            <Pressable style={styles.confirm_cta} onPress={payHandler}>
                <Text style={styles.confirm_cta_text}>Proceed to pay</Text>
            </Pressable>
        </View>
    )
}

export default ProceedToPay

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        padding: 8,
        justifyContent: 'space-between',
        paddingBottom: 0
    },
    planLable: {
        fontSize: 20,
        color: colors.primary500,
        fontWeight: 'bold',
        marginVertical: 12,
        textAlign: 'center'
    },
    planCard: {
        marginVertical: 6,
        // shadowColor: '#ccc',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.5,
        // shadowRadius: 4,
        // elevation: 2,
        borderColor: colors.primary500,
        borderWidth: 1,
        borderRadius: 4,
        // borderLeftColor: colors.primary500,
        borderLeftWidth: 12,
        paddingLeft: 16,
        paddingVertical: 8,
        paddingRight: 8,

    },
    planName: {
        fontSize: 18,
        color: colors.primary500,
        fontWeight: 'bold',
    },
    planAmount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.primary500,
        paddingRight: 18,
        borderRightColor: colors.primary300,
        borderRightWidth: 2
    },
    planContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8
    },
    validity: {
        fontSize: 14,
        paddingLeft: 18,
        color: colors.primary400
    },
    details: {
        fontSize: 14,
        alignSelf: 'stretch',
        color: colors.primary500,
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

})