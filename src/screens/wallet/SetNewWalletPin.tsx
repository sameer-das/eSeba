import { useHeaderHeight } from '@react-navigation/elements'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useContext, useState } from 'react'
import { Alert, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { updateWalletPin } from '../../API/services'
import InputWithLabelAndError from '../../components/InputWithLabelAndError'
import Loading from '../../components/Loading'
import colors from '../../constants/colors'
import { AuthContext } from '../../context/AuthContext'

const SetNewWalletPin = () => {
    const { userData } = useContext(AuthContext);
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [pinError, setPinError] = useState('');
    const [pinConfirmError, setConfirmPinError] = useState('');
    const headerHeight = useHeaderHeight();

    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation<any>();
    const route = useRoute<any>()
    const regexp = new RegExp('^[0-9]+$');

    const confirmPinHandler = async () => {
        try {
            console.log(pin, route.params.pin)
            setIsLoading(true);
            const { data } = await updateWalletPin(userData.user.user_ID, pin, route.params?.pin);
            console.log(data)
            if (data.status === "Success" && data.code === 200 && data.data) {
                setIsLoading(false);
                Alert.alert('Success', 'Wallet PIN is set successfully',
                    [{
                        text: 'Ok', onPress: () => {
                            setPin('');
                            setConfirmPin('');
                            navigation.popToTop();
                        }
                    }])
            } else {
                setIsLoading(false);
                Alert.alert('Fail', 'Failed while updating wallet PIN.')
            }
        } catch (e) {
            setIsLoading(false);
            console.log('error while updating wallet PIN');
            console.log(e);
            Alert.alert('Error', 'Error while updating wallet PIN. Please try after sometime!')
        }
    }

    if (isLoading)
        return <Loading label={'Changing Wallet PIN'} />

    return (
        <ScrollView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={[styles.rootContainer]}>
                <View>
                    <Text style={styles.pageTitle}>Set New Wallet Pin</Text>
                    <InputWithLabelAndError
                        value={pin}
                        errorMessage={pinError}
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry={true}
                        maxLength={4}
                        textAlign={'center'}
                        onChangeText={(text: string) => {
                            setPin(text);
                            if (text === '') {
                                setPinError('Please enter 4 digit PIN')
                            } else if (!regexp.test(text)) {
                                setPinError('Only digits are allowed in PIN')
                            } else {
                                setPinError('');
                            }
                        }}
                        inputLabel={'Please enter 4 digit PIN'}
                        style={{ letterSpacing: 40 }}
                        keyboardType={'number-pad'}
                        autoFocus />
                    <InputWithLabelAndError
                        value={confirmPin}
                        errorMessage={pinConfirmError}
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry={true}
                        maxLength={4}
                        textAlign={'center'}
                        onChangeText={(text: string) => {
                            setConfirmPin(text);
                            if (text === '') {
                                setConfirmPinError('Please enter 4 digit PIN')
                            }
                            else if (!regexp.test(text)) {
                                setConfirmPinError('Only digits are allowed in PIN')
                            } else {
                                setConfirmPinError('');
                            }
                        }}
                        inputLabel={'Please confirm PIN'}
                        style={{ letterSpacing: 40 }}
                        keyboardType={'number-pad'}
                    />
                </View>


                <Pressable style={styles.confirmCta} onPress={confirmPinHandler}>
                    <Text style={styles.confirmCtaLabel}>confirm</Text>
                </Pressable>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default SetNewWalletPin

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        padding: 8,
        backgroundColor: colors.white,

        justifyContent: 'space-between'
    },
    pageTitle: {
        color: colors.primary500,
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    confirmCta: {
        paddingVertical: 14,
        backgroundColor: colors.primary500,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    confirmCtaLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center',
        textTransform: 'uppercase'
    }
})