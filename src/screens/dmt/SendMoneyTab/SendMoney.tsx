import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../../../constants/colors'

const SendMoney = () => {
  return (
    <View style={styles.rootContainer}>
      <Text style={{fontSize:24, color:colors.primary500}}>Send Money</Text>
    </View>
  )
}

export default SendMoney

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center'
},
})