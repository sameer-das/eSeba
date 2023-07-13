import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useState } from 'react'
import colors from '../../constants/colors'
import InputWithLabelAndError from '../../components/InputWithLabelAndError'
import SelectBoxWithLabelAndError from '../../components/SelectBoxWithLabelAndError'

const AddSender = () => {
  const [fullname, setFullname] = useState('');
  const [transType, setTransYype] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const txnType = [
    { label: 'IMPS', value: 'IMPS' },
    { label: 'NEFT', value: 'NEFT' },
  ]
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.pageHeader}>DMT Sender Registration</Text>
      <View style={styles.formContainer}>
        <InputWithLabelAndError
          value={fullname}
          onChangeText={(text: string) => {
            setFullname(text);
            if (!text || !transType)
              setIsSubmitDisabled(true)
            else 
              setIsSubmitDisabled(false)
            }}

          placeholder="Full name"
          inputLabel="Enter your full name"
          errorMessage="" />

        <SelectBoxWithLabelAndError
          label={'Select Trancation Type'}
          placeholder={'Select Trans Type'}
          errorMessage=""
          listData={txnType}
          value={transType}
          optionLable={(curr: any) => { return curr.label }}
          onSelectionChange={(item: any) => {
            if (!item.value || !fullname)
              setIsSubmitDisabled(true)
            else 
              setIsSubmitDisabled(false)
            setTransYype(item.value)
          }}

        />

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
    padding: 8
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
    // backgroundColor: colors.primary500,
    borderRadius: 8,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  ctaLabel: {
    color: colors.white,
    fontSize: 24,
    textAlign: 'center'
  },
})