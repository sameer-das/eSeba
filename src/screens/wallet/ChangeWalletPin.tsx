import { StyleSheet, Text, View, ScrollView, Pressable, KeyboardAvoidingView, Alert } from 'react-native'
import React, { useState, useContext, useRef, useEffect } from 'react'
import colors from '../../constants/colors'
import InputWithLabelAndError from '../../components/InputWithLabelAndError'
import { updateWalletPin } from '../../API/services'
import { AuthContext } from '../../context/AuthContext'
import Loading from '../../components/Loading'

const ChangeWalletPin = () => {
    const { userData } = useContext(AuthContext);
    const [password, setPassword] = useState<any>({
        currentPassword: { value: '', error: '', pattern: '', required: true },
        newPassword: { value: '', error: '', pattern: '', required: true },
        confirmPassword: { value: '', error: '', pattern: '', required: true },
    });


    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Loading...');

    const requiredErrorMessage: any = {
        currentPassword: 'Please enter PIN',
        newPassword: 'Please enter new PIN',
        confirmPassword: 'Please confirm PIN',
    }
    const patternErrorMessage: any = {
    }

    const handleInputChange = (text: string, keyName: string) => {
        let errorMessage = '';

        if (password[keyName].required && text.trim() === '') {
            errorMessage = requiredErrorMessage[keyName];
        } else if (password[keyName].pattern !== '' && !(password[keyName].pattern.test(text.trim())))
            errorMessage = patternErrorMessage[keyName];

        const obj = { ...password[keyName], value: text.trim(), error: errorMessage }
        setPassword({ ...password, [keyName]: obj });
    }

    const validatePasswordForm = () => {
        const keyNames = ['currentPassword', 'newPassword', 'confirmPassword'];
        //
        let bRet = true;
        try {
            keyNames.forEach(keyName => {
                let errorMessage = '';
                // console.log('checking ' + keyName)
                if (password[keyName].required && !password[keyName].value) {
                    // console.log(keyName + ' not filled');
                    errorMessage = requiredErrorMessage[keyName];
                } else if (password[keyName].pattern !== '' && !(password[keyName].pattern?.test(password[keyName].value.trim()))) {
                    // console.log(password[keyName].pattern);
                    errorMessage = patternErrorMessage[keyName];
                } else if (keyName === 'confirmPassword' && password['newPassword'].value !== password['confirmPassword'].value) {
                    errorMessage = 'PIN did not match';
                }
                const obj = { ...password[keyName], error: errorMessage };
                setPassword((currentFormValue: any) => {
                    return { ...currentFormValue, [keyName]: obj }
                });

                if (errorMessage !== '')
                    bRet = false;

            });
        } catch (e) {
            console.log(e)
        }

        return bRet;
    }

    const resetPasswordField = () => {
        const keyNames = ['currentPassword', 'newPassword', 'confirmPassword'];
        keyNames.forEach(keyName => {
            const obj = { ...password[keyName], error: '', value: '' };
            setPassword((currentFormValue: any) => {
                return { ...currentFormValue, [keyName]: obj }
            });
        })
    }

    const updatePinAPI = async () => {
        setLoadingMessage('Changing Wallet PIN');
        console.log(password.newPassword.value, password.confirmPassword.value)
        setIsLoading(true)
        try {
            const { data } = await updateWalletPin(userData.user.user_ID, password.newPassword.value, password.currentPassword.value);

            if (data.status === 'Success' && data.code === 200 && data.data) {
                Alert.alert('Success', 'Wallet PIN updated successfully.', [{
                    text: 'Ok',
                    onPress: resetPasswordField
                }])
            } else if (data.status === 'Success' && data.code === 200 && data.data === 'failed to update password') {
                Alert.alert('Fail', 'Failed to update your wallet PIN!')
            }

        } catch (e) {
            console.log('Error while updating wallet PIN');
            console.log(e);
            Alert.alert('Error', 'Error while updating wallet PIN. Try after sometime!')
        } finally {
            setLoadingMessage('Loading...');
            setIsLoading(false)
        }
    }

    const updatePinHandler = async () => {
        console.log(password)
        if (validatePasswordForm()) {
            console.log('All OK call for API ')
            await updatePinAPI()
        }
    }

    useEffect(() => {
        // ref1.current.focus();
    }, [])

    if (isLoading)
        return <Loading label={loadingMessage} />

    return (
        <ScrollView style={styles.rootContainer} keyboardDismissMode='on-drag'>
            <KeyboardAvoidingView>
                <View style={styles.passwordChangeCard}>
                    <Text style={styles.cardHeaderLable}>Change your wallet PIN</Text>
                    <InputWithLabelAndError
                        value={password.currentPassword.value}
                        errorMessage={password.currentPassword.error}
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry={true}
                        maxLength={4}
                        textAlign={'center'}
                        onChangeText={(text: string) => handleInputChange(text, 'currentPassword')}
                        inputLabel={'Enter Current Password'}
                        style={{ letterSpacing: 40 }}
                        keyboardType={'number-pad'}
                        autoFocus />
                    <InputWithLabelAndError
                        value={password.newPassword.value}
                        errorMessage={password.newPassword.error}
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry={true}
                        maxLength={4}
                        textAlign={'center'}
                        onChangeText={(text: string) => handleInputChange(text, 'newPassword')}
                        inputLabel={'Enter New Password'}
                        keyboardType={'number-pad'}
                        style={{ letterSpacing: 40 }} />
                    <InputWithLabelAndError
                        value={password.confirmPassword.value}
                        errorMessage={password.confirmPassword.error}
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry={true}
                        maxLength={4}
                        textAlign={'center'}
                        onChangeText={(text: string) => handleInputChange(text, 'confirmPassword')}
                        inputLabel={'Confirm Password'}
                        keyboardType={'number-pad'}
                        style={{ letterSpacing: 40 }} />

                    <Pressable style={styles.updateButton} onPress={updatePinHandler}>
                        <Text style={styles.updateButtonLabel}>Update Wallet PIN</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default ChangeWalletPin

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 8
    },
    passwordChangeCard: {
        borderColor: colors.primary300,
        borderWidth: 1,
        borderRadius: 8,
        padding: 8
    },
    cardHeaderLable: {
        fontSize: 24,
        color: colors.primary500,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20
    },
    updateButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: colors.primary500,
        borderRadius: 8,
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 16
    },
    updateButtonLabel: {
        color: colors.white,
        fontSize: 24,
        textAlign: 'center'
    },
})