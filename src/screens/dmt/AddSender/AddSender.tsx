import { useNavigation } from '@react-navigation/native'
import React, { useContext, useState } from 'react'
import { Alert, NativeModules, Pressable, StyleSheet, Text, View } from 'react-native'
import { registerSenderInfo } from '../../../API/services'
import AnimatedInput from '../../../components/AnimatedInput'
import Loading from '../../../components/Loading'
import colors from '../../../constants/colors'
import { AuthContext } from '../../../context/AuthContext'
const { CCAvenueBridgeModule } = NativeModules;
import * as convert from 'xml-js';
import { encode } from 'base-64';

import x from './string';

const AddSender = () => {
  const navigation = useNavigation<any>();
  const [fullname, setFullname] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [aadharErrorMessage, setAadharErrorMessage] = useState('');
  const [isNeft, setIsNeft] = useState<boolean>(false);
  const [isCaptureDisabled, setIsCaptureDisabled] = useState<boolean>(true);
  const { userData } = useContext(AuthContext);


  const [isLoading, setIsLoading] = useState(false);
  const [fingerData, setFingerData] = useState('');




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
      "senderPin": userData.personalDetail.user_Pin,
      "bankId": "FINO",
      "skipVerification": "N",
      "aadharNumber": aadhar,
      "bioPid": encode(fingerData),
      "bioType": "FIR"
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
                navigation.replace('dmtAddSenderOtpScreen', {
                  "txnType": isNeft ? 'NEFT' : 'IMPS',
                  "additionalRegData": String(data.resultDt.additionalRegData),
                  "aadharNumber": aadhar,
                  "bioPid": encode(fingerData),
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


  const captureFingerPrintFromDevice = async () => {
    console.log('Calliing in captureFingerPrintFromDevice');
    try {
      setFingerData('');
      const PID_OPTION = '<!--?xml version="1.0"?-->' + '<PidOptions ver="1.0">' + '<Opts fCount="1" fType="2" iCount="0" pCount="0" format="0" pidVer="2.0" timeout="10000" wadh="18f4CEiXeXcfGXvgWA/blxD+w2pw7hfQPY45JMytkPw=" posh="UNKNOWN" env="P"> </Opts> </PidOptions>'
      let errorCode = '0';
      let errorMessage ='' ;
      
      // const res = await CCAvenueBridgeModule.getDeviceInfo();
      const res = await CCAvenueBridgeModule.capture(PID_OPTION);

      errorCode = getResponseCodeOfFingerData(res, 'errCode')
      errorMessage = getResponseCodeOfFingerData(res, 'errInfo')
      console.log(errorCode, typeof errorCode);
      console.log(errorMessage);

      if(res !== 'DNR' && res !== 'DNC') {

        if(errorCode === '0') {
          setFingerData(encode(res));
          Alert.alert('Success', 'Fingerprint read successfully');
        } else {
          // Show Alert
          Alert.alert('Error', getResponseCodeOfFingerData(res, 'errInfo'));
          setFingerData('');
        }
      } else {
        setFingerData('');
        // Show alert
      }
       
      console.log(res)
    } catch (error: any) {
      console.log("======================================= Error =================================");
      if(error.code === "INTENT_NOT_FOUND") {
        Alert.alert("Driver not found", "No application found to capture the fingerprint.");
      } else {
        Alert.alert("Driver not found", "No application found to capture the fingerprint.");
      }
    }
  }

  const goToOtp = () => {
    navigation.replace('dmtAddSenderOtpScreen', {
      "txnType": isNeft ? 'NEFT' : 'IMPS',
      "additionalRegData": 'NA',
      "aadharNumber": aadhar,
      "bioPid": fingerData,
    })
  }

  const discoverRdService = () => {
    const url = 'http://127.0.0.1:11100/';
    console.log('discoverRdService')
    const xhr = new XMLHttpRequest();

    xhr.open('RDSERVICE', url, true);
    xhr.setRequestHeader("Content-Type", "text/xml");
    xhr.setRequestHeader("Accept", "text/xml");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              console.log('if')
                console.log(xhr.responseText);
            }
            else {
              console.log('else')
                console.log(xhr.statusText)
            }
        }
    };

    xhr.send();
}

  const getResponseCodeOfFingerData = (str: string, key: string) => {
    const j = convert.xml2json(str, { compact: true })
    const res: any = JSON.parse(j);
    return res['PidData']['Resp']['_attributes'][key];
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
            if (!text || !aadhar)
              setIsCaptureDisabled(true)
            else
            setIsCaptureDisabled(false)
          }}
          inputLabel="Enter your full name"
          errorMessage="" />

        <AnimatedInput
          value={aadhar}
          onChangeText={(text: string) => {
            setAadhar(text);
            const reg = new RegExp('^[0-9]{12}$');
            const validAadhar = reg.test(text);
            if(validAadhar) {
              setAadharErrorMessage("");
            } else {
              setAadharErrorMessage("Please enter valid aadhar number");
            }
            if (!fullname || !text || !reg.test(text))
              setIsCaptureDisabled(true)
            else {
              setIsCaptureDisabled(false)
            }
          }}
          inputLabel="Enter your Aadhar Number"
          errorMessage={aadharErrorMessage} />
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


        {/* Capture Button */}
        <Pressable style={[styles.cta, { backgroundColor: isCaptureDisabled ? colors.primary100 : colors.primary500 }]} disabled={isCaptureDisabled} onPress={captureFingerPrintFromDevice}>
          <Text style={styles.ctaLabel}>Capture Finger Print</Text>
        </Pressable>
        {/* <Pressable style={[styles.cta, { backgroundColor: colors.primary500 }]} disabled={false} onPress={discoverRdService}>
          <Text style={styles.ctaLabel}>Discover</Text>
        </Pressable> */}

        {/* Submit Button   */}
        {
          fingerData && <Pressable style={[styles.cta, { backgroundColor: colors.primary500 }]}  onPress={handleSubmit}>
            <Text style={styles.ctaLabel}>Submit</Text>
          </Pressable>
        }

        {/* <Text>{fingerData}</Text> */}

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
    marginBottom: 0,
    marginTop: 16
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