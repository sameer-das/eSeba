import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import colors from '../../../constants/colors'
import { useNavigation } from '@react-navigation/native'

const ListRecipient = () => {

    const navigation = useNavigation<any>()
    return (
        <View style={styles.rootContainer}>
            <View>
                <Pressable style={styles.addRecipientButton} onPress={() => navigation.push('AddRecipient')}>
                    <Text style={styles.addRecipientButtonLabel}>Add Recipient</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default ListRecipient

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        padding: 8
    },
    addRecipientButton: {
        paddingVertical: 8,
        paddingHorizontal: 8,
        alignItems: 'center',
        borderRadius: 8,
        flexDirection: 'row',
        marginTop: 16,
        justifyContent: 'space-around',
        backgroundColor: colors.primary500
    },
    addRecipientButtonLabel: {
        color: colors.white,
        fontSize: 24,
        textAlign: 'center'
    }
})