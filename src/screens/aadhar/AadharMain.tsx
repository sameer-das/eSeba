import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../../constants/colors'
import AadharBasicForm from './AadharBasicForm'

const AadharMain = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Aadhar Service</Text>
            <AadharBasicForm />
        </View>
    )
}

export default AadharMain

const styles = StyleSheet.create({
    container: {
        flex: 1,        
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary500,
        textAlign: 'center',
        marginVertical: 20
    }
})