import { StyleSheet, Text, ScrollView, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import colors from '../../../constants/colors'

const SendMoneyForm = () => {
  return (
    <ScrollView  contentContainerStyle={styles.rootContainer}>
      <Text style={{fontSize: 18, color:colors.primary500}}>SendMoneyForm</Text>
    </ScrollView>
  )
}

export default SendMoneyForm

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        padding: 8,
        backgroundColor: colors.white
    }
})