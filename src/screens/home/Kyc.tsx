import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React, { useState } from 'react'
import colors from '../../constants/colors'
import ImagePicker from 'react-native-image-crop-picker';


const Kyc = () => {
  const [img, setImg] = useState('https://api.esebakendra.com/api/User/Download?fileName=111122223333Front.jpg')
  return (
    <View style={styles.rootContainer}>
      <Text style={{ fontSize: 24, color: colors.primary500 }}>Update KYC</Text>
{/* 
      <Image source={
        { uri: 'https://api.esebakendra.com/api/User/Download?fileName=111122223333Front.jpg' }
        } style={{ width: '200', height: '300' }} /> */}

      <Pressable onPress={() => {
        ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: true,
          includeBase64: true
        }).then(image => {
          console.log(image);
        }).catch(x => {
          console.log(x)
        });
      }}>
        <Text>Open</Text>
      </Pressable>
    </View>
  )
}

export default Kyc

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white
  }
})