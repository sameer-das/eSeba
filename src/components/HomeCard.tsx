import { StyleSheet, Text, View, FlatList, Image, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import colors from '../constants/colors';
import { windowHeight, windowWidth } from '../utils/dimension';
import { useNavigation } from '@react-navigation/native';
import { IamgeMapping } from '../constants/billers-mapping';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeCard = ({ item }: { item: any }) => {
    const [col] = useState(4);
    const navigation = useNavigation<any>();

    const handleCardItemPress = async (item: any) => {
        console.log('Pressed ' + JSON.stringify(item));
        if (item.services_Cat_Name === 'Mobile Prepaid') {
            navigation.navigate('prepaidRechargeStack');
        } else if (item.services_Cat_Name === 'DMT') {
            await AsyncStorage.setItem('currentServiceDetails', JSON.stringify(
                { services_id: item.services_ID, services_cat_id: item.services_Cat_ID }
            ));
            navigation.navigate('DMTStack')
        } else if (['PGDCA', 'DCA', 'PAN Card'].includes(item.services_Cat_Name)) {
            // No access as per Avinash from mobile
            Alert.alert('Limited Access', 'Please register as a retailer to avail these services. For more information, please contact us at Toll-Free No 1800 8904 368')
        } else if (['PMFBY'].includes(item.services_Cat_Name)) {
            Alert.alert('Coming Soon', 'This feature is not yet available.')
        }

        else {
            await AsyncStorage.setItem('currentServiceDetails', JSON.stringify(
                { services_id: item.services_ID, services_cat_id: item.services_Cat_ID }
            ));
            navigation.push('bbpsStack', { bbpsSeviceName: item.services_Cat_Name, path: item.route })
        }
    }


    const _renderCardItem = ({ item }: { item: any }) => {
        // console.log(item.services_Cat_ImagesName);
        const imageObj = IamgeMapping.find(img => img.name === item.services_Cat_ImagesName)
        const imageUri = imageObj?.imageUri;
        return (<Pressable style={styles.cardItem} onPress={() => handleCardItemPress(item)}>
            {/* For tab and mobile */}
            <Image source={imageUri}
                style={{ width: windowWidth > 500 ? (windowWidth / 20) : 36, height: windowWidth > 500 ? (windowWidth / 20) : 36 }} /> 
            <Text style={styles.cardItemLabel}>{item.services_Cat_Name}</Text>
        </Pressable>
        )
    }

    // calculation for dynamic height
    const noOfRow = Math.floor(item.services.length / 4) + 1;
    {/* For tab and mobile */}
    const tabHeight = noOfRow > 1 ?  ((Math.floor(windowWidth / 4) - 80) * noOfRow) + 120 : Math.floor(windowWidth / 4);
    const mobileHeight = noOfRow > 1 ?  (60 * noOfRow) + 140 : 140;
    return (
        <View style={[styles.homeCards, { height:windowHeight > 900 ? tabHeight : mobileHeight}]}>
            <Text style={styles.cardTitle}>{item.services_Name}</Text>
            <FlatList
                data={item.services}
                keyExtractor={(item) => item.services_Cat_ID}
                renderItem={_renderCardItem}
                numColumns={col}
            />
        </View>
    )

}

export default HomeCard

const styles = StyleSheet.create({
    homeCards: {
        backgroundColor: colors.homeScreenCardBg,
        borderRadius: 10,
        marginVertical: 6,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        color: colors.white,
        fontWeight: '600',
        marginVertical: 8,
    },
    cardItem: {
        // For tab and mobile
        height: windowWidth > 500 ? Math.floor(windowWidth / 4) - 80 : 70,
        width: windowWidth > 500 ? Math.floor(windowWidth / 4) - 25 : 70,
        marginHorizontal: 8,
        marginVertical: 8,
        alignItems: 'center',
        justifyContent:'center',
        // backgroundColor: 'cyan'
    },
    cardItemLabel: {
        // For tab and mobile
        fontSize: windowWidth > 500 ? (windowWidth / 60) : 12,
        fontWeight: '400',
        textAlign: 'center',
        color: colors.white,
        marginTop: 4
    }
})