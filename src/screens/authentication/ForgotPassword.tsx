import { StyleSheet, Text, View, Alert } from 'react-native'
import React, { useState } from 'react'
import colors from '../../constants/colors'
import AnimatedInput from '../../components/AnimatedInput'
import ButtonPrimary from '../../components/ButtonPrimary'
import Loading from '../../components/Loading'
import { sendForgotPasswordMail } from '../../API/services'
import { useNavigation } from '@react-navigation/native'

const ForgotPassword = () => {
    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const naigation = useNavigation<any>();

    const handleEmailChange = (text: string) => {
        if (!text) {
            setEmailError('Please enter registered email address!')
        } else if (!new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/).test(text)) {
            setEmailError('Please enter a valid email address!')
        } else {
            setEmailError('');
        }

        setEmail(text);
    }

    const sendEmail = async () => {
        setIsLoading(true)
        try {
            const { data } = await sendForgotPasswordMail(email);
            if (data.status === 'Success' && data.code === 200) {
                Alert.alert('Success',
                    'Your password has been reset. The updated password has been sent to your registered email and phone number.',
                );
                setEmailError('');
                setEmail('');
            } else if (data.status === 'Fail' && data.code === 500 && data.data === 'There is no row at position 0.') {
                Alert.alert(
                    'Not Found',
                    'Provided email is not registered with us! Please enter your registered email id!',
                );
            } else {
                Alert.alert(
                    'Fail',
                    'Something went wrong, Please try after sometime/Contact Support!',
                );
            }
        } catch (err) {
            Alert.alert(
                'Error',
                'Error while resetting password. Please try after sometime/Contact Support!',
            );
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading)
        return <Loading label={'Please wait...'} />
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.primary500, textAlign: 'center' }}>Forgot Password?</Text>

            <View>
                <AnimatedInput
                    value={email}
                    errorMessage={emailError}
                    onChangeText={handleEmailChange}
                    inputLabel={'Enter Registered Email'} />
            </View>

            <View style={{ marginVertical: 16 }}>
                <Text style={{ color: colors.primary500, fontStyle: 'italic', fontSize: 14 }}>Password recovery details will be sent to your registered email id.</Text>
            </View>

            <View style={{ marginTop: 12, gap: 16 }}>
                <ButtonPrimary label='Submit' disabled={(email && !emailError) ? false : true}
                    onPress={sendEmail}
                />
                {/* <ButtonPrimary label='Go Back'
                    onPress={() => {
                        naigation.goBack();
                    }}
                /> */}
            </View>
        </View>
    )
}

export default ForgotPassword

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 8
    }
})