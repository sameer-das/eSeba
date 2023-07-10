import { StyleSheet, Text, View, ScrollView, Pressable, Alert } from 'react-native'
import React, { useState, useContext } from 'react'
import colors from '../../constants/colors'
import InputWithLabelAndError from '../../components/InputWithLabelAndError'
import { AuthContext } from '../../context/AuthContext'
import { validateTPin } from '../../API/services'
import Loading from '../../components/Loading'
import { useNavigation } from '@react-navigation/native'

const EnterOtpForPinChange = () => {
  const { userData } = useContext(AuthContext);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<any>();

  const otpSubmitHandler = async () => {
    const regexp = new RegExp('^[0-9]+$');
    if (regexp.test(otp)) {
      try {
        setIsLoading(true);
        const { data } = await validateTPin(userData.user.user_ID, otp);
        if (data.status === 'Success' && data.code === 200 && data.data) {
          // navigate to set new pin 
          setIsLoading(false);
          navigation.replace('setNewWalletPin', {pin: otp});
        } else if (data.status === 'Success' && data.code === 200 && !data.data) {
          Alert.alert('Invalid OTP', 'You have entered wrong OTP.');
          setOtp('');
        } else {
          Alert.alert('Fail', 'Unknown error occured, please contact support!');
          setOtp('');
        }

      } catch (e) {
        setIsLoading(false);
        console.log('Error while validating pin');
        console.log(e);
        Alert.alert('Error', 'Error while validating otp, please try after sometime.');
      }
    } else if(!otp) {
      Alert.alert('OTP Required', 'Please enter OTP!');
    } else {
      setIsLoading(false);
      Alert.alert('Invalid Pattern', 'OTP can contain only 4 digits!');
    }
  }


  if(isLoading)
    return <Loading label={'Validating OTP'}/>
  return (
    <ScrollView style={styles.rootContainer}>
      <Text style={styles.pageTitle}>Enter OTP</Text>
      <Text style={styles.pageSubtitle}>Enter OTP that is sent to your registered mobile number</Text>

      <InputWithLabelAndError
        value={otp}
        errorMessage={''}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={true}
        maxLength={4}
        textAlign={'center'}
        onChangeText={(text: string) => setOtp(text)}
        inputLabel={' '}
        style={{ letterSpacing: 40 }}
        keyboardType={'number-pad'}
        autoFocus />

      <Pressable style={styles.submitCta} onPress={otpSubmitHandler}>
        <Text style={styles.submitCtaLabel}>Submit</Text>
      </Pressable>
    </ScrollView>
  )
}

export default EnterOtpForPinChange

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    padding: 8
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
    textTransform:'uppercase'
  }
})