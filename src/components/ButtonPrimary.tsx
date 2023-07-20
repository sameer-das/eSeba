import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import colors from '../constants/colors'

interface ButtonPrimaryProps {
    onPress: (event: any) => void, label: string, buttonStyle?: Object, buttonLabelStyle?: Object,
}

const ButtonPrimary = ({ onPress, label, buttonStyle, buttonLabelStyle }: ButtonPrimaryProps) => {
    return (
        <Pressable style={[styles.button, buttonStyle]} onPress={onPress} >
            <Text style={[styles.buttonText, buttonLabelStyle]}>{label}</Text>
        </Pressable>
    )
}

export default ButtonPrimary

const styles = StyleSheet.create({
    button: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary500,
        borderRadius: 4,
        flexDirection: 'row',
        width:'100%'
    },
    buttonText: {
        color: colors.white,
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 18.4,
        textAlign: 'center'
    },
})