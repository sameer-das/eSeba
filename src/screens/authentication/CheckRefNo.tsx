import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import colors from '../../constants/colors'
import { useNavigation } from '@react-navigation/native';
import Loading from '../../components/Loading';
import { checkRefId } from '../../API/services';


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
                navigation.push('SignUp', {refNo});
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

    if (isLoading)
        return <Loading label={'Verifying reference no...'} />

    return (
        <View style={styles.rootContainer}>
            <Text style={styles.welcomeText} >Register to Start</Text>
            <View style={styles.card}>
                <View>
                    <TextInput style={styles.refNoInput}
                        value={refNo}
                        onChangeText={refInputHandler}
                        keyboardType='numeric'
                        placeholder='Enter Reference No.' />

                    {errorLabel && <Text style={styles.errorLabel}>{errorLabel}</Text>}

                    <Text style={styles.informationLable}>If you dont have a valid reference code, please use "555401005338" as reference code!</Text>
                </View>
                <Pressable style={styles.verifyCta} onPress={() => proceedHandler()}>
                    <Text style={styles.verifyCtaLabel}>Verify and Proceed</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default CheckRefNo

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        padding: 8,
        backgroundColor: colors.white,
        justifyContent: 'center'
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary500,
        textAlign: 'center'
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
        marginVertical: 24,
        fontSize: 16,
        color: colors.primary500,
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