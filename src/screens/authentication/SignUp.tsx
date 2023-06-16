import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const SignUp = () => {
  return (
    <View style={styles.rootContainer}>
      <Text>SignUp</Text>
    </View>
  )
}

export default SignUp

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        justifyContent:'center',
        alignItems: 'center'
    }
})