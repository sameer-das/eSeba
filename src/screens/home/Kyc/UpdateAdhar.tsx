import { Pressable, StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import colors from '../../../constants/colors'
import ImagePicker from 'react-native-image-crop-picker';
import InputWithLabelAndError from '../../../components/InputWithLabelAndError';
import CustomImagePicker from '../../../components/CustomImagePicker';


const UpdateAdhar = () => {
  const [adharNo, setAdharNo] = useState<string>('');
  const [adharFront, setAdharFront] = useState<any>('');
  const [adharBack, setAdharBack] = useState<string>('');

  return (
    <ScrollView style={styles.rootContainer}>
      <Text style={styles.pageTitle}>Update Your Adhar Details</Text>
      <View style={styles.formCard}>

        {/* Adhar number */}
        <InputWithLabelAndError
          value={adharNo}
          onChangeText={(text: string) => setAdharNo(text)}
          placeholder='Enter Adhar Number'
          inputLabel='Enter Adhar Number'
          keyboardType='numeric'
        />
        {/* Adhar Front */}
        <CustomImagePicker value={adharFront} setValue={setAdharFront} placeholder='Tap to upload Adhar front side pic' label='Adhar front side pic' />

        {/* Adhar Back */}
        <CustomImagePicker value={adharBack} setValue={setAdharBack} placeholder='Tap to upload Adhar back side pic'  label='Adhar back side pic'/>


        <Pressable style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Upload and Update Details</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

export default UpdateAdhar

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    padding: 8,
    backgroundColor: colors.white,
  }, pageTitle: {
    fontSize: 24,
    color: colors.primary500,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  formCard: {
    marginTop: 24
  },
  imageUploadSection: { marginBottom: 20 },
  adharFrontPicContainer: {
    height: 180,
    borderColor: colors.primary500,
    borderWidth: 1,
    borderRadius: 8
  },
  centerText: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  uploadText: {
    fontSize: 16,
    color: colors.primary100
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary500,
    marginBottom: 4
  },
  imageBottomControlContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  uploadAgainText: {
    fontSize: 16,
    color: colors.primary100,
    fontStyle: 'italic'
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: colors.secondary500,
  },
  deleteButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold'
  },
  uploadButton: {
    paddingVertical: 16,
    backgroundColor: colors.primary500,
    alignItems: 'center',
    borderRadius: 8
  },
  uploadButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})