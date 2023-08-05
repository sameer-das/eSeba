import { StyleSheet, Text, View, FlatList, Image, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import colors from '../constants/colors';
import { windowWidth } from '../utils/dimension';
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
            navigation.navigate('DMTStack')
        } else if (['PGDCA', 'DCA', 'Education Fee', 'PAN Card'].includes(item.services_Cat_Name)) {
            // No access as per Avinash from mobile
            Alert.alert('Limited Access', 'Please register as a retailer to avail these services. For more information, please contact us at Toll-Free No 1800 8904 368')
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
        const imageUri = imageObj.imageUri;
        return (<Pressable style={styles.cardItem} onPress={() => handleCardItemPress(item)}>
            <Image source={imageUri}
                style={{ width: 36, height: 36 }} />
            <Text style={styles.cardItemLabel}>{item.services_Cat_Name}</Text>
        </Pressable>
        )
    }

    // calculation for dynamic height
    const noOfRow = Math.floor(item.services.length / 4) + 1;
    const height = (Math.floor(windowWidth / 4) * noOfRow) + 60

    return (
        <View style={[styles.homeCards, { height: height }]}>
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
        marginTop: 8,
        padding: 10,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 20,
        color: colors.white,
        fontWeight: '600',
        marginVertical: 8,
    },
    cardItem: {
        height: Math.floor(windowWidth / 4) - 25,
        width: Math.floor(windowWidth / 4) - 25,
        // borderColor: colors.primary500,
        // borderWidth: 1,
        marginHorizontal: 8,
        marginVertical: 12,
        alignItems: 'center',
        // backgroundColor: colors.primary500,
        // padding: 6
        // textAlign: 'center'
    },
    cardItemLabel: {
        fontSize: 14,
        fontWeight: '400',
        textAlign: 'center',
        color: colors.white,
        marginTop: 4
    }
})