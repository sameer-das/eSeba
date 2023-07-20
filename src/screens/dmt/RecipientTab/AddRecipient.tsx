import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import colors from '../../../constants/colors'
import AnimatedInput from '../../../components/AnimatedInput'
import { Formik } from 'formik';
import { object, string, number, mixed } from 'yup';
import SelectBoxWithLabelAndError from '../../../components/SelectBoxWithLabelAndError';


const AddRecipient = () => {



  return (
    <ScrollView style={styles.rootContainer}>
      <KeyboardAvoidingView>
        <Text style={styles.pageHeader}>Add Recipient</Text>
        <View>
{/* 
          <AnimatedInput
            value={values.fullName}
            onChangeText={handleChange('fullName')}
            inputLabel={'Enter your full name'}
            errorMessage={errors.fullName}`
          />
          <AnimatedInput
            value={values.mobileNo}
            onChangeText={handleChange('mobileNo')}
            inputLabel={'Enter Mobile No'}
            errorMessage={touched.mobileNo && errors.mobileNo}
          />
          <SelectBoxWithLabelAndError
            errorMessage=""
            onSelectionChange={(e: any) => { setFieldValue('bank', e) }}
            value={values.bank.name}
            label="Select Bank"
            placeholder="Select Bank"
            listData={banks}
            optionLable={(bank: any) => bank.name} /> */}

          <Pressable onPress={() => { }}>
            <Text style={{ color: colors.primary500 }}>Press me</Text>
          </Pressable>

        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}

export default AddRecipient

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    padding: 8,
  }, pageHeader: {
    fontSize: 24,
    color: colors.primary500,
    textAlign: 'center',
    fontWeight: 'bold'
  },
})