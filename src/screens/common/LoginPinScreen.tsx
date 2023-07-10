import { StyleSheet, Text, View, ScrollView, Pressable, Alert } from 'react-native'
import React, { useState, useContext } from 'react'
import colors from '../../constants/colors'
import InputWithLabelAndError from '../../components/InputWithLabelAndError'
import { validateTPin } from '../../API/services'
import { AuthContext } from '../../context/AuthContext'
import { useNavigation } from '@react-navigation/native'


const LoginPinScreen = () => {
    const [pin, setPin] = useState<string>('');
    const [loading, setIsLoading] = useState<boolean>(false);
    const { userData } = useContext(AuthContext);
    const navigation = useNavigation<any>();

    const pinSubmitHandler = async () => {
        const regexp = new RegExp('^[0-9]+$');
        if (!regexp.test(pin)) {
            Alert.alert('Invalid Format', 'Pin should be 4 digits!');
            return;
        }
        try {
            setIsLoading(true);
            const { data } = await validateTPin(userData.user.user_ID, pin);
            if (data.status === 'Success' && data.code === 200 && data.data) {
                // navigate to set new pin 
                setPin('');
                setIsLoading(false);
                navigation.replace('Home');
            } else if (data.status === 'Success' && data.code === 200 && !data.data) {
                Alert.alert('Invalid PIN', 'You have entered wrong PIN.');
                setPin('');
            } else {
                Alert.alert('Fail', 'Unknown error occured, please contact support!');
                setPin('');
            }

        } catch (e) {
            console.log('error while validating pin in LoginPinScreen')
            console.log(e);
            Alert.alert('Error', 'Error while validating PIN! Please try after sometime.');
            setPin('');
        }
    }
    return (
        <View style={styles.rootContainer}>
            <Text style={styles.pageTitle}>Enter your PIN to continue</Text>
            <InputWithLabelAndError
                value={pin}
                errorMessage={''}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={true}
                maxLength={4}
                textAlign={'center'}
                onChangeText={(text: string) => {
                    setPin(text);
                    if (text.length === 4)
                        pinSubmitHandler()
                }}
                inputLabel={' '}
                style={{ letterSpacing: 40 }}
                keyboardType={'numeric'}
                autoFocus />

            {/* <Pressable style={styles.submitCta} onPress={pinSubmitHandler}>
                <Text style={styles.submitCtaLabel}>Submit</Text>
            </Pressable> */}
        </View>
    )
}

export default LoginPinScreen

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: colors.white,
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
        backgroundColor: colors.primary500,
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