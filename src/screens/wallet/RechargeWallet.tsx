import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native'
import React, { useContext, useState } from 'react'
import colors from '../../constants/colors'
import { AuthContext } from '../../context/AuthContext'
import { useNavigation } from '@react-navigation/native'

const RechargeWallet = () => {
  const { userData } = useContext(AuthContext);
  const [amount, setAmount] = useState('');
  const navigation = useNavigation<any>()

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

        navigation.navigate('confirmWalletRechargePage', { amount: amount })
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