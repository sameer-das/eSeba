import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Pressable, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import colors from '../../constants/colors'
import { windowHeight } from '../../utils/dimension'
import { useNavigation, useRoute } from '@react-navigation/native'
import DatePicker from 'react-native-date-picker'
import SelectBoxWithLabelAndError from '../../components/SelectBoxWithLabelAndError'
import { getBlocks, getDistrict, getStates, getUserLocationType, saveUserRegistrationDetails } from '../../API/services'
import InputWithLabelAndError from '../../components/InputWithLabelAndError'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Loading from '../../components/Loading'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AnimatedInput from '../../components/AnimatedInput'
import ButtonPrimary from '../../components/ButtonPrimary'
const SignUpSecond = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();

    const [formValue, setFormValue] = useState<any>({
        locationType: { value: '', error: '', pattern: '', required: true },
        dob: { value: new Date().toISOString(), error: '', pattern: '', required: true },
        state: { value: '', error: '', pattern: '', required: true },
        district: { value: '', error: '', pattern: '', required: true },
        block: { value: '', error: '', pattern: '', required: true },
        pin: { value: '', error: '', pattern: new RegExp(/^[0-9]{6}$/), required: true },
        ward: { value: '', error: '', pattern: '', required: true },
    });

    const requiredErrorMessage: any = {
        firstName: 'Please enter first name',
        lastName: 'Please enter last name',
        mobile: 'Please enter mobile no',
        email: 'Please enter email',
        pin: 'Please enter PIN',
        locationType: 'Please choose location type',
        state: 'Please choose state',
        district: 'Please choose district',
        block: 'Please choose block',
        ward: 'Please enter GP/Ward',
    }
    const patternErrorMessage: any = {
        pin: 'PIN should be of only 6 digits',
        mobile: 'Mobile number should be of only 10 digits',
        email: 'Please enter a valid email id',
    }

    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [locationTypeMasterData, setLocationTypeMasterData] = useState<any[]>([]);
    const [stateMasterData, setStateMasterData] = useState<any[]>([]);
    const [districtMasterData, setDistrictMasterData] = useState<any[]>([]);
    const [blockMasterData, setBlockMasterData] = useState<any[]>([]);

    const handleInputChange = (text: string, keyName: string) => {
        let errorMessage = '';

        if (formValue[keyName].required && text.trim() === '') {
            errorMessage = requiredErrorMessage[keyName];
        } else if (formValue[keyName].pattern !== '' && !(formValue[keyName].pattern.test(text.trim())))
            errorMessage = patternErrorMessage[keyName];

        const obj = { ...formValue[keyName], value: text.trim(), error: errorMessage }
        setFormValue({ ...formValue, [keyName]: obj });
    }


    const validateSecondPage = () => {
        const keyNames = ['locationType', 'state', 'district', 'block', 'pin', 'ward'];
        let bRet = true;

        try {
            keyNames.forEach(keyName => {
                let errorMessage = '';
                // console.log('checking ' + keyName)
                if (formValue[keyName].required && !formValue[keyName].value) {
                    // console.log(keyName + ' not filled');
                    errorMessage = requiredErrorMessage[keyName];
                } else if (formValue[keyName].pattern !== '' && !(formValue[keyName].pattern?.test(formValue[keyName].value.trim()))) {
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
        } catch (e) {
            console.log(e)
        }


        return bRet;
    }

    const getDate = (date: string) => {
        const newDate = new Date(date.substring(0, 10)).getTime()
        return new Date(newDate).toISOString();
    }


    const handleRegisterCtaPress = async () => {
        // console.log(formValue);
        if (validateSecondPage()) {
            console.log('All ok go for api call');
            const _fData = await AsyncStorage.getItem('firstFormData') || '{}';
            console.log(_fData)
            const firstFormData = JSON.parse(_fData);

            const refNo = await AsyncStorage.getItem('regRefNo') || ''

            const registrationPayload = {

                ...firstFormData,
                "user_ID": 0,
                "location_Type": formValue.locationType.value.id + "",
                "state_ID": +formValue.block.value.state_ID,
                "status": "N",
                "login_Code": "gskInd003",
                "login_Password": "test@123",
                "district_ID": +formValue.block.value.district_ID,
                "block_ID": +formValue.block.value.block_ID,
                "user_Pin": formValue.pin.value,
                "user_GP": formValue.ward.value,
                "user_Dob": getDate(formValue.dob.value),
                "ref_Code": refNo
            }
            console.log(registrationPayload);

            // saveUserInfo(registrationPayload);
        }

    }

    const [isLoading, setIsLoading] = useState(false);

    const saveUserInfo = async (registrationPayload: any) => {
        setIsLoading(true);
        try {
            const { data } = await saveUserRegistrationDetails(registrationPayload);
            if (data.status === 'Success' && data.code === 200) {
                setIsLoading(false);
                if (JSON.parse(data.data)[0]?.Result?.includes('already registered')) {
                    Alert.alert('Fail', 'Provided Email ID or mobile number is already registered with us!');
                    return;
                }
                Alert.alert('Success', 'Thank you for registering with us! Login credentials has been sent to your registered Email ID and Mobile Number!', [{
                    text: 'Ok', onPress: () => {
                        navigation.navigate('SignIn'); // goes to signin screen
                    }
                }]);
            } else {
                setIsLoading(false);
                Alert.alert('Fail', 'Error while user ragistration, Please try after sometime.');
            }
        } catch (e) {
            console.log(e)
            setIsLoading(false);
            Alert.alert('Fail', 'Error while user ragistration, Please try after sometime.');
        }



    }



    const populateUserLocationTypes = async () => {
        const { data } = await getUserLocationType();
        if (data.status === 'Success' && data.code === 200) {
            setLocationTypeMasterData(data.data)
        }
    }

    const populateStates = async () => {
        const { data } = await getStates(1);
        if (data.status === 'Success')
            setStateMasterData(data.data);
        else
            setStateMasterData([])
    }

    const populateDistricts = async (stateId: number) => {
        const { data } = await getDistrict(stateId);
        if (data.status === 'Success' && data.code === 200)
            setDistrictMasterData(data.data);
        else
            setDistrictMasterData([])
    }

    const populateBlocks = async (stateId: number, districtId: number) => {
        const { data } = await getBlocks(stateId, districtId);
        if (data.status === 'Success' && data.code === 200)
            setBlockMasterData(data.data);
        else
            setBlockMasterData([])
    }

    useEffect(() => {
        populateStates();
        populateUserLocationTypes();
    }, [])

    if (isLoading)
        return <Loading label={'Please wait! Saving your details.'} />

    return (
        <ScrollView>
            <KeyboardAvoidingView enabled style={{ flex: 1, backgroundColor: colors.white }}>
                <View style={styles.rootContainer}>
                    <View style={{marginVertical: 30}}>

                    <Text style={styles.welcomeText}>We are happy to know you</Text>
                    </View>

                    <Text style={styles.dobLable}>Choose Date Of Birth</Text>
                    <Pressable style={styles.dobButton} onPress={() => setDatePickerOpen(true)} >
                        <Text style={styles.dobText}>{formValue.dob.value ? new Date(formValue.dob.value).toDateString() : 'Choose DOB'}</Text>
                    </Pressable>

                    <DatePicker
                        modal
                        mode='date'
                        open={datePickerOpen}
                        date={new Date(formValue.dob.value)}
                        textColor={colors.primary500}
                        title={null}
                        maximumDate={new Date()}
                        onConfirm={(date) => {
                            setDatePickerOpen(false)
                            setFormValue({
                                ...formValue, dob: { ...formValue.dob, value: date.toISOString() }
                            })
                        }}
                        onCancel={() => {
                            setDatePickerOpen(false)
                        }}
                    />

                    {/* Location Type */}
                    <SelectBoxWithLabelAndError listData={locationTypeMasterData}
                        label={'Choolse Location Type'}
                        placeholder={'Select'}
                        errorMessage={formValue.locationType.error}
                        value={formValue.locationType.value.location}
                        optionLable={(curr: any) => { return curr.location }}
                        onSelectionChange={(item: any) => {
                            const obj = { ...formValue.locationType, value: item, error: '' }
                            setFormValue({ ...formValue, locationType: obj });
                            // setFormValue()
                        }} />

                    {/* State */}
                    <SelectBoxWithLabelAndError listData={stateMasterData}
                        label={'Choolse State'}
                        placeholder={'Select'}
                        errorMessage={formValue.state.error}
                        value={formValue.state.value.state_Name}
                        optionLable={(curr: any) => { return curr.state_Name }}
                        onSelectionChange={(item: any) => {
                            const obj = { ...formValue.state, value: item, error: '' }
                            const district = { ...formValue.district, value: '' }
                            const block = { ...formValue.block, value: '' }
                            setFormValue({ ...formValue, state: obj, district: district, block: block });
                            populateDistricts(item.state_ID);
                        }} />

                    {/* District */}
                    <SelectBoxWithLabelAndError listData={districtMasterData}
                        label={'Choolse District'}
                        placeholder={'Select'}
                        errorMessage={formValue.district.error}
                        value={formValue.district.value.district_Name}
                        optionLable={(curr: any) => { return curr.district_Name }}
                        onSelectionChange={(item: any) => {
                            const obj = { ...formValue.district, value: item, error: '' }
                            const block = { ...formValue.block, value: '' }
                            setFormValue({ ...formValue, district: obj, block: block });
                            populateBlocks(item.state_ID, item.district_ID);
                        }} />


                    {/* Block */}
                    <SelectBoxWithLabelAndError listData={blockMasterData}
                        label={'Choolse Block'}
                        placeholder={'Select'}
                        errorMessage={formValue.block.error}
                        value={formValue.block.value.block_Name}
                        optionLable={(curr: any) => { return curr.block_Name }}
                        onSelectionChange={(item: any) => {
                            const obj = { ...formValue.block, value: item, error: '' }
                            setFormValue({ ...formValue, block: obj });
                        }} />

                    <AnimatedInput
                        value={formValue.ward.value}
                        onChangeText={(text: string) => handleInputChange(text, 'ward')}
                        inputLabel={'Enter GP/Ward'}
                        errorMessage={formValue.ward.error} />

                    <AnimatedInput
                        value={formValue.pin.value}
                        onChangeText={(text: string) => handleInputChange(text, 'pin')}
                        inputLabel={'Enter PIN'}
                        keyboardType={'numeric'}
                        maxLength={6}
                        errorMessage={formValue.pin.error} />

                    <View style={{ marginVertical: 20 }}>
                        <ButtonPrimary onPress={handleRegisterCtaPress} label='Register With Us' buttonLabelStyle={{ textTransform: 'uppercase' }} />
                    </View>

                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default SignUpSecond

const styles = StyleSheet.create({
    rootContainer: {
        // flex: 1,
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
    dobButton: {
        borderBottomWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 11,
        width: '100%',
        borderBottomColor: colors.primary100,
        marginBottom: 16
    },
    dobText: {
        fontSize: 16,
        color: colors.primary500,
    },
    dobLable: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.grey,
        marginBottom: 4
    }
})