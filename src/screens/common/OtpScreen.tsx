import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import colors from '../../constants/colors';
import { useNavigation, useRoute } from '@react-navigation/native';

const OtpScreen = () => {

    const [pin1, setPin1] = useState('');
    const [pin2, setPin2] = useState('');
    const [pin3, setPin3] = useState('');
    const [pin4, setPin4] = useState('');

    const ref1 = useRef<any>();
    const ref2 = useRef<any>();
    const ref3 = useRef<any>();
    const ref4 = useRef<any>();

    const route = useRoute();
    const navigation = useNavigation<any>();


    const onCodeFill = () => {
        // console.log('code fill called')
        if (pin1 && pin2 && pin3 && pin4) {
            const pin = pin1 + pin2 + pin3 + pin4;
            // (route.params as any).onPinInput(pin);
            // navigation.goBack();
            navigation.navigate({
                name: (route.params as any).fromRouteName,
                params: {pin: pin},
                merge: true
            })
        }
    }

    useEffect(() => {
        onCodeFill();
    }, [pin4]) // trigger only when last input is changed

    return (
        <View style={styles.rootContainer}>
            <Text style={styles.otpLable}>Please enter your secure pin!</Text>

            {(route.params as any).purpose && <View style={styles.purpose}>
                <Text style={styles.purposeText}>{(route.params as any).purpose}</Text>
            </View>}

            <View style={styles.inputContainer}>
                <TextInput style={styles.textInput}
                    maxLength={1}
                    keyboardType='number-pad'
                    secureTextEntry={true}
                    value={pin1}
                    ref={ref1}
                    autoFocus
                    onChangeText={(text) => {
                        setPin1(text);
                        if (text.length >= 1) {
                            ref2.current.focus();
                        }
                    }} />

                <TextInput style={styles.textInput}
                    maxLength={1}
                    keyboardType='number-pad'
                    secureTextEntry={true}
                    value={pin2}
                    ref={ref2}

                    onChangeText={(text) => {
                        setPin2(text);
                        if (text.length >= 1) {
                            ref3.current.focus();
                        }
                    }}
                    onKeyPress={({ nativeEvent }) => {

                        if (nativeEvent.key === 'Backspace') {
                            ref1.current.focus()
                        }
                    }} />

                <TextInput style={styles.textInput}
                    maxLength={1}
                    keyboardType='number-pad'
                    secureTextEntry={true}
                    value={pin3}
                    ref={ref3}

                    onChangeText={(text) => {
                        setPin3(text);
                        if (text.length >= 1) {
                            ref4.current.focus();
                        }
                    }}
                    onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === 'Backspace') {
                            ref2.current.focus()
                        }
                    }} />

                <TextInput style={styles.textInput}
                    maxLength={1}
                    keyboardType='number-pad'
                    secureTextEntry={true}
                    value={pin4}
                    ref={ref4}
                    onChangeText={(text) => {
                        setPin4(text);
                    }}

                    onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === 'Backspace') {
                            ref3.current.focus();
                        }
                    }} />

            </View>

        </View>
    )
}

export default OtpScreen

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: colors.primary300,
        // justifyContent: 'center',
        alignItems: 'center',
        padding: 8
    },
    otpLable: {
        color: colors.white,
        fontSize: 26,
        marginTop: 20,
        fontWeight: 'bold'
    },
    underlineStyleBase: {
        borderRadius: 4,
        borderColor: colors.primary100,
        borderWidth: 2,
        fontSize: 40,
        color: colors.white,
        padding: 8,
        width: 60,
        height: 60,
        textAlign: 'center'
    },

    inputContainer: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 50,
        padding: 30,
        backgroundColor: colors.primary400
    },
    textInput: {
        borderRadius: 4,
        borderColor: colors.primary100,
        borderWidth: 2,
        fontSize: 40,
        color: colors.white,
        padding: 8,
        width: 60,
        height: 60,
        textAlign: 'center'
    },
    purpose: {
        width: '90%',
        backgroundColor: colors.primary400,
        borderRadius: 8,
        padding: 8,
        marginTop: 36
    },
    purposeText: {
        color: colors.white,
        fontSize: 16,
        textAlign: 'center'
    }
})