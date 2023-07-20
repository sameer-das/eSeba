import { StyleSheet, Text, View, KeyboardAvoidingView, Pressable, ScrollView } from 'react-native'
import React, { useState } from 'react'

import colors from '../../constants/colors'
import { windowHeight } from '../../utils/dimension'
import SelectBoxWithLabelAndError from '../../components/SelectBoxWithLabelAndError'
import { useNavigation, useRoute } from '@react-navigation/native'
import InputWithLabelAndError from '../../components/InputWithLabelAndError'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AnimatedInput from '../../components/AnimatedInput'
import ButtonPrimary from '../../components/ButtonPrimary'


const SignUpFirst = () => {

    const route = useRoute<any>();
    const navigation = useNavigation<any>();

    const [formValue, setFormValue] = useState<any>({
        userType: { value: { name: 'End User', value: '1' }, error: '', pattern: '', required: true },
        firstName: { value: '', error: '', pattern: '', required: true },
        lastName: { value: '', error: '', pattern: '', required: true },
        gender: { value: { name: 'Male', value: 'Male' }, error: '', pattern: '', required: true },
        mobile: { value: '', error: '', pattern: new RegExp(/^((\\+91-?)|0)?[0-9]{10}$/), required: true },
        email: { value: '', error: '', pattern: new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/), required: true },
    });

    const [isFirstPageValid_FromChangeHandler, setIsfirstPageValidFromChangeHandler] = useState(true);


    const userTypeMasterData = [
        { name: 'End User', value: '1' },
        { name: 'E-Sathi', value: '2' },
    ]

    const genderMasterData = [
        { name: 'Male', value: 'Male' },
        { name: 'Female', value: 'Female' },
        { name: 'Others', value: 'Others' },
    ]

    const requiredErrorMessage: any = {
        firstName: 'Please enter first name',
        lastName: 'Please enter last name',
        mobile: 'Please enter mobile no',
        email: 'Please enter email',
    }
    const patternErrorMessage: any = {
        mobile: 'Mobile number should be of only 10 digits',
        email: 'Please enter a valid email id',
    }

    const handleInputChange = (text: string, keyName: string) => {
        let errorMessage = '';

        if (formValue[keyName].required && text.trim() === '') {
            errorMessage = requiredErrorMessage[keyName];
        } else if (formValue[keyName].pattern !== '' && !(formValue[keyName].pattern.test(text.trim())))
            errorMessage = patternErrorMessage[keyName];

        const obj = { ...formValue[keyName], value: text.trim(), error: errorMessage }
        setFormValue({ ...formValue, [keyName]: obj });
        if (errorMessage !== '')
            setIsfirstPageValidFromChangeHandler(false);
        else if (!isFirstPageValid_FromChangeHandler)
            setIsfirstPageValidFromChangeHandler(true);
    }


    const validateFirstPage = () => {
        const keyNames = ['firstName', 'lastName', 'mobile', 'email'];
        let bRet = true;
        keyNames.forEach(keyName => {
            let errorMessage = '';
            // console.log('checking ' + keyName)
            if (formValue[keyName].required && formValue[keyName].value.trim() === '') {
                // console.log(keyName + ' not filled');
                errorMessage = requiredErrorMessage[keyName];
            } else if (formValue[keyName].pattern !== '' && !(new RegExp(formValue[keyName].pattern).test(formValue[keyName].value.trim()))) {
                // console.log(keyName + ' invalid')
                errorMessage = patternErrorMessage[keyName];
            }
            const obj = { ...formValue[keyName], error: errorMessage };
            setFormValue((currentFormValue: any) => {
                return { ...currentFormValue, [keyName]: obj }
            });
            if (errorMessage !== '')
                bRet = false;

        });

        return bRet;

    }

    const handleNextCtaPress = async () => {
        const isFirstPageValid_FromCtaPress = validateFirstPage()
        if (isFirstPageValid_FromCtaPress && isFirstPageValid_FromChangeHandler) {
            // first page is valid show 2nd page
            await AsyncStorage.setItem('firstFormData', JSON.stringify({
                "user_Type_ID": +formValue.userType.value.value,
                "user_FName": formValue.firstName.value,
                "user_LName": formValue.lastName.value,
                "user_Gender": formValue.gender.value.value,
                "mobile_Number": formValue.mobile.value,
                "user_EmailID": formValue.email.value,
            }));
            navigation.push('SignUpSecond');
        }
    }

    return (
        <ScrollView>
            <KeyboardAvoidingView enabled style={{ flex: 1, backgroundColor: colors.white }}>
                <View style={styles.rootContainer}>
                    <View style={{ marginVertical: 30 }}>
                        <Text style={styles.welcomeText}>We are happy to know you</Text>
                    </View>

                    {/* User Type */}
                    <View>
                        <SelectBoxWithLabelAndError listData={userTypeMasterData}
                            label={'Choolse User Type'}
                            placeholder={'Select'}
                            errorMessage={''}
                            value={formValue.userType.value.name}
                            optionLable={(curr: any) => { return curr.name }}
                            onSelectionChange={(item: any) => {
                                const obj = { ...formValue.userType, value: item }
                                setFormValue({ ...formValue, userType: obj });
                            }}
                        />
                    </View>

                    <AnimatedInput
                        value={formValue.firstName.value}
                        errorMessage={formValue.firstName.error}
                        onChangeText={(text: string) => handleInputChange(text, 'firstName')}
                        inputLabel={'Enter First Name'} />

                    <AnimatedInput
                        value={formValue.lastName.value}
                        onChangeText={(text: string) => handleInputChange(text, 'lastName')}
                        inputLabel={'Enter Last Name'}
                        errorMessage={formValue.lastName.error} />

                    {/* Gender */}
                    <SelectBoxWithLabelAndError listData={genderMasterData}
                        label={'Choolse Gender'}
                        placeholder={'Select'}

                        value={formValue.gender.value.name}
                        optionLable={(curr: any) => { return curr.name }}
                        onSelectionChange={(item: any) => {
                            const obj = { ...formValue.gender, value: item }
                            setFormValue({ ...formValue, gender: obj });
                        }} />

                    <AnimatedInput
                        value={formValue.mobile.value}
                        errorMessage={formValue.mobile.error}
                        onChangeText={(text: string) => handleInputChange(text, 'mobile')}
                        inputLabel={'Enter Mobile Number'}
                        keyboardType={'numeric'}
                        maxLength={10} />

                    <AnimatedInput
                        value={formValue.email.value}
                        errorMessage={formValue.email.error}
                        onChangeText={(text: string) => handleInputChange(text, 'email')}
                        inputLabel={'Enter Email ID'}
                        keyboardType={'email-address'} />

                    <View style={{marginVertical: 20}}>
                        <ButtonPrimary onPress={handleNextCtaPress} label='Next' buttonLabelStyle={{ textTransform: 'uppercase' }} />

                    </View>


                </View>

            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default SignUpFirst

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        padding: 8,
        backgroundColor: colors.white,
        height: windowHeight
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: '400',
        color: colors.grey,
        textAlign: 'center',
    },


    signUpCta: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: colors.primary500,
        borderRadius: 8,
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    signUpCtaLabel: {
        color: colors.white,
        fontSize: 24,
        textAlign: 'center'
    },
})