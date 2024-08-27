import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import SelectBoxWithLabelAndError from '../../components/SelectBoxWithLabelAndError'
import ButtonPrimary from '../../components/ButtonPrimary'
import AnimatedInput from '../../components/AnimatedInput'

interface Option {name: string, value: string | number};

const usedAadharOptions: Option[] = [
    { name: 'Yes', value: 'yes', },
    { name: 'No', value: 'no', },
]


const AadharBasicForm = () => {
    const [haveUsedAadhar, setHaveUsedAadhar] = useState<Option>();
    const [nseitNumber, setNseitNumber] = useState<string>();


    return (
        <View>
            <Text>AadharBasicForm</Text>
            <SelectBoxWithLabelAndError listData={usedAadharOptions}
                label={'Have you used aadhar service before?'}
                placeholder={'Select'}
                errorMessage={''}
                value={haveUsedAadhar}
                optionLable={(curr: any) => { return curr.name }}
                searchKey='name'
                onSelectionChange={(item: any) => {
                    setHaveUsedAadhar(item);
                }} />

            {haveUsedAadhar?.value === 'yes' && <AnimatedInput
                value={nseitNumber}
                onChangeText={(text: string) => setNseitNumber(text)}
                inputLabel={'Enter NSEIT'} />}

            <ButtonPrimary onPress={() => {
                console.log(haveUsedAadhar)
            }} label="click" />
        </View>
    )
}

export default AadharBasicForm

const styles = StyleSheet.create({})