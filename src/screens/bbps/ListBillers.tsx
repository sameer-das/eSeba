import { StyleSheet, Text, View, Alert, TextInput, FlatList, Pressable, Appearance, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { getAllBillers, getPreviousTransations } from '../../../src/API/services';
// import { getAllBillers } from '../../API/services-fake';
import colors from '../../../src/constants/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ServicesToPathMapping } from '../../constants/billers-mapping';
import Loading from '../../components/Loading';
import { windowHeight } from '../../utils/dimension';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/AuthContext';




const Biller = (props: any) => {
    const navigation = useNavigation<any>();

    const handlePress = (item: any) => {
        // console.log(item);
        navigation.push('FetchBill', item)
    }

    return <View style={styles.billerItem}>
        <Pressable onPress={() => handlePress(props.item)}>
            <Text style={styles.billerName}>{props.item.blr_name}</Text>
        </Pressable>
    </View >
}


const ListBillers = () => {
    const colorScheme = Appearance.getColorScheme();
    // console.log('Color Scheme : ' + colorScheme)
    const [billers, setBillers] = useState([]);
    const [filteredBillers, setFilteredBillers] = useState(billers);

    const [searchValue, setSearchValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [flatListHeight, setFlatListHeight] = useState(0);

    const route = useRoute();
    const navigation = useNavigation();

    const callAPI = async (searchValue: string) => {
        try {
            setIsLoading(true);
            // console.log('calling api')
            const resp: any = await getAllBillers(searchValue);

            // console.log(resp)
            const { data } = resp;
            if (data.status === 'Success' && data.code === 200) {
                setBillers(data.resultDt);
                setFilteredBillers(data.resultDt);
            }
        } catch (e) {
            console.log(e)
            // Alert about error
            Alert.alert('Error!', 'Something went wrong, Please try again!');
        }
        setIsLoading(false);
    }

    useEffect(() => {
        setSearchValue('');
        // console.log(route.params);
        const searchValue = ServicesToPathMapping.find((m: any) => m.path.toLowerCase() === (route.params as any).path.substr(1).toLowerCase())
        if (searchValue) {
            callAPI(searchValue.searchValue);
        } else {
            // Alert 
            Alert.alert('Error!', 'Something went wrong, Please try again!', [{
                text: 'Ok', onPress: () => {
                    navigation.goBack();
                }
            }]);

        }

    }, [])

    useEffect(() => {
        const filteredValue = billers.filter((item: any) => item.blr_name.toLowerCase().includes(searchValue.toLowerCase()))
        setFilteredBillers(filteredValue)
    }, [searchValue, billers])

    const searchHandler = (searchValue: string) => {
        setSearchValue(searchValue);
    }

    if (isLoading) {
        return <Loading label={"Brewing at back"} />
    }

    return (
        <View style={{ flex: 1 }}>
            {billers.length > 0 && <ListPrevTransactions billers={billers} onLayout={(event: any) => {
                // console.log("Height -->" + event);
                setFlatListHeight(event);
            }} />}
            <View style={{ flex: 1 }}>

                <Text style={{ fontSize: 18, color: colors.primary500, fontWeight: 'bold', textAlign: 'center', paddingVertical: 6, textDecorationLine:'underline' }}>All Available Billers</Text>
                <View style={styles.searchInputContainer}>
                    <TextInput style={styles.searchInput} placeholder='Search Biller'
                        placeholderTextColor={colorScheme === null || colorScheme === 'light' ? colors.primary500 : colors.primary500}
                        onChangeText={(val: string) => searchHandler(val)}
                        value={searchValue} />
                </View>
                {billers.length > 0 && <View style={{
                    height: windowHeight - (flatListHeight + 170)
                }}>
                    <FlatList showsVerticalScrollIndicator data={filteredBillers} renderItem={(itemData: any) => <Biller item={itemData.item} />} />
                </View>}
            </View>
        </View>
    )
}


const ListPrevTransactions = ({ billers, onLayout }: any) => {
    const [prevTrans, setPrevTrans] = useState([]);
    const { userData } = useContext(AuthContext);

    const getTransDetailsAsJSON = (trans: any) => {
        const removedSlash = trans['wallet_transaction_request']?.replace(new RegExp('/', 'g'), '');
        if (removedSlash) {
            return JSON.parse(removedSlash)
        } else {
            return undefined;
        }
    }

    const getInputParams = (str: any) => {
        if (str) {
            if (Array.isArray(str)) {
                return str;
            } else if (typeof str === 'object') {
                return [str];
            }
        }

        return [];
    }


    const callApi = async () => {
        const DTH_BILLER_LOGO = [
            { blr_id: 'TATASKY00NAT01', logo: require('../../../assets/logos/dth-operators/tataplay.jpg') },
            { blr_id: 'DISH00000NAT01', logo: require('../../../assets/logos/dth-operators/dishtv.jpg') },
            { blr_id: 'AIRT00000NAT87', logo: require('../../../assets/logos/dth-operators/airtel-dtoh.jpg') },
            { blr_id: 'VIDEOCON0NAT01', logo: require('../../../assets/logos/dth-operators/dtoh.jpg') },
            { blr_id: 'SUND00000NATGK', logo: require('../../../assets/logos/dth-operators/sundirect.jpeg') },
        ]

        const sd = await AsyncStorage.getItem('currentServiceDetails') as string;
        const serviceDetails = JSON.parse(sd);
        // console.log('In getPreviousTransactions')
        // console.log(serviceDetails)
        const prevTransResp: any = await getPreviousTransations(userData.user.user_EmailID, serviceDetails.services_id, serviceDetails.services_cat_id);
        console.log('prevTransResp')
        // console.log(prevTransResp.data)
        if (prevTransResp.data['code'] === 200 && prevTransResp.data["status"] === "Success") {
            const arr = prevTransResp.data['data'].map((trans: any) => {
                const json = getTransDetailsAsJSON(trans);
                return {
                    'wallet_transaction_ID': trans.wallet_transaction_ID,
                    // data: json,
                    amount: (json?.billPaymentRequest?.amountInfo?.amount / 100).toFixed(2),
                    billerId: json?.billPaymentRequest?.billerId,
                    biller: billers.find((curr: any) => curr.blr_id === json?.billPaymentRequest?.billerId),
                    inputParam: getInputParams(json?.billPaymentRequest?.inputParams.input),
                    logo: DTH_BILLER_LOGO.find(curr => curr.blr_id === json?.billPaymentRequest?.billerId)
                }
            })
            console.log(arr)
            setPrevTrans(arr)
        }
    }

    useEffect(() => {
        callApi()
    }, [])

    const navigation = useNavigation<any>();

    // If no prev trans found no need to show the details, return empty view
    if(prevTrans.length === 0) {
        return <View></View>;
    }

    return <View style={{ maxHeight: windowHeight * 0.4 }} onLayout={(event) => {
        onLayout(event.nativeEvent.layout.height)
    }}>
        <Text style={{ fontSize: 18, color: colors.primary500, fontWeight: 'bold', textAlign: 'center', paddingVertical: 6 , textDecorationLine:'underline'}}>Previous Transactions</Text>
        <FlatList contentContainerStyle={{ paddingBottom: 0 }} data={prevTrans} showsVerticalScrollIndicator renderItem={({ item }: any) => {
            // console.log(item.inputParam)
            return <Pressable onPress={() => {
                // console.log(console.log(item))
                navigation.push('FetchBill',{...item.biller, inputParam: [...item.inputParam,{"paramName": "Amount", "paramValue": item.amount }], })
            }} key={item.wallet_transaction_ID}
                style={{
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderBottomColor: colors.white,
                    alignItems:'center',
                    padding: 8
                }}>
                <View >
                    {item.logo && <Image source={item?.logo?.logo}
                        style={{ width: 40, height: 40 }} />}
                </View>
                <View style={{ marginLeft: 16 }}>
                    {!item?.logo?.logo && <Text>{item.biller.blr_name}</Text>}
                    <Text style={{ color: colors.primary500, fontSize: 16, fontWeight:'bold' }}>₹ {item.amount}</Text>
                    <Text style={{ color: colors.primary500, fontSize: 16 }}>{item.inputParam[0]?.paramValue}</Text>
                </View>
            </Pressable>
        }} />
    </View>

}




export default ListBillers

const styles = StyleSheet.create({
    searchInputContainer: {
        padding: 12,
        borderBottomColor: colors.primary100,
        borderBottomWidth: 1,
    },
    searchInput: {
        borderWidth: 2,
        borderColor: colors.primary100,
        paddingHorizontal: 8,
        paddingVertical: 8,
        fontSize: 16,
        color: colors.primary500,
        borderRadius: 4

    },
    billerItem: {
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: colors.primary100,
        paddingHorizontal: 8
    },
    billerName: {
        fontSize: 14,
        color: colors.primary500,
        fontWeight: 'bold'
    }
})