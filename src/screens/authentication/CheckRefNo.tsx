import { StyleSheet, Text, View, TextInput, Pressable, Alert, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import colors from '../../constants/colors'
import { useNavigation } from '@react-navigation/native';
import Loading from '../../components/Loading';
import { checkRefId } from '../../API/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedInput from '../../components/AnimatedInput';
import ButtonPrimary from '../../components/ButtonPrimary';
import { windowWidth } from '../../utils/dimension';


const CheckRefNo = () => {
    const [refNo, setRefNo] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [errorLabel, setErrorLable] = useState('');

    const navigation = useNavigation<any>();

    const refInputHandler = (text: string) => {
        setRefNo(text);
        setErrorLable('');
    }

    const proceedHandler = async () => {
        if (!refNo) {
            setErrorLable('Please enter reference number!');
            return;
        }
        setIsLoading(true);

        try {
            const { data } = await checkRefId(refNo);
            if (data.status === 'Success' && data.code === 200 && data.data === 'S') {
                // go next
                console.log(data)
                await AsyncStorage.setItem('regRefNo', refNo);
                navigation.push('SignUpFirst');
            } else if (data.status === 'Success' && data.code === 200 && data.data === 'F') {
                Alert.alert('Not Found',
                    'The reference number you have entered is invalid. Please use Admin reference code i.e. 555401005338');
                setErrorLable('');
            } else {
                console.log(`Error while calling check ref id URL`);
                console.error(data);
            }

        } catch (e) {
            Alert.alert('Error',
                'Error while verifying reference number. Please try after sometime.');
            setErrorLable('');
        } finally {
            setIsLoading(false);
        }

    }

    const clearAsyncStorageForRefNo = async () => {
        await AsyncStorage.removeItem('regRefNo');
    }

    useEffect(() => {
        clearAsyncStorageForRefNo()
    }, [])

    if (isLoading)
        return <Loading label={'Verifying reference no...'} />

    return (
        <View style={styles.rootContainer}>
            <Image source={require('../../../assets/logos/gpay_logo.jpeg')} style={styles.logo} />
            <Text style={styles.welcomeText} >Register to Start</Text>
            <View style={{ width: windowWidth - 60 }} >
                <View style={{marginTop: 40}}>
                    <AnimatedInput value={refNo}
                        onChangeText={refInputHandler}
                        keyboardType='numeric'
                        inputLabel='Reference Number' />
                    {errorLabel && <Text style={styles.errorLabel}>{errorLabel}</Text>}
                </View>

                <View style={{ marginTop: 20 }}>
                    <ButtonPrimary
                        label='Verify and Proceed'
                        onPress={() => proceedHandler()}
                        buttonLabelStyle={{ textTransform: 'uppercase' }}
                    />
                </View>
                <View style={{ marginTop: 40 }}>
                    <Text style={styles.informationLable}>If you dont have a valid reference code.</Text>
                    <Text style={styles.informationLable}>Please use "<Text style={{fontWeight: 'bold'}} selectable={true}>555401005338</Text>"</Text>
                </View>

            </View>
        </View>
    )
}

export default CheckRefNo

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: colors.white,
        alignItems: 'center',
    },
    logo: {
        height: 70,
        width: 70,
        marginTop: 90,
        marginBottom: 50,
        resizeMode: 'contain'
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: '400',
        lineHeight: 23,
        color: colors.grey,
    },
    card: {
        marginTop: 30,
        height: 240,
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        justifyContent: 'space-between'
    },
    refNoInput: {
        borderWidth: 2,
        borderColor: colors.primary100,
        paddingHorizontal: 8,
        paddingVertical: 8,
        fontSize: 16,
        color: colors.primary500,
        borderRadius: 8,
        width: '100%'
    },
    informationLable: {
        fontSize: 15,
        fontWeight: '400',
        lineHeight: 17.25,
        color: colors.grey,
        textAlign: 'center'
    },
    verifyCta: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: colors.primary500,
        borderRadius: 8
    },
    verifyCtaLabel: {
        color: colors.white,
        fontSize: 24,
        textAlign: 'center'
    },
    errorLabel: {
        color: colors.secondary500,
        fontSize: 14,
        fontWeight: 'bold'
    }
})