import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Pressable, Alert } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import colors from '../../../constants/colors'
import AnimatedInput from '../../../components/AnimatedInput'

import SelectBoxWithLabelAndError from '../../../components/SelectBoxWithLabelAndError';
import ButtonPrimary from '../../../components/ButtonPrimary';
import { useNavigation } from '@react-navigation/native';
import { getAllDmtBank, registerRecipient } from '../../../API/services';
import { AuthContext } from '../../../context/AuthContext';
import Loading from '../../../components/Loading';


const AddRecipient = () => {

  const navigation = useNavigation();

  const { userData } = useContext(AuthContext);

  const [banks, setBanks] = useState([]);

  const [formValue, setFormValue] = useState<any>({
    fullName: { value: '', error: '', pattern: '', required: true },
    mobileNo: { value: '', error: '', pattern: new RegExp(/^((\\+91-?)|0)?[0-9]{10}$/), required: true },
    recipientBank: { value: {}, error: '', pattern: '', required: true },
    acNo: { value: '', error: '', pattern: new RegExp(/^[0-9]*$/), required: true },
    confirmAcNo: { value: '', error: '', pattern: new RegExp(/^[0-9]*$/), required: true },
    ifsc: { value: '', error: '', pattern: '', required: true },
  });

  const [isNeft, setIsNeft] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);



  const requiredErrorMessage: any = {
    fullName: `Please enter recipient's full name`,
    mobileNo: `Please enter recipient's mobile no`,
    acNo: `Please enter recipient's Ac No`,
    confirmAcNo: `Please confirm recipient's Ac No`,
    recipientBank: `Please choose recipient's Bank`,
    ifsc: 'Please enter branch IFSC'
  }

  const patternErrorMessage: any = {
    mobileNo: 'Mobile number should be of only 10 digits',
    acNo: 'Alphabets and special characters are not allowed!',
    confirmAcNo: `Alphabets and special characters are not allowed!`,
  }

  const handleInputChange = (text: string, keyName: string) => {
    let errorMessage = '';

    if (formValue[keyName].required && text.trim() === '') {
      errorMessage = requiredErrorMessage[keyName];
    } else if (formValue[keyName].pattern !== '' && !(formValue[keyName].pattern.test(text.trim())))
      errorMessage = patternErrorMessage[keyName];

    const obj = { ...formValue[keyName], value: text.trim(), error: errorMessage }
    setFormValue({ ...formValue, [keyName]: obj });
  }

  const fetchAllDMTBanks = async () => {
    setIsLoading(true);
    try {
      const { data } = await getAllDmtBank();
      setIsLoading(false);
      console.log(data);

      if (data.status === "Success" && data.code === 200) {
        setBanks(data?.data?.bankList?.bankInfoArray);
      } else {
        Alert.alert('Fail', 'Failed to fetch bank details. Please try after sometime.')
      }
    } catch (e) {
      setIsLoading(false);
      Alert.alert('Error', 'Error while fetching bank details. Please try later.')
      console.log('Error while fetching DMT banks');
      console.log(e)
    }

  }

  const validateFormOnCtaPress = () => {
    const keyNames = ['fullName', 'mobileNo', 'acNo', 'confirmAcNo', 'ifsc'];
    let bRet = true;
    keyNames.forEach(keyName => {
      let errorMessage = '';
      // console.log('checking ' + keyName)
      if (formValue[keyName].required && formValue[keyName].value.trim() === '') {
        // console.log(keyName + ' not filled');
        errorMessage = requiredErrorMessage[keyName];
      } else if (formValue[keyName].pattern !== '' && !(formValue[keyName].pattern.test(formValue[keyName].value.trim()))) {
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

    // console.log(formValue.recipientBank.value)
    if (!formValue.recipientBank?.value?.bankCode || formValue.recipientBank?.value?.bankCode === '') {
      // console.log('inside if')
      const obj = { ...formValue['recipientBank'], value: { ...formValue['recipientBank'].value }, error: requiredErrorMessage['recipientBank'] };
      // console.log(obj)
      setFormValue((currentFormValue: any) => {
        return { ...currentFormValue, 'recipientBank': obj }
      });

      bRet = false;
    }

    return bRet;

  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Add DMT Recipient focus');
      fetchAllDMTBanks();
    });
    return unsubscribe;
  }, [])


  const onAddRecipient = async () => {
    if (validateFormOnCtaPress()) {
      
      if (formValue.acNo.value.trim() !== formValue.confirmAcNo.value.trim()) {
        Alert.alert('Ac No Mismatch', 'Provided account number did not match. Please check.');
        return;
      }

      console.log('Go for add DMT Recipient');

      const payload = {
        "requestType": "RegRecipient",
        "senderMobileNumber": userData.user.mobile_Number,
        "txnType": isNeft ? 'NEFT' : 'IMPS',
        "recipientName": formValue.fullName.value,
        "recipientMobileNumber": formValue.mobileNo.value,
        "bankCode": formValue.recipientBank.value.bankCode,
        "bankAccountNumber": formValue.acNo.value,
        "ifsc": formValue.ifsc.value
      }

      console.log(payload)

      setIsLoading(true);
      try {
        const { data } = await registerRecipient(payload);
        setIsLoading(false);
        console.log(data)
        if (data.status === 'Success' && data.code === 200) {
          if (data.resultDt.responseReason === 'Successful' && data.resultDt.responseCode == 0) {
            Alert.alert('Success', 'Recipient added successfully.');
            navigation.goBack();
          } else {
            Alert.alert('Fail', 'Failed while adding recipient. Please try after sometime.')
          }
        } else {
          Alert.alert('Fail', 'Failed while adding recipient. Please try after sometime.')
        }
      } catch (e) {
        console.log('Error while adding recipient');
        console.log(e);
        Alert.alert('Error', 'Error while adding recipient. Please try after sometime.')
        setIsLoading(false);
      }

    } else {
      Alert.alert('Invalid Input(s)', 'One or more fields are invalid! Please check.');
    }

  }


  if (isLoading)
    return <Loading label="Loading..." />

  return (
    <ScrollView style={styles.rootContainer}>
      <KeyboardAvoidingView>
        <Text style={styles.pageHeader}>Add Recipient</Text>
        <View style={{ marginBottom: 40 }}>

          <AnimatedInput
            value={formValue.fullName.value}
            onChangeText={(text: string) => handleInputChange(text, 'fullName')}
            inputLabel={`Enter Recipient's Full Name`}
            errorMessage={formValue.fullName.error}
          />
          <AnimatedInput
            value={formValue.mobileNo.value}
            onChangeText={(text: string) => handleInputChange(text, 'mobileNo')}
            inputLabel={`Enter Recipient's Mobile No.`}
            errorMessage={formValue.mobileNo.error}
          />

          <SelectBoxWithLabelAndError listData={banks}
            label={`Choolse Recipient's Bank`}
            placeholder={'Select'}
            value={formValue.recipientBank.value.bankName}

            optionLable={(curr: any) => { return curr.bankName }}
            searchKey='bankName'
            errorMessage={formValue.recipientBank.error}
            onSelectionChange={(item: any) => {
              const obj = { ...formValue.recipientBank, value: item, error: '' }
              setFormValue({ ...formValue, recipientBank: obj });
            }} />

          <AnimatedInput
            value={formValue.ifsc.value}
            onChangeText={(text: string) => handleInputChange(text, 'ifsc')}
            inputLabel={`Enter IFSC of Branch`}
            errorMessage={formValue.ifsc.error}
          />
          <AnimatedInput
            value={formValue.acNo.value}
            onChangeText={(text: string) => handleInputChange(text, 'acNo')}
            inputLabel={`Enter Account Number`}
            errorMessage={formValue.acNo.error}
            secureTextEntry={true}
          />
          <AnimatedInput
            value={formValue.confirmAcNo.value}
            onChangeText={(text: string) => handleInputChange(text, 'confirmAcNo')}
            inputLabel={`Confirm Account Number`}
            errorMessage={formValue.confirmAcNo.error}
          />

          <Text style={{ color: colors.primary500, fontSize: 16, marginTop: 20, fontWeight: 'bold' }}>Choose Transaction Type</Text>
          <View style={styles.transTypeButtonContainer}>
            <Pressable onPress={() => { setIsNeft(false) }} style={[styles.transTypeButton, { backgroundColor: !isNeft ? colors.primary500 : colors.white }]}>
              <Text style={[styles.transTypeButtonLabel, { color: !isNeft ? colors.white : colors.primary500 }]}>IMPS</Text>
            </Pressable>
            <Pressable onPress={() => { setIsNeft(true) }} style={[styles.transTypeButton, { backgroundColor: isNeft ? colors.primary500 : colors.white }]}>
              <Text style={[styles.transTypeButtonLabel, { color: isNeft ? colors.white : colors.primary500 }]}>NEFT</Text>
            </Pressable>
          </View>


          <View style={{ marginTop: 40 }}>
            <ButtonPrimary label='Add Recipient' onPress={onAddRecipient} />
          </View>


        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}

export default AddRecipient

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    padding: 8,
    backgroundColor: colors.white
  },
  pageHeader: {
    fontSize: 24,
    color: colors.primary500,
    textAlign: 'center',
    fontWeight: 'bold'
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