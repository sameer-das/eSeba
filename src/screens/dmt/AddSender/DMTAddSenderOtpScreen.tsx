import { StyleSheet, Text, View, ScrollView, Pressable, Alert, KeyboardAvoidingView, BackHandler } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import colors from '../../../constants/colors'
import InputWithLabelAndError from '../../../components/InputWithLabelAndError'
import { useNavigation, useRoute } from '@react-navigation/native'
import { AuthContext } from '../../../context/AuthContext'
import { resendOtpForVerifySender, verifySender } from '../../../API/services'
import Loading from '../../../components/Loading'

const DMTAddSenderOtpScreen = () => {
    const { userData } = useContext(AuthContext);
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation<any>();
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
    
    const regexp = new RegExp('^[0-9]+$');
    const route = useRoute<any>();
    
    const [timer, setTimer] = useState(20);
    const [isResendOtpDisabled, setIsResendOtpDisabled] = useState<boolean>(true);

    
    

    const otpSubmitHandler = async () => {
        try {
            // setIsLoading(true);
            console.log('Otp found ', otp);
            const verifySenderPayload = {
                "requestType": "VerifySender",
                "senderMobileNumber": userData.user.mobile_Number,
                "txnType": route.params.txnType,
                "otp": String(otp),
                "bankId": "FINO",
                "aadharNumber": route.params.aadharNumber,
                "bioPid": route.params.bioPid,
                "bioType": "FIR",
                "additionalRegData": String(route.params.additionalRegData)
            }
            console.log(verifySenderPayload)
            setIsLoading(true);
            // writeToFile("VerifySender Payload ----" + JSON.stringify(verifySenderPayload));
            const { data } = await verifySender(verifySenderPayload);
            // writeToFile("VerifySender Response ----" + JSON.stringify(data));
            console.log(data);
            setIsLoading(false);
            if (data.status === 'Success' && data.code === 200) {
                if (data.resultDt.responseReason === 'Successful' && data.resultDt.senderMobileNumber) {
                    Alert.alert('Success', 'Sender Verification Successful.');
                    navigation.pop(1);
                } else {
                    Alert.alert('Fail', 'Failed while verifying sender. Please try after sometime.')
                }
            } else {
                Alert.alert('Fail', 'Failed while verifying sender. Please try after sometime.')
            }
        } catch (e) {
            console.log('Error while verifying sender');
            console.log(e);
            setIsLoading(false);
            Alert.alert('Error', 'Error while verifying sender. Please try after sometime.')
        }

    }

    const handleBackButton = () => {
        console.log('Back button press')
        navigation.pop(1); // goes to the main screen
        return true; // do not default go back if true
    }

    useEffect(() => {

        console.log(route.params);
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton)
        }

    }, [])

    useEffect(() => {
        let interval: number;
        if (isResendOtpDisabled && timer > 0) {
            interval = setInterval(() => {
              setTimer((prev) => prev - 1);
            }, 1000);
          } else if (timer === 0) {
            setIsResendOtpDisabled(false);
            if(interval) clearInterval(interval);
          }
          return () => clearInterval(interval);
    }, [isResendOtpDisabled, timer]);


    const handleResendOtp = () => {
        resendOtpForSenderRegistration()
        // setIsResendOtpDisabled(true);
        // setTimer(20); // Reset timer after click
      };


      const resendOtpForSenderRegistration = async () => {

        const payload = {
          "requestType": "ResendSenderOtp",
           "senderMobileNumber": userData.user.mobile_Number,
           "txnType": route.params.txnType,
           "bankId": "FINO"
        }
        
        try {
            setIsLoading(true);
            const {data} = await resendOtpForVerifySender(payload);
            if(data.code === 200 && data.status === 'Success') {
                Alert.alert('Success', 'Otp is sent to your registered mobile number.');
                
            } else {
                Alert.alert('Fail', 'Failed while sending Otp.')
            }
        } catch(e) {
            Alert.alert('Error', 'Error while sending Otp.')
            console.log(e)
        } finally {
            setIsLoading(false);
            setIsResendOtpDisabled(true);
            setTimer(20);
        }
        
          
      }

    if(isLoading)
    return <Loading label='Verifying Sender...'/>

    return (
        <ScrollView contentContainerStyle={styles.rootContainer}>
            <KeyboardAvoidingView>


                <Text style={styles.pageTitle}>Enter OTP</Text>
                <Text style={styles.pageSubtitle}>Enter OTP that is sent to your registered mobile number</Text>

                <InputWithLabelAndError
                    value={otp}
                    errorMessage={''}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    maxLength={4}
                    textAlign={'center'}
                    onChangeText={(text: string) => {
                        setOtp(text);
                        if (!regexp.test(text) || !text || text.length !== 4) {
                            setIsSubmitDisabled(true);
                        } else {
                            setIsSubmitDisabled(false);
                        }

                    }}
                    inputLabel={' '}
                    style={{ letterSpacing: 40 }}
                    keyboardType={'numeric'}
                    autoFocus />

                <Pressable style={[styles.submitCta, { backgroundColor: isSubmitDisabled ? colors.primary100 : colors.primary500 }]} onPress={otpSubmitHandler} disabled={isSubmitDisabled}>
                    <Text style={styles.submitCtaLabel}>Submit</Text>
                </Pressable>


                <Pressable style={[styles.resendOtpBtn, { backgroundColor: isResendOtpDisabled ? colors.primary100 : colors.primary500 }]} onPress={handleResendOtp} disabled={isResendOtpDisabled }>
                    <Text style={styles.submitCtaLabel}>Resend Otp {isResendOtpDisabled && <Text>({timer} Sec)</Text>}</Text>
                </Pressable>

            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default DMTAddSenderOtpScreen

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 8,
        justifyContent: 'center'
    },
    pageTitle: {
        color: colors.primary500,
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    pageSubtitle: {
        color: colors.primary500,
        fontSize: 16,
        textAlign: 'center',
        marginTop: 8
    },
    submitCta: {
        paddingVertical: 14,
        // backgroundColor: colors.primary500,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8
    },
    resendOtpBtn: {
        paddingVertical: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 12

    }, 
    submitCtaLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center',
        textTransform: 'uppercase'
    }
})