import { Pressable, StyleSheet, Text, View, Image, ScrollView, Alert } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import colors from '../../../constants/colors'
import InputWithLabelAndError from '../../../components/InputWithLabelAndError';
import CustomImagePicker from '../../../components/CustomImagePicker';
import { AuthContext } from '../../../context/AuthContext';
import { getAdharDetails, saveUserKycDetails } from '../../../API/services';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../../components/Loading';
import AnimatedInput from '../../../components/AnimatedInput';


const UpdateAdhar = () => {
  const { userData, refreshUserDataInContext } = useContext(AuthContext);
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);

  const [adharNo, setAdharNo] = useState<string>('');
  const [adharFront, setAdharFront] = useState<any>('');
  const [adharBack, setAdharBack] = useState<string>('');
  const [isAdharValidated, setIsAdharValidated] = useState(false)

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

  const verifyAdharNumber = async () => {
    try {
      setIsLoading(true);
      const { data } = await getAdharDetails({
        "adharaNumber": adharNo.trim(),
        "userId": userData.user.user_ID
      })
      console.log(data)
      if (data.code === 200 && data.status === "Success" && data?.data?.data) {
        setIsAdharValidated(true);
        Alert.alert('Success', 'The entered adhar number has been validated successfully.')
      } else {
        setIsAdharValidated(false);
        Alert.alert('Fail', 'Adhar number validation failed. Please try after sometime.')
      }
    } catch (err) {
      console.log(err);
      setIsAdharValidated(false);
      Alert.alert('Error', 'Error while validating adhar number. Please try after sometime.')
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
      `Please confirm if the adhar no. ${adharNo} is correct and belongs to you. This will be validated against UIDAI records.`,
      [{
        text: 'Confirm',
        onPress: () => {
          console.log('Confirmed');
          verifyAdharNumber()
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

  if (isLoading)
    return <Loading />

  return (
    <ScrollView style={styles.rootContainer}>
      <Text style={styles.pageTitle}>Update Your Adhar Details</Text>
      <View style={styles.formCard}>

        {/* Adhar number */}
        <AnimatedInput
          value={adharNo}
          onChangeText={(text: string) => setAdharNo(text)}
          inputLabel='Enter Adhar Number'
          keyboardType='numeric'
          maxLength={12}
        />
        {/* Adhar Front */}
        <CustomImagePicker value={adharFront} setValue={setAdharFront} placeholder='Tap to upload Adhar front side pic' label='Adhar front side pic' />

        {/* Adhar Back */}
        <CustomImagePicker value={adharBack} setValue={setAdharBack} placeholder='Tap to upload Adhar back side pic' label='Adhar back side pic' />


        {isAdharValidated ?
          <Pressable style={styles.uploadButton} onPress={updateAdharPressHandler}>
            <Text style={styles.uploadButtonText}>Update and Upload Adhar</Text>
          </Pressable>
          :
          <Pressable style={styles.uploadButton} onPress={verifyAdharPressHandler}>
            <Text style={styles.uploadButtonText}>Verify Adhar</Text>
          </Pressable>}
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
    marginTop: 12,
    flex: 1
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