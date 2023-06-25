import { StyleSheet, Text, View, BackHandler } from 'react-native'
import React, {useEffect} from 'react'
import colors from '../../constants/colors'
import { useNavigation, useRoute } from '@react-navigation/native'

const PrepaidTransactionStatus = () => {
    const route = useRoute();
    const navigation = useNavigation<any>();

    const handleBackButton = () => {
        // console.log('back button pressed'); 
        navigation.popToTop(); // goes to the main screen
        return true; // do not default go back if true
    }
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton)
        }
    }, []);



    return (
        <View style={styles.rootContainer}>
            <Text style={styles.headerLabel}>Success</Text>
            <View style={styles.render}>
                <Text style={{ fontSize: 16, color: colors.white, textAlign: 'center' }}>{(route.params as any).message}</Text>
            </View>
        </View>
    )
}

export default PrepaidTransactionStatus

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: colors.primary500,
        alignItems: 'center',
        padding: 8
    },
    headerLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white
    },
    render: {
        marginTop: 20
    }
})