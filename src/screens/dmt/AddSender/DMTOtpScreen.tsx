import { StyleSheet, Text, View, ScrollView, Pressable, Alert, KeyboardAvoidingView } from 'react-native'
import React, { useContext, useState } from 'react'
import colors from '../../../constants/colors'
import InputWithLabelAndError from '../../../components/InputWithLabelAndError'
import { useNavigation, useRoute } from '@react-navigation/native'
import { AuthContext } from '../../../context/AuthContext'
import { verifySender } from '../../../API/services'
import Loading from '../../../components/Loading'

const DMTOtpScreen = () => {
    const { userData } = useContext(AuthContext);
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation<any>();
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

    const regexp = new RegExp('^[0-9]+$');
    const route = useRoute<any>();
    console.log(route.params);

    const otpSubmitHandler = async () => {


        try {
            // setIsLoading(true);
            console.log('Otp found ', otp);
            const verifySenderPayload = {
                "requestType": "VerifySender",
                "senderMobileNumber": userData.user.mobile_Number,
                "txnType": route.params.txnType,
                "otp": String(otp),
                "additionalRegData": String(route.params.additionalRegData)
            }

            setIsLoading(true);
            const { data } = await verifySender(verifySenderPayload);
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
                    maxLength={6}
                    textAlign={'center'}
                    onChangeText={(text: string) => {
                        setOtp(text);
                        if (!regexp.test(text) || !text || text.length !== 6) {
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
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default DMTOtpScreen

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
    submitCtaLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center',
        textTransform: 'uppercase'
    }
})