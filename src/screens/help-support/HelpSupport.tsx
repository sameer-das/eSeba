import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../../constants/colors'

const HelpSupport = () => {
  return (
    <View style={styles.rootContainer}>
    <Text style={{fontSize: 24, color: colors.primary500}}>Support</Text>
    <Text style={{fontSize: 18, color: colors.primary500}}>This feature is coming soon</Text>
  </View>
  )
}

export default HelpSupport

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent:'center',
    alignItems:'center'
  }
})