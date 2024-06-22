import { Pressable, StyleSheet, Text, View, Image, ScrollView, Alert } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import colors from '../../../constants/colors'
import InputWithLabelAndError from '../../../components/InputWithLabelAndError';
import CustomImagePicker from '../../../components/CustomImagePicker';
import { AuthContext } from '../../../context/AuthContext';
import { generateOtpForAdharValidate, getAdharDetails, getUserVerifiedAdharaDetails, saveUserKycDetails, verifyOtpForAdhar } from '../../../API/services';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../../components/Loading';
import AnimatedInput from '../../../components/AnimatedInput';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ButtonPrimary from '../../../components/ButtonPrimary';


const UpdateAdhar = () => {
    const { userData, refreshUserDataInContext } = useContext(AuthContext);
    const navigation = useNavigation<any>();
    const [isLoading, setIsLoading] = useState(false);

    const [adharNo, setAdharNo] = useState<string>('');
    const [adharClientId, setAdharClientId] = useState('');
    const [adharOtp, setAdharOtp] = useState('');

    const [adharFront, setAdharFront] = useState<any>('');
    const [adharBack, setAdharBack] = useState<string>('');


    const [userVerifiedAdharNo, setUserVerifiedAdharNo] = useState(null);
    const [isAdharAlreadyVerified, setIsAdharAlreadyVerified] = useState(false);
    const [isKycAdharAndVerifiedAdharMismatch, SetIsKycAdharAndVerifiedAdharMismatch] = useState(true);


    const [showValidateAdharButton, setShowValidateAdharButton] = useState(false);
    const [showUpdateAdharButton, setShowUpdateAdharButton] = useState(false);
    const [showAdharInput, setShowAdharInput] = useState(true);
    const [showAdharOtpInput, setShowAdharOtpInput] = useState(false);
    const [showAdharOtpSubmitButton, setShowAdharOtpSubmitButton] = useState(false);

    const [disableAdharOtpSubmitButton, setDisableAdharOtpSubmitButton] = useState(true);
    const [disableValidateAdharButton, setDisableValidateAdharButton] = useState(true);



    useEffect(() => {
        console.log('============ UseEffect UpdateAdhar ===========')
        const _getUserVerifiedAdharDetails = async () => {
            try {
                setIsLoading(true)
                const { data } = await getUserVerifiedAdharaDetails(userData.user.user_ID);
                // console.log(data)
                if (data.code === 200 && data.status === 'Success') {
                    setUserVerifiedAdharNo(null);
                    if (!data.data) {
                        console.log('Verified Adhar not available');
                        // If verified adhar number is not there
                        setShowValidateAdharButton(true);
                        setAdharNo('');
                        setIsAdharAlreadyVerified(false);
                        setShowUpdateAdharButton(false);
                    } else {
                        // If adhar no is already verified 
                        setIsAdharAlreadyVerified(true);
                        setShowUpdateAdharButton(true);
                        setUserVerifiedAdharNo(JSON.parse(data.data).data?.aadhaar_number);
                        setAdharNo(JSON.parse(data.data).data?.aadhaar_number);
                        console.log(JSON.parse(data.data).data?.aadhaar_number);
                        console.log(userData.kycDetail.aadhar_Number)
                        if(userData.kycDetail?.aadhar_Number !== JSON.parse(data.data).data?.aadhaar_number) {
                            SetIsKycAdharAndVerifiedAdharMismatch (true);
                        } else {
                            SetIsKycAdharAndVerifiedAdharMismatch (false);
                        }

                    }

                }
            } catch (error) {

            } finally {
                setIsLoading(false);
            }
        }

        _getUserVerifiedAdharDetails();

    }, [userData.user.user_ID]);



    const generateOtpForAdhar = async () => {
        setIsLoading(true);
        try {
            const { data } = await generateOtpForAdharValidate({ "adharaNumber": adharNo, "userId": userData.user.user_ID })
            console.log(data);
            if (data.status === 'Success' && data.code === 200 && data.data?.success && data.data?.message_code === 'success' && data.data?.data?.otp_sent) {
                Alert.alert('Success', data.data.message);
                setAdharClientId(data.data?.data?.client_id);
                setShowAdharOtpInput(true);
                setShowAdharOtpSubmitButton(true);
                setShowAdharInput(false);
                setShowValidateAdharButton(false);

            } else {
                Alert.alert('Alert', data.data.message);
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Error while sending OTP to registered mobile number.');
        } finally {
            setIsLoading(false);
        }
    }



    const validateAdharNumber = () => {
        if (adharNo.trim() === '') {
            Alert.alert('Enter Adhar Number', 'Please enter valid adhar number.')
            return false;
        }
        if (!/^[0-9]*$/.test(adharNo.trim()) || adharNo.trim().length != 12) {
            Alert.alert('Invalid Adhar Number', 'Please enter valid adhar number.')
            return false;
        }

        return true;
    }



    const updateAdhar = async () => {
        // If adhar is not validated then return here
        if (!validateAdharNumber()) {
            return;
        }
        if (adharFront === '' || adharBack === '') {
            Alert.alert('Upload Adhar Photos', 'Please upload adhar front side and back side photos.')
            return;
        }


        const kycDetails = {
            kyC_ID: userData.kycDetail?.kyC_ID || 0,
            user_ID: userData.user.user_ID,

            aadhar_Number: adharNo,
            aadhar_FontPhoto: adharFront,
            aadhar_BackPhoto: adharBack,
            pancard_Number: "",
            pancard_Photo: "",
            passport_Photo: "",
            gsT_Number: "",
            gsT_Photo: "",
            center_IndoorPhoto: "",
            center_OutDoorPhoto: "",
        };
        try {
            setIsLoading(true);
            const { data } = await saveUserKycDetails(kycDetails);
            if (data.code === 200 && data.status === 'Success') {
                setIsLoading(false);
                refreshUserDataInContext();
                Alert.alert('Success', 'Adhar details updated successfully');
                setAdharNo('');
                setAdharFront('');
                setAdharBack('');
                // go back to the Document screen 
                navigation.goBack();
            } else {
                setIsLoading(false);
                Alert.alert('Fail', 'Failed to update adhar details. Please try after sometime.')
            }

        } catch (e) {
            setIsLoading(false);
            console.log('Error while uploading KYC docs - Adhar');
            console.log(e);
            Alert.alert('Error', 'Error while updating adhar details. Please try after sometime.')
        } finally {

        }
    }



    const adharOtpSubmit = async () => {
        const payload = {
            "client_id": adharClientId,
            "otp": adharOtp
        }
        try {
            setIsLoading(true);
            const { data } = await verifyOtpForAdhar(userData.user.user_ID, payload);
            console.log(data)
            if (data.status === 'Success' && data.code === 200 && data.data?.success && data.data?.message_code === 'success' && data.data?.data) {

                setUserVerifiedAdharNo(data.data?.data?.aadhaar_number);
                setIsAdharAlreadyVerified(true);

                setAdharNo(data.data?.data?.aadhaar_number);
                setShowValidateAdharButton(false)
                setAdharClientId('');

                // If adhar card number is already there then check equality
                if (userData?.kycDetails?.aadhaar_Number) {
                    SetIsKycAdharAndVerifiedAdharMismatch(data.data?.data?.aadhaar_number !== userData.kycDetails?.aadhaar_Number)
                }
                setShowAdharInput (true);
                setShowAdharOtpInput(false);
                setShowAdharOtpSubmitButton(false);
                setShowValidateAdharButton(false);
                setShowUpdateAdharButton (true);

            } else {
                Alert.alert('Alert', data.data.message);

                setShowAdharInput (true);
                setShowAdharOtpInput(false);
                setShowAdharOtpSubmitButton(false);
                setShowValidateAdharButton(true);
                setShowUpdateAdharButton (false);
            }
        } catch (error) {
            Alert.alert('Alert', 'Error occured while submitting OTP.');
            setShowAdharInput (true);
            setShowAdharOtpInput(false);
            setShowAdharOtpSubmitButton(false);
            setShowValidateAdharButton(true);
            setShowUpdateAdharButton (false);
        } finally {
            setIsLoading(false);            
        }
    }



    const verifyAdharPressHandler = () => {
        // If adhar is not validated then return here
        if (!validateAdharNumber()) {
            return;
        }

        Alert.alert('Confirm',
            `An OTP will be sent to your Adhar registered (Not E-Seba registered) mobile number for verification.`,
            [{
                text: 'Confirm',
                onPress: () => {
                    console.log('Confirmed');
                    generateOtpForAdhar()
                }
            }, {
                text: 'Cancel',
                onPress: () => {
                    console.log('Cancelled')
                    return;
                }
            }]);

    }



    const updateAdharPressHandler = () => {
        updateAdhar()
    }



    const handleAdharNumberChange = (text: string) => {
        setAdharNo(text);

        if(text.length === 12) {
            setDisableValidateAdharButton(false);
        } else {
            setDisableValidateAdharButton (true);
        }

        // If adhar number is already verified and user wants to change
        if(userVerifiedAdharNo && (userVerifiedAdharNo !== text)) {
            setIsAdharAlreadyVerified (false);
            setShowValidateAdharButton(true);
            setShowUpdateAdharButton(false);
        } else if(userVerifiedAdharNo && (userVerifiedAdharNo === text)) {
            setIsAdharAlreadyVerified (true);
            setShowValidateAdharButton(false);
            setShowUpdateAdharButton(true);
        }
    }



    const handleAdharOtpInput = (text: string) => {
        setAdharOtp(text);
        if (text.length === 6) {
            setDisableAdharOtpSubmitButton(false);
        } else {
            setDisableAdharOtpSubmitButton(true);
        }
    }


    
    const adharOtpSunmitHandler = () => {
        adharOtpSubmit ();
    }




    // ============================================================
    // ======================== Template ==========================
    // ============================================================



    if (isLoading)
        return <Loading />

    return (
        <ScrollView style={styles.rootContainer}>
            <Text style={styles.pageTitle}>Update Your Adhar Details</Text>

            <View style={{flexDirection:"row", justifyContent:'space-between', marginTop: 16}}>                
                    {
                        isAdharAlreadyVerified ?
                        <Text style={{ color: colors.primary500, fontSize: 14 }}>
                            {'Verified'} <MaterialIcon name='check' color={'limegreen'} size={14} /> 
                        </Text> :
                        <Text style={{ color: colors.primary500, fontSize: 14 }}>
                            {'Not Verified'} <MaterialIcon name='close' color={'orangered'} size={14} /> 
                        </Text>
                    }
                    
                    {
                        isKycAdharAndVerifiedAdharMismatch ?
                        <Text style={{ color: colors.primary500, fontSize: 14 }}>
                            {'Not Uploaded'} <MaterialIcon name='close' color={'orangered'} size={14} /> 
                        </Text> :
                        <Text style={{ color: colors.primary500, fontSize: 14 }}>
                            {'Uploaded'} <MaterialIcon name='check' color={'limegreen'} size={14} /> 
                        </Text>
                    }
            </View>

            <View style={styles.formCard}>

                {/* Adhar number */}
                {
                    showAdharInput && <AnimatedInput
                        value={adharNo}
                        onChangeText={handleAdharNumberChange}
                        inputLabel='Enter Adhar Number'
                        keyboardType='numeric'
                        maxLength={12}
                    />
                }

                {/* Adhar OTP Input */}
                {
                    showAdharOtpInput && <AnimatedInput
                        value={adharOtp}
                        onChangeText={handleAdharOtpInput}
                        inputLabel='Enter Otp Received'
                        keyboardType='numeric'
                        maxLength={6}
                    />
                }



                


                {/* Only Show if adhar is already verified  */}
                {isAdharAlreadyVerified && <>
                    {/* Adhar Front */}
                    <CustomImagePicker value={adharFront} setValue={setAdharFront} placeholder='Tap to upload Adhar front side pic' label='Adhar front side pic' />

                    {/* Adhar Back */}
                    <CustomImagePicker value={adharBack} setValue={setAdharBack} placeholder='Tap to upload Adhar back side pic' label='Adhar back side pic' />
                </>}
                

                {/* Verify Adhar button */}
                {
                    showValidateAdharButton && <ButtonPrimary onPress={verifyAdharPressHandler} label='Verify Adhar' disabled={disableValidateAdharButton} />
                }


                {/* Submit Adhar OTP button */}
                {
                    showAdharOtpSubmitButton && <ButtonPrimary onPress={adharOtpSunmitHandler} label='Submit Adhar OTP' disabled={disableAdharOtpSubmitButton} />
                }


                {/* Update Adhar OTP button */}
                {
                    showUpdateAdharButton && <ButtonPrimary onPress={updateAdharPressHandler} label='Update Adhar' />
                }

            </View>
        </ScrollView>
    )
}

export default UpdateAdhar

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        padding: 8,
        backgroundColor: colors.white,
    }, pageTitle: {
        fontSize: 24,
        color: colors.primary500,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    formCard: {
        // marginTop: 12,
        flex: 1,
        marginBottom: 30
    },
    adharFrontPicContainer: {
        height: 180,
        borderColor: colors.primary500,
        borderWidth: 1,
        borderRadius: 8
    },
    centerText: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    uploadText: {
        fontSize: 16,
        color: colors.primary100
    },
    imageLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary500,
        marginBottom: 4
    },
    imageBottomControlContainer: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    uploadAgainText: {
        fontSize: 16,
        color: colors.primary100,
        fontStyle: 'italic'
    },
    deleteButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 16,
        backgroundColor: colors.secondary500,
    },
    deleteButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold'
    },
    uploadButton: {
        paddingVertical: 16,
        backgroundColor: colors.primary500,
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 12
    },
    uploadButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    }
})