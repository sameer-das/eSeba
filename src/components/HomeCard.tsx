import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState, useEffect } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { USER_TYPE, getUserVerifiedAdharaDetails } from '../API/services';
import { IamgeMapping } from '../constants/billers-mapping';
import colors from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import { windowHeight, windowWidth } from '../utils/dimension';

const HomeCard = ({ item }: { item: any }) => {
    const [col] = useState(4);
    const navigation = useNavigation<any>();
    const { userData } = useContext(AuthContext);


    const handleCardItemPress = async (item: any) => {
        console.log('Pressed ' + JSON.stringify(item));

        if([1,2].includes(userData.user.user_Type_ID)) {
            try {
                const {data: resp} = await getUserVerifiedAdharaDetails (userData.user.user_ID);
                if(resp.status === 'Success' && resp.code === 200) {
                  const adharDetails = JSON.parse(resp.data);
                  if(adharDetails?.data?.aadhaar_number) {
                    
                    navigateToRoute (item);
                  } else {
                    Alert.alert('Alert', 'Please update your e-KYC to proceed! To update the e-KYC please navigate to Update Profile tab under Account Menu');
                  }
                }
            } catch (error) {
                console.log(error);
                Alert.alert('Error','Error while validating KYC. Please try after sometime.')
            }
        } else if([3,4].includes(userData.user.user_Type_ID) && item.services_ID === 4 ) {
            // This is for DMT
            try {
                const {data: resp} = await getUserVerifiedAdharaDetails (userData.user.user_ID);
                if(resp.status === 'Success' && resp.code === 200) {
                  const adharDetails = JSON.parse(resp.data);
                  if(adharDetails?.data?.aadhaar_number) {                    
                    navigateToRoute (item);
                  } else {
                    Alert.alert('Alert', 'Please update your e-KYC to proceed! To update the e-KYC please navigate to Update Profile tab under Account Menu');
                  }
                }
            } catch (error) {
                console.log(error);
                Alert.alert('Error','Error while validating KYC. Please try after sometime.')
            }
        } else {
            // if user type id 3,4,5 and its not DMT then show error
            Alert.alert('Alert',   `As a ${USER_TYPE[userData.user.user_Type_ID]}, you are not authorized to use the service.`);
        }
        
    }



    const navigateToRoute = async (item: any) => {

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
        } else {
            await AsyncStorage.setItem('currentServiceDetails', JSON.stringify(
                { services_id: item.services_ID, services_cat_id: item.services_Cat_ID }
            ));
            navigation.push('bbpsStack', { bbpsSeviceName: item.services_Cat_Name, path: item.route, cat_id: item.services_Cat_ID })
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