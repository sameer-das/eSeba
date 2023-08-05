import { useNavigation } from '@react-navigation/native'
import React, { useContext, useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { registerSenderInfo } from '../../../API/services'
import AnimatedInput from '../../../components/AnimatedInput'
import Loading from '../../../components/Loading'
import colors from '../../../constants/colors'
import { AuthContext } from '../../../context/AuthContext'

const AddSender = () => {
  const navigation = useNavigation<any>();
  const [fullname, setFullname] = useState('');
  const [isNeft, setIsNeft] = useState<boolean>(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const { userData } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async () => {
    if (fullname === '' || !fullname) {
      Alert.alert('Invalid Input', 'Please enter your full name.');
      return;
    }


    const payload = {
      "requestType": "SenderRegister",
      "senderMobileNumber": userData.user.mobile_Number,
      "txnType": isNeft ? 'NEFT' : 'IMPS',
      "senderName": fullname,
      "senderPin": userData.personalDetail.user_Pin
    }

    try {
      setIsLoading(true)
      const { data } = await registerSenderInfo(payload);
      console.log(data);
      setIsLoading(false);
      if (data.code === 200 && data.status === 'Success') {
        if (data.resultDt.responseReason === 'Successful' && data.resultDt.senderMobileNumber && data.resultDt.responseCode == 0) {
          Alert.alert('Registration Successful.', 'An OTP has been sent to your registered mobile number for verification.',
            [{
              text: 'OK',
              onPress: () => {
                navigation.replace('dmtOtpScreen', {
                  "txnType": isNeft ? 'NEFT' : 'IMPS',
                  "additionalRegData": String(data.resultDt.additionalRegData)
                })
              }
            }])
        } else {
          Alert.alert('Fail', 'Failed while sender registration. Please try after sometime')
        }
      } else {
        Alert.alert('Fail', 'Failed while sender registration. Please try after sometime')
      }
    } catch (e) {
      console.log('Error while adding sender');
      console.log(e);
      Alert.alert('Error', 'Error while registering sender. Please try after sometime.');
      setIsLoading(false);
    }

  }


  if (isLoading)
    return <Loading label='Loading...' />
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.pageHeader}>DMT Sender Registration</Text>
      <View style={styles.formContainer}>
        <AnimatedInput
          value={fullname}
          onChangeText={(text: string) => {
            setFullname(text);
            if (!text)
              setIsSubmitDisabled(true)
            else
              setIsSubmitDisabled(false)
          }}

          placeholder="Full name"
          inputLabel="Enter your full name"
          errorMessage="" />

        <View>
          <Text style={styles.label}>Choose Trnasaction Type</Text>

          <View style={styles.transTypeButtonContainer}>
            <Pressable onPress={() => { setIsNeft(false) }} style={[styles.transTypeButton, { backgroundColor: !isNeft ? colors.primary500 : colors.white }]}>
              <Text style={[styles.transTypeButtonLabel, { color: !isNeft ? colors.white : colors.primary500 }]}>IMPS</Text>
            </Pressable>
            <Pressable onPress={() => { setIsNeft(true) }} style={[styles.transTypeButton, { backgroundColor: isNeft ? colors.primary500 : colors.white }]}>
              <Text style={[styles.transTypeButtonLabel, { color: isNeft ? colors.white : colors.primary500 }]}>NEFT</Text>
            </Pressable>
          </View>
        </View>


        <Pressable style={[styles.cta, { backgroundColor: isSubmitDisabled ? colors.primary100 : colors.primary500 }]} disabled={isSubmitDisabled} onPress={handleSubmit}>
          <Text style={styles.ctaLabel}>Submit</Text>
        </Pressable>

      </View>
    </View>
  )
}

export default AddSender

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 8,
    paddingTop: 32
  },
  pageHeader: {
    fontSize: 24,
    color: colors.primary500,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  formContainer: {
    marginTop: 20
  },
  cta: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  ctaLabel: {
    color: colors.white,
    fontSize: 24,
    textAlign: 'center'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary500,
    marginBottom: 4
  },
  transTypeButtonContainer: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-evenly',
    marginTop: 20

  },
  transTypeButton: {
    height: '100%',
    width: 80,
    borderWidth: 2,
    borderColor: colors.primary500,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4

  },
  transTypeButtonLabel: {
    color: colors.primary500,
    fontSize: 18,
    fontWeight: 'bold'
  }
})