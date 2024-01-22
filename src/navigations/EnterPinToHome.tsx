import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { generateOtpForWalletPinChange } from '../API/services';
import ButtonPrimary from '../components/ButtonPrimary';
import Loading from '../components/Loading';
import colors from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import { validateWalletPin } from '../utils/walletUtil';
import TouchID from 'react-native-touch-id';


const EnterPinToHome = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingLabel, setLoadingLabel] = useState<string>('Loading...');
    const { userData, logout } = useContext(AuthContext);
    const [isTouchIDAuthSuccess, setIsTouchIDAuthSuccess] = useState(false);

    const onPinInput = async (pin: string) => {
        console.log('got pin ' + pin);
        try {
            setLoadingLabel('Validating Pin');
            setIsLoading(true);
            const isPinOk = await validateWalletPin(userData.user.user_ID, pin);
            if (isPinOk) {
                console.log('pin ok');
                // check for wallet balance
                setIsLoading(false);
                setLoadingLabel('Loading...');
                navigation.replace('HomeScreen');
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

    const onForgotPinClick = () => {
        // navigation.navigate('wallet', { screen: 'enterOTPForPinChange' });
        // return;
        Alert.alert('Forgot Wallet PIN',
            'An OTP will be sent to your registered mobile number and will be used to validate. Press OK to continue.',
            [
                {
                    text: 'Ok',
                    onPress: async () => {
                        setIsLoading(true);
                        try {
                            //sendOtp 
                            const { data } = await generateOtpForWalletPinChange(userData.user.user_ID);
                            if (data.status === 'Success' && data.code === 200 && data.data === "OTP send to the user") {
                                // navigate to otp screen
                                setIsLoading(false);
                                navigation.navigate('wallet', { screen: 'enterOTPForPinChange' });
                            } else {
                                setIsLoading(false);
                                Alert.alert('Failed', 'OTP generation failed!, Please contact support!')
                            }
                        } catch (e) {
                            setIsLoading(false);
                            console.log('Error while sending otp to user');
                            console.log(e);
                            Alert.alert('Error', 'OTP generation error!, Please try after sometime.')
                        }
                    }
                },
                {
                    text: 'Cancel',
                    onPress: () => { }
                },
            ])
    }

    useEffect(() => {
        const pin = (route.params as any)?.pin;
        if ((route.params as any)?.pin) {
            console.log('otp Found in Enter Pin' + pin);
            if (pin !== '') {
                // console.log('pin is ' + route.params.pin)
                onPinInput(pin)
                navigation.setParams({pin: ''}) // Reset PIN 
            }
        }
    }, [(route.params as any)?.pin])

    const optionalConfigObject = {
        title: 'Authentication Required', // Android
        imageColor: colors.primary500, // Android
        imageErrorColor: '#ff0000', // Android
        sensorDescription: 'Touch sensor', // Android
        sensorErrorDescription: 'Failed', // Android
        cancelText: 'Cancel', // Android
        fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
        unifiedErrors: false, // use unified error messages (default false)
        passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
    };

    useEffect(() => {
        TouchID.isSupported().then((s: any) => {
            console.log('touch id supported : ' + s)
            if (s) {
                showPopupForTouchId();
            }

        }).catch(err => {
            // console.log(err)
            console.log('2 ' + err.details)
        })


    }, [])

    useEffect(() => {
        let t: any;
        if (isTouchIDAuthSuccess) {
            t = setTimeout(() => {
                navigation.replace('HomeScreen');
            }, 500)
        }

        return () => {
            if (t)
                clearTimeout(t)
        }

    }, [isTouchIDAuthSuccess]);

    const showPopupForTouchId = () => {
        TouchID.authenticate('', optionalConfigObject).then((succ: any) => {
            console.log(succ)
            if (succ === true) {
                setIsTouchIDAuthSuccess(true);
            }
        }).catch((e: any) => {
            console.log('1 ' + e.details)
            if (e.details === 'Not supported') {
                Alert.alert('Not supported', 'Touch ID in this device is not supported.')
            }
        })
    }

    const onLogout = () => {
        Alert.alert('Are you sure to logout?', undefined, [{
            text: 'Sure',
            onPress: () => { logout() }
        }, {
            text: 'No',
            onPress: () => { }
        }])
    }


    if (isLoading)
        return <Loading label={loadingLabel} />


    const buttons = <View style={{ width: '80%' }}>
        <ButtonPrimary label='Authenticate by Wallet PIN' onPress={() => {
            navigation.navigate('otpScreen', {
                fromRouteName: 'EnterPinToHome',
                purpose: `Enter to Login`
            });
        }} />
        <View style={{ marginTop: 18 }}>
            <ButtonPrimary label='Authenticate by Biometric' onPress={() => { showPopupForTouchId() }} />
        </View>
        <View style={{ marginTop: 36, flexDirection: 'row', gap: 18 }}>
            <View style={{ flex: 1 }}>

                <ButtonPrimary label='Forgot PIN?' onPress={onForgotPinClick} />
            </View>
            <View style={{ flex: 1 }}>
                <ButtonPrimary label='Logout' onPress={() => onLogout()} />
            </View>
        </View>
    </View>;


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 60 }}>
            <View>

                <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.primary500, textAlign: 'center' }}>Welcome {userData.personalDetail.user_FName}</Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.primary500, textAlign: 'center' }}>Please enter your PIN.</Text>
            </View>
            {isTouchIDAuthSuccess ? <Text style={{ fontSize: 20, color: colors.success500 }}>Authentication Success</Text> : buttons}
        </View>
    )
}

export default EnterPinToHome

const styles = StyleSheet.create({})