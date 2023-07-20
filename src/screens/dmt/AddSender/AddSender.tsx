import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useState } from 'react'
import colors from '../../../constants/colors'
import InputWithLabelAndError from '../../../components/InputWithLabelAndError'
import SelectBoxWithLabelAndError from '../../../components/SelectBoxWithLabelAndError'

const AddSender = () => {
  const [fullname, setFullname] = useState('');
  const [isNeft, setIsNeft] = useState<boolean>(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.pageHeader}>DMT Sender Registration</Text>
      <View style={styles.formContainer}>
        <InputWithLabelAndError
          value={fullname}
          onChangeText={(text: string) => {
            setFullname(text);
            if (!text)
              setIsSubmitDisabled(true)
            else
              setIsSubmitDisabled(false)
          }}

          placeholder="Full name"
          inputLabel="Enter your full name"
          errorMessage="" />

        <View>
          <Text style={styles.label}>Choose Trnasaction Type</Text>

          <View style={styles.transTypeButtonContainer}>
            <Pressable onPress={() => {setIsNeft(false)}} style={[styles.transTypeButton, {backgroundColor: !isNeft ? colors.primary500 : colors.white}]}>
              <Text style={[styles.transTypeButtonLabel, {color: !isNeft ? colors.white : colors.primary500}]}>IMPS</Text>
            </Pressable>
            <Pressable onPress={() => {setIsNeft(true)}} style={[styles.transTypeButton, {backgroundColor: isNeft ? colors.primary500 : colors.white}]}>
              <Text style={[styles.transTypeButtonLabel, {color: isNeft ? colors.white : colors.primary500}]}>NEFT</Text>
            </Pressable>
          </View>
        </View>


        <Pressable style={[styles.cta, { backgroundColor: isSubmitDisabled ? colors.primary100 : colors.primary500 }]} disabled={isSubmitDisabled}>
          <Text style={styles.ctaLabel}>Submit</Text>
        </Pressable>

      </View>
    </View>
  )
}

export default AddSender

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 8,
    paddingTop:32
  },
  pageHeader: {
    fontSize: 24,
    color: colors.primary500,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  formContainer: {
    marginTop: 20
  },
  cta: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  ctaLabel: {
    color: colors.white,
    fontSize: 24,
    textAlign: 'center'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary500,
    marginBottom: 4
  },
  transTypeButtonContainer: {
    flexDirection: 'row',
    height: 60,
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