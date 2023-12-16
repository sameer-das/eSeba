import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Pressable, StyleSheet, Text, View, Alert } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../constants/colors';
import { AuthContext } from '../../context/AuthContext';


const ProfileMainScreen = () => {
    const navigation = useNavigation<any>();
    const { logout } = useContext(AuthContext);

    const onLogout = () => {
        Alert.alert('Are you sure to logout?', undefined, [{
            text: 'Sure',
            onPress: () => { logout() }
        }, {
            text: 'No',
            onPress: () => { }
        }])
    }

    return <View style={styles.rootContainer}>
        <View>
            <Pressable style={styles.profileButton} onPress={() => { navigation.push('profile') }}>
                <Text style={styles.profileButtonLanbel}>Profile</Text>
                <MaterialIcon name='keyboard-arrow-right' size={20} color={colors.white} />
            </Pressable>
            <Pressable style={styles.profileButton} onPress={() => { navigation.push('documents') }}>
                <Text style={styles.profileButtonLanbel}>My Documents</Text>
                <MaterialIcon name='keyboard-arrow-right' size={20} color={colors.white} />
            </Pressable>
            <Pressable style={styles.profileButton} onPress={() => { navigation.push('changePassword') }}>
                <Text style={styles.profileButtonLanbel}>Change Password</Text>
                <MaterialIcon name='keyboard-arrow-right' size={20} color={colors.white} />
            </Pressable>
            <Pressable style={styles.profileButton} onPress={() => { navigation.push('aboutEPayMain') }}>
                <Text style={styles.profileButtonLanbel}>About e-Pay</Text>
                <MaterialIcon name='keyboard-arrow-right' size={20} color={colors.white} />
            </Pressable>
        </View>
        <Pressable style={styles.profileButton} onPress={onLogout}>
            <Text style={styles.profileButtonLanbel}>Logout</Text>
            <MaterialIcon name='logout' size={20} color={colors.white} />
        </Pressable>
    </View>
}

/*
  
*/

export default ProfileMainScreen

const styles = StyleSheet.create({
    rootContainer: {
        backgroundColor: colors.white,
        flex: 1,
        padding: 8,
        justifyContent: 'space-between'
    },
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