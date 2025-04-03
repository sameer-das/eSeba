import { StyleSheet, Text, ScrollView, KeyboardAvoidingView, View, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import colors from '../../../constants/colors'
import { useNavigation, useRoute } from '@react-navigation/native'
import AnimatedInput from '../../../components/AnimatedInput'
import { price_in_words } from '../../../utils/convertToWord'
import ButtonPrimary from '../../../components/ButtonPrimary'
import Loading from '../../../components/Loading'
import { getConveyanceFee } from '../../../API/services'

const SendMoneyForm = () => {
  const route = useRoute<any>();

  const [amount, setAmount] = useState('');
  const [amountInWords, setAmountInWords] = useState('');
  const [isNeft, setIsNeft] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(true);

  const navigation = useNavigation<any>();

  const amountChangeHandler = (text: string) => {
    setAmount(text);
    if (+text >= 100)
      setDisabled(false)
    else
      setDisabled(true)
    // setAmountInWords(price_in_words(text));
  }

  const onConfirmHandler = async () => {
    const convPayload = {
      "requestType": "GetCCFFee",
      "agentId": "",
      "txnAmount": "" + (+amount * 100), // convert to paisa 
    }
    console.log(convPayload);


    try {
      setIsLoading(true);
      const { data } = await getConveyanceFee(convPayload);
      setIsLoading(false);
      console.log('conv details ')
      console.log(data);

      if (data.code === 200 && data.status === "Success" &&
        data.resultDt?.responseCode === 0 && data.resultDt?.responseReason === "Successful") {
        navigation.push('showConveyanceFee', {
          amount: amount,
          custConvFee: data.resultDt?.custConvFee,
          transType: isNeft ? 'NEFT' : 'IMPS',
          ...route.params
        });
      } else {
        Alert.alert('Fail', 'Failed while fetching the conveyance fee for the transaction. Please try later.')
      }


    } catch (e) {
      setIsLoading(false);
      console.log(e)
      Alert.alert('Error', 'Error while fetching the conveyance fee for the transaction. Please try later.')

    }


  }


  if (isLoading)
    return <Loading label='Please wait' />
  return (
    <ScrollView contentContainerStyle={styles.rootContainer}>
      <KeyboardAvoidingView>

        <Text style={{ marginTop: 20, fontSize: 18, color: colors.primary500, fontWeight: 'bold' }}>Sending To:</Text>

        <View style={{ marginVertical: 8 }}>
          <Text style={{ fontSize: 16, color: colors.primary500 }}>Name: {route.params.recipientName}</Text>
          <Text style={{ fontSize: 16, color: colors.primary500 }}>AC No: {route.params.acNo}</Text>
          <Text style={{ fontSize: 16, color: colors.primary500 }}>Bank: {route.params.bankName}</Text>
          <Text style={{ fontSize: 16, color: colors.primary500 }}>ID: {route.params.recipientId}</Text>
        </View>

        <AnimatedInput
          value={amount}
          onChangeText={amountChangeHandler}
          inputLabel={`Enter Amount`}
          style={{ fontSize: 30 }}
          keyboardType='numeric'
        />
        <Text style={{ color: colors.primary200, fontSize: 16, fontStyle: 'italic' }}>Minimum amount must be Rs. 100 or more.</Text>
        {/* <Text style={{ fontSize: 16, color: colors.primary400, marginVertical: 4 }}> {amount && +amount > 0 ? `Rupees ${amountInWords} Only` : 'Enter amount to transfer'}</Text> */}

        <Text style={{ color: colors.primary500, fontSize: 16, marginTop: 20, fontWeight: 'bold' }}>Choose Transaction Type</Text>
        <View style={styles.transTypeButtonContainer}>
          <Pressable onPress={() => { setIsNeft(false) }} style={[styles.transTypeButton, { backgroundColor: !isNeft ? colors.primary500 : colors.white }]}>
            <Text style={[styles.transTypeButtonLabel, { color: !isNeft ? colors.white : colors.primary500 }]}>IMPS</Text>
          </Pressable>
          <Pressable onPress={() => { setIsNeft(true) }} style={[styles.transTypeButton, { backgroundColor: isNeft ? colors.primary500 : colors.white }]}>
            <Text style={[styles.transTypeButtonLabel, { color: isNeft ? colors.white : colors.primary500 }]}>NEFT</Text>
          </Pressable>
        </View>

        <View style={{ marginTop: 50 }}>
          <ButtonPrimary disabled={disabled} label='Confirm' onPress={onConfirmHandler} />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}

export default SendMoneyForm

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    padding: 8,
    backgroundColor: colors.white
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