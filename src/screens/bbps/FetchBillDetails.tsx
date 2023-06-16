import { Alert, Image, Pressable, StyleSheet, Text, TextInput, Touchable, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import colors from '../../../src/constants/colors'
import { useNavigation, useRoute } from '@react-navigation/native';
import { getBillerInfo } from '../../API/services';
import Loading from '../../components/Loading';

const FetchBillDetails = () => {
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [consumerId, setConsumerIt] = useState('');
    const [billerInfo, setBillerInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    const route = useRoute();
    const navigation = useNavigation();
    console.log('in fetch bill details' + (route.params as any).blr_id);


    const fetchBillerInfo = async (biller_id: string) => {
        setIsLoading(true);
        try {
            const { data } = await getBillerInfo(biller_id);
            // console.log(data)
            if (data.status === 'Success' && data.code === 200 && data?.resultDt?.resultDt?.billerId.length > 0) {
                const billerInfo = data?.resultDt?.resultDt?.billerInputParams.paramInfo;
                // console.log(billerInfo)
                setBillerInfo(billerInfo);
            } else {
                Alert.alert('Error', 'Something wrong while fetching biller details!', [
                    {
                        text: 'Ok', onPress: () => {
                            navigation.goBack();
                        }
                    }
                ])
            }

        } catch (e) {
            console.log(e)
            Alert.alert('Error', 'Error while fetching biller details!', [
                {
                    text: 'Ok', onPress: () => {
                        navigation.goBack();
                    }
                }
            ])
        } finally{
            setIsLoading(false);
        }

    }

    useEffect(() => {
        const biller_id = (route.params as any).blr_id;
        if (biller_id)
            fetchBillerInfo(biller_id);
        else {
            Alert.alert('Error', 'Biller Id not found!', [
                {
                    text: 'Ok', onPress: () => {
                        navigation.goBack();
                    }
                }
            ])
        }
    }, [])

    const handleConsumerIdInput = (text: string) => {
        setConsumerIt(text);
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <View style={styles.rootContainer}>
            <View >
                <View style={[styles.card, styles.card_center_vertical]}>
                    <TextInput style={styles.inputText} placeholder='Conusmer Id'
                        value={consumerId} onChangeText={handleConsumerIdInput} />
                    <Text style={styles.inputLabel} >Plase enter valid Consumer ID</Text>
                </View>

                <View style={[styles.card, styles.information_card]}>
                    <Image source={require('../../../assets/logos/BharatBillPay.png')} />
                    <Text style={styles.information_text} numberOfLines={4}>Paying this bill allows GlobalPe to fetch your current and future bills so that you can view and pay them.</Text>
                </View>
            </View>

            <Pressable style={[styles.confirm_cta, buttonDisabled ? styles.cta_disable : null]}
                disabled={true}
                onPress={() => console.log('Confirm Pressed')}>
                <Text style={styles.confirm_cta_text}>Confirm</Text>
            </Pressable>

        </View >
    )
}

export default FetchBillDetails

const styles = StyleSheet.create({
    rootContainer: { flex: 1, justifyContent: 'space-between' },
    card: {
        minHeight: 100,
        margin: 8,
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 8
    },
    card_center_vertical: {
        justifyContent: 'center'
    },
    information_card: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputText: {
        borderWidth: 2,
        borderColor: colors.primary100,
        paddingHorizontal: 8,
        paddingVertical: 8,
        fontSize: 16,
        color: colors.primary500,
        borderRadius: 8,
    },
    inputLabel: {
        color: colors.primary500,
        marginTop: 4,
        fontSize: 16
    },
    information_text: {
        flex: 1,
        color: colors.primary500,
        fontSize: 16
    },
    confirm_cta: {
        padding: 20,
        backgroundColor: colors.primary500,
        justifyContent: 'center',
        alignItems: 'center'
    },
    confirm_cta_text: {
        fontSize: 18,
        textTransform: 'uppercase',
        color: colors.white
    },
    cta_disable: {
        backgroundColor: colors.primary100,
    }
})