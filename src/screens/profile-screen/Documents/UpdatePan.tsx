import { Pressable, StyleSheet, Text, View, Image, ScrollView, Alert } from 'react-native'
import React, { useState, useContext } from 'react'
import InputWithLabelAndError from '../../../components/InputWithLabelAndError';
import CustomImagePicker from '../../../components/CustomImagePicker';
import colors from '../../../constants/colors';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { saveUserKycDetails } from '../../../API/services';
import Loading from '../../../components/Loading';
import AnimatedInput from '../../../components/AnimatedInput';

const UpdatePan = () => {

    const [pan, setPan] = useState<string>('');
    const [panImage, setPanImage] = useState<any>('');
    const { userData, refreshUserDataInContext } = useContext(AuthContext);
    const navigation = useNavigation<any>();

    const [isLoading, setIsLoading] = useState(false);
   

    const updatePan = async () => {
        if (!pan.trim() || !panImage) {
            Alert.alert('Not Found', 'Please enter PAN and upload PAN image to proceed!');
            return;
        }
        const kycDetails = {
            kyC_ID: userData.kycDetail?.kyC_ID || 0,
            user_ID: userData.user.user_ID,

            aadhar_Number: "",
            aadhar_FontPhoto: "",
            aadhar_BackPhoto: "",
            pancard_Number: pan,
            pancard_Photo: panImage,
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
                Alert.alert('Success', 'PAN details updated successfully');
                setPan('');
                setPanImage('');
                // go back to the Document screen 
                navigation.goBack();
            } else {
                setIsLoading(false);
                Alert.alert('Fail', 'Failed to update PAN details. Please try after sometime.')
            }

        } catch (e) {
            setIsLoading(false);
            console.log('Error while uploading KYC docs - PAN');
            console.log(e);
            Alert.alert('Error', 'Error while updating PAN details. Please try after sometime.')
        } finally {

        }

    }

    if (isLoading)
        return <Loading label={'Updating PAN Details. Please Wait'} />

    return (
        <ScrollView style={styles.rootContainer}>
            <Text style={styles.pageTitle}>Update Your PAN Details</Text>
            <View style={styles.formCard}>
                {/* PAN number */}
                <AnimatedInput
                    value={pan}
                    onChangeText={(text: string) => setPan(text)}
                    inputLabel='Enter PAN'

                />
                {/* PAN PIC */}
                <CustomImagePicker value={panImage} setValue={setPanImage} placeholder='Tap to upload image of your PAN' label='Image of your PAN' />

                <Pressable style={styles.uploadButton} onPress={updatePan}>
                    <Text style={styles.uploadButtonText}>Upload and Update Details</Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}

export default UpdatePan

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
        marginTop: 24,
    },
    imageUploadSection: { marginBottom: 20 },
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
        borderRadius: 8
    },
    uploadButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    }
})