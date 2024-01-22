import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import colors from '../../constants/colors'
import { useNavigation } from '@react-navigation/native';

const AboutEPayMain = () => {
    const navigation = useNavigation<any>();
    return (
        <View style={{ flex: 1, backgroundColor: colors.white, padding: 8 }}>
            <View style={{ marginTop: 16 }}>
                <Pressable style={styles.profileButton} onPress={() => { navigation.push('policyDetails', { policy: 'about-us.html' }) }}>
                    <Text style={styles.profileButtonLanbel}>About Us</Text>
                    {/* <MaterialIcon name='keyboard-arrow-right' size={20} color={colors.white} /> */}
                </Pressable>
                <Pressable style={styles.profileButton} onPress={() => { navigation.push('policyDetails', { policy: 'privacy-policy.html' }) }}>
                    <Text style={styles.profileButtonLanbel}>Privacy Policy</Text>
                    {/* <MaterialIcon name='keyboard-arrow-right' size={20} color={colors.white} /> */}
                </Pressable>
                <Pressable style={styles.profileButton} onPress={() => { navigation.push('policyDetails', { policy: 'terms-and-conditions.html' }) }}>
                    <Text style={styles.profileButtonLanbel}>Terms and Conditions</Text>
                    {/* <MaterialIcon name='keyboard-arrow-right' size={20} color={colors.white} /> */}
                </Pressable>
                <Pressable style={styles.profileButton} onPress={() => { navigation.push('policyDetails', { policy: 'return-and-refund-policy.html' }) }}>
                    <Text style={styles.profileButtonLanbel}>Refund and Return Policy</Text>
                    {/* <MaterialIcon name='keyboard-arrow-right' size={20} color={colors.white} /> */}
                </Pressable>
            </View>
        </View>
    )
}

export default AboutEPayMain

const styles = StyleSheet.create({
    profileButton: {
        backgroundColor: colors.primary500,
        height: 50,
        borderRadius: 4,
        justifyContent: 'space-between',
        marginBottom: 8,
        flexDirection: 'row',
        paddingHorizontal: 16,
        alignItems: 'center'
    },
    profileButtonLanbel: {
        fontSize: 16,
        color: colors.white,
        // paddingLeft: 16
    }
})