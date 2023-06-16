import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext';
import colors from '../../constants/colors';

const SearchContact = () => {
    const { userData } = useContext(AuthContext);
    const [mobileNo, setMobileNo] = useState('');

    return (
        <View style={styles.rootContainer}>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Please enter mobile no or choose from contact</Text>
                <View style={styles.mobileNoInput}>
                    <Text style={styles.countryCode}>+91</Text>
                    <TextInput style={styles.input}
                        value={mobileNo}
                        keyboardType='number-pad'
                        autoFocus
                        onChangeText={(val) => setMobileNo(val)} />
                </View>
            </View>
        </View>
    )
}

export default SearchContact

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 8
    },
    inputContainer: {
        marginTop: 8
    },
    inputLabel: {
        fontSize: 18,
        color: colors.primary500,
        marginVertical: 4,
        fontWeight: 'bold'
    },
    mobileNoInput: {
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: colors.primary100,
        alignItems: 'center',
        paddingHorizontal: 8
    }, 
    countryCode: {
        fontSize: 20,
        color: colors.primary500,
        fontWeight: 'bold'
    },
    input: {
        fontSize: 20,
        color: colors.primary500,
        fontWeight: 'bold'
    },

})