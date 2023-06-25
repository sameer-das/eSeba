import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import colors from '../constants/colors';
import { MobileOperatorLogoMapping } from '../constants/mobile-operator-logo-mapping';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ContactAndOperatorDetailCard = () => {
    const [mobileDetails, setMobileDetails] = useState<any>({});

    const logo = MobileOperatorLogoMapping.find(op => op.name.toLowerCase().includes(mobileDetails?.currentOperator?.toLowerCase()));
    const logoUri = logo?.imageUri || require('../../assets/logos/mobile-operators/jio.png');

    const readAsyncStorageForContact = async () => {
        const details = await AsyncStorage.getItem('rechargeContactDetail') || '{}';
        setMobileDetails(JSON.parse(details));
    }

    useEffect(() => {
        readAsyncStorageForContact();
    },[])

    return (
        <View style={styles.mobileDetials}>
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcon name='smartphone' size={40} color={colors.white} />
                    <View>
                        {mobileDetails?.contactName && <Text style={styles.contactName}>{mobileDetails?.contactName}</Text>}
                        <Text style={styles.mobileNoLabel}>{mobileDetails?.mobileNo}</Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 20, marginTop: 24 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcon name='signal-cellular-alt' size={30} color={colors.primary500} />
                        <Text style={styles.mobileOperatorLabel}> {mobileDetails?.currentOperator}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcon name='location-on' size={30} color={colors.primary500} />
                        <Text style={styles.mobileCircleLable}> {mobileDetails?.currentLocation}</Text>
                    </View>
                </View>

            </View>

            <Image source={logoUri} style={{ width: 80, height: 80 }} />
        </View>
    )
}

export default ContactAndOperatorDetailCard

const styles = StyleSheet.create({
    mobileDetials: {
        padding: 8,
        backgroundColor: colors.primary200,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    mobileNoLabel: {
        fontSize: 16,
        color: colors.white,
    },
    contactName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.white,
    },
    mobileOperatorLabel: {
        fontSize: 16,
        color: colors.white,
    },
    mobileCircleLable: {
        fontSize: 16,
        color: colors.white,
    },
})