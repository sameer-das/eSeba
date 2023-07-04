import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'
import colors from '../constants/colors'

const InputWithLabelAndError = ({ value, onChangeText, placeholder, errorMessage, inputLabel, keyboardType, maxLength, autoCapitalize, autoCorrect, secureTextEntry, style, ...props }: any) => {

    // const borderStyle = errorMessage === '' ? {borderColor: colors.secondary100} 
    // : {borderColor: colors.primary100} 
    const borderStyle = { borderColor: colors.primary100 }

    return (
        <View style={{ marginVertical: 2 }}>
            <Text style={styles.textInputLabel}>{inputLabel}</Text>
            <TextInput style={[styles.textInput, borderStyle, style]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                keyboardType={keyboardType ? keyboardType : 'default'}
                maxLength={maxLength}
                autoCapitalize={autoCapitalize}
                autoCorrect={autoCorrect}
                secureTextEntry={secureTextEntry}
                {...props}
            />
            <Text style={styles.textInputErrorLabel}>{errorMessage}</Text>
        </View>
    )
}

export default InputWithLabelAndError

const styles = StyleSheet.create({
    textInput: {
        borderWidth: 2,
        borderColor: colors.primary100,
        paddingHorizontal: 8,
        paddingVertical: 8,
        fontSize: 16,
        color: colors.primary500,
        borderRadius: 8,
        width: '100%',
    },
    textInputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary500,
        marginBottom: 4
    },
    textInputErrorLabel: {
        fontSize: 14,
        color: colors.secondary500,
        fontWeight: 'bold'
    },
})