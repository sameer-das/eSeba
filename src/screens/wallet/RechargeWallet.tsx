import { StyleSheet, Text, View, TextInput, Pressable, NativeModules, DeviceEventEmitter } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import colors from '../../constants/colors'
import { AuthContext } from '../../context/AuthContext'
import { useNavigation } from '@react-navigation/native'
const { CCAvenueBridgeModule } = NativeModules;

const RechargeWallet = () => {
  const { userData } = useContext(AuthContext);
  const [amount, setAmount] = useState('');
  const navigation = useNavigation<any>();

  useEffect(() => {
    const eventListener = DeviceEventEmitter.addListener('EventReminder', event => {
      // console.log(event.eventProperty) //  

      if(event.eventProperty === 'move_to_top') {
        navigation.popToTop();
      }

    });

    // Removes the listener once unmounted
    return () => {
      console.log('Native event listener removed in RechargeWallet component');
      eventListener.remove();
    };

  }, []);

  return (
    <View style={styles.rootContainer}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Please enter amount to recharge</Text>
        <TextInput style={styles.input}
          placeholder='0.00'
          value={amount}
          keyboardType='numeric'
          autoFocus
          onChangeText={(val) => setAmount(val)} />
      </View>

      <Pressable style={styles.rechargeButton} onPress={() => {
        if (!amount)
          return;
        // navigation.navigate('confirmWalletRechargePage', { amount: amount })

        const redirect_url: string = `https://api.esebakendra.com/api/GSKRecharge/CCAvenueCallBack`;
        const CCAVENUE_URL = `https://esebakendra.com/esk/ccavenuemobile?email=${userData.user.user_EmailID}&mobile=${userData.user.mobile_Number}&amount=${amount}&redirectUrl=${redirect_url}`
        // console.log('PAYMENT_URL : ' + CCAVENUE_URL);
        CCAvenueBridgeModule
          .openWebView(CCAVENUE_URL, (err: any, message: string) => {
            if (err) return;
            console.log('Messsage from java ' + message)
          });
      }}>
        <Text style={styles.rechargeButtonLabel}>Proceed</Text>
      </Pressable>
    </View>
  )
}

export default RechargeWallet

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 8
  },
  inputContainer: {
    marginTop: 8
  },
  inputLabel: {
    fontSize: 18,
    color: colors.primary500,
    marginVertical: 4,
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 2,
    borderColor: colors.primary100,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 32,
    color: colors.primary500,
    borderRadius: 8,
    // textAlign: 'center'

  },
  rechargeButton: {
    paddingVertical: 16,
    backgroundColor: colors.primary500,
    borderRadius: 8,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rechargeButtonLabel: {
    color: colors.white,
    fontSize: 18
  }
})