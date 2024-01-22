import { StyleSheet, Text, View, Alert, TextInput, FlatList, Pressable, Appearance } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAllBillers } from '../../../src/API/services';
// import { getAllBillers } from '../../API/services-fake';
import colors from '../../../src/constants/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ServicesToPathMapping } from '../../constants/billers-mapping';
import Loading from '../../components/Loading';
import { windowHeight } from '../../utils/dimension';




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

    const route = useRoute();
    const navigation = useNavigation();

    const callAPI = async (searchValue: string) => {
        try {
            setIsLoading(true);
            // console.log('calling api')
            const resp: any = await getAllBillers(searchValue);
            // console.log(resp)
            const {data} = resp;
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
        const searchValue = ServicesToPathMapping.find((m:any)=> m.path.toLowerCase() === (route.params as any).path.substr(1).toLowerCase())
        if(searchValue){
            callAPI(searchValue.searchValue);
        } else {
            // Alert 
            Alert.alert('Error!', 'Something went wrong, Please try again!', [{text: 'Ok', onPress: () => {
                navigation.goBack();
            }}]);
            
        }

    }, [])

    useEffect(() => {
            const filteredValue = billers.filter((item: any) => item.blr_name.toLowerCase().includes(searchValue.toLowerCase()))
            setFilteredBillers(filteredValue)
    },[searchValue, billers])

    const searchHandler = (searchValue: string) => {
        setSearchValue(searchValue);
    }

    if(isLoading) {
        return <Loading label={"Brewing at back"}/>
    }

    return (
        <View>
            <View style={styles.searchInputContainer}>
                <TextInput style={styles.searchInput} placeholder='Search Biller' 
                    placeholderTextColor={ colorScheme === null || colorScheme === 'light' ? colors.primary500 : colors.primary500}
                    onChangeText={(val: string) => searchHandler(val)}
                    value={searchValue} />
            </View>
            {billers.length > 0 && <View style={styles.flatListContainer}>
                <FlatList data={filteredBillers} renderItem={(itemData: any) => <Biller item={itemData.item} />} />
            </View>}
        </View>
    )
}

export default ListBillers

const styles = StyleSheet.create({
    flatListContainer: {
        paddingBottom: 50,
        height: windowHeight - 100
    },
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
        fontSize: 16,
        color: colors.primary500,
        fontWeight: 'bold'
    }
})