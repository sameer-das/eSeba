import { StyleSheet, Text, View, TextInput, Pressable, FlatList, Image } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext';
import colors from '../../constants/colors';
import Contacts from 'react-native-contacts';
import { PermissionsAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPreviousTransations } from '../../API/services';
import { windowHeight } from '../../utils/dimension';
import { MobileOperatorLogoMapping } from '../../constants/mobile-operator-logo-mapping';

const uniqByKeepLast = (data: any[], key: Function) => {
    return [...new Map(
        data.map(x => [key(x), x])
    ).values()]
}

const getContactsArray = (contacts: any[]) => {
    const result: any[] = [];

    contacts.forEach((contact: any) => {
        const con = contact.phoneNumbers.map((phno: any) => {
            return { name: contact.displayName, number: phno.number.replace(/-|\s/g, "") };;
        });
        result.push(...con);
    });

    const unSortedUniqueArray = uniqByKeepLast(result, (it: any) => it.number.substr(-10));
    unSortedUniqueArray.sort((a, b) => {
        if (a.name > b.name)
            return 1
        else
            return -1
    })
    return unSortedUniqueArray;
}



const SearchContact = () => {
    const navigation = useNavigation<any>();

    const { userData } = useContext(AuthContext);
    const [mobileNo, setMobileNo] = useState('');

    const [contactList, setContactList] = useState<any[]>([]);
    const [filteredContactList, setFilteredContactList] = useState<any[]>(contactList);

    const [isLoading, setIsLoading] = useState<boolean>(false);




    const contactPressHandler = (item: any) => {
        navigation.push('showPlan', { ...item })
    }

    const contactItem = ({ item }: any) => {
        return (
            <Pressable onPress={() => contactPressHandler(item)} style={styles.contactItem}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactNumber}>{item.number}</Text>
            </Pressable>
        )
    }

    useEffect(() => {
        const result = contactList.filter(contact => {
            return contact.name.toLowerCase().includes(mobileNo.toLowerCase()) ||
                contact.number.toLowerCase().includes(mobileNo.toLowerCase())
        });
        setFilteredContactList(result);
    }, [contactList, mobileNo])


    const onSearchMobileNo = (searchText: string) => {
        setMobileNo(searchText);
    }

    const newContactPressHandler = () => {
        navigation.push('showPlan', { number: mobileNo, name: 'Unknow' })
    }

    const [prevTrans, setPrevTrans] = useState([]);
    const [showPrevTrans, setShowPrevTrans] = useState(true);

    const callApi = async () => {
        const PREPAID_RECHARGE_OPERATOR = [
            { "op": 1, "provider": "AirTel" },
            { "op": 604, "provider": "airtel up east" },
            { "op": 2, "provider": "BSNL" },
            { "op": 32, "provider": "BSNL Special" },
            { "op": 505, "provider": "DOCOMO RECHARGE" },
            { "op": 506, "provider": "DOCOMO SPECIAL" },
            { "op": 4, "provider": "Idea" },
            { "op": 167, "provider": "Jio" },
            { "op": 5, "provider": "Vodafone" }
        ]

        // console.log('In getPreviousTransactions search contact')
        const prevTransResp: any = await getPreviousTransations(userData.user.user_EmailID, 1, 1);
        if (prevTransResp.data['code'] === 200 && prevTransResp.data["status"] === "Success") {
            const arr = prevTransResp.data['data'].map((trans: any) => {
                const json = getTransDetailsAsJSON(trans);
                let operatorDetails: any;
                let foundOp: any;
                if (json) {
                    operatorDetails = PREPAID_RECHARGE_OPERATOR.find(curr => +curr.op === +json.op)
                    foundOp = MobileOperatorLogoMapping.find((op: any) => op.name.includes(operatorDetails?.provider?.trim().toLowerCase()))
                }
                // Assign Name from contact list
                const foundContact = contactList.find(c => c.number === json.mn);
                // console.log(foundContact);
                return {
                    // data: json,
                    trans_id: json.wallet_transaction_ID,
                    amount: json?.amt,
                    mn: json?.mn,
                    op: json?.op,
                    operatorDetails,
                    logo: foundOp && foundOp.imageUri,
                    name: foundContact ? foundContact.name : 'Unknown'
                }
            })
            // console.log(JSON.stringify(arr))
            setPrevTrans(arr)
        }
    }

    const getTransDetailsAsJSON = (trans: any) => {
        const removedSlash = trans['wallet_transaction_request']?.replace(new RegExp('/', 'g'), '');
        if (removedSlash) {
            return JSON.parse(removedSlash)
        } else {
            return undefined;
        }
    }


    useEffect(() => {
        console.log('in list contacts')
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
            title: 'Contacts',
            message: 'This app would like to view your contacts.',
            buttonPositive: 'Please accept',
        }).then((res) => {
            // console.log('Permission: ', res);
            setIsLoading(true);
            Contacts.getAll()
                .then((contacts) => {
                    const contactArray = getContactsArray(contacts);
                    setContactList(contactArray);
                    setIsLoading(false);
                })
                .catch((e) => {
                    console.log(e);
                    setIsLoading(false);
                });
        }).catch((error) => {
            console.error('Permission error: ', error);
        });
    }, []);

    useEffect(() => {
        if(contactList.length > 0) {
            console.log('Contact List Popullated, fetch Prev Trans')
            callApi()
        }
    }, [contactList.length])

    if (isLoading)
        return <Loading label={'Reading your contacts'} />

    return (
        <View style={styles.rootContainer}>

            {prevTrans.length > 0 && <View style={{ maxHeight: windowHeight * 0.3 }}>
                <View style={{ flexDirection: 'row', justifyContent: showPrevTrans ? 'space-between' : 'flex-end', alignItems: 'center' }}>
                    {showPrevTrans && <Text style={{ fontSize: 18, color: colors.primary500, fontWeight: 'bold', paddingVertical: 6, textDecorationLine: 'underline' }}>Recent Recharges</Text>}
                    <Pressable onPress={() => { setShowPrevTrans(!showPrevTrans) }}>
                        <Text style={{ fontSize: 18, color: colors.primary500, fontWeight: 'bold', textDecorationLine: 'underline' }}>{showPrevTrans ? 'Hide' : 'Show Prev. Transaction'}</Text>
                    </Pressable>
                    {/* 9124433901 */}
                </View>
                {showPrevTrans && <View>
                    <FlatList data={prevTrans} renderItem={({ item }: any) => {
                        return <Pressable key={item.trans_id}
                            onPress={() => {
                                console.log('pressed ' + JSON.stringify(item))
                                navigation.push('showPlan', { number: item.mn, name: item.name })
                            }}
                            style={{
                                flexDirection: 'row',
                                borderBottomWidth: 1,
                                borderBottomColor: colors.primary100,
                                alignItems: 'center',
                                paddingVertical: 8,
                                paddingHorizontal: 4
                            }}>
                            <View>
                                <Image source={item?.logo}
                                    style={{ width: 40, height: 40 }} />
                            </View>
                            <View style={{ marginLeft: 16 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <Text style={{ color: colors.primary500, fontSize: 16, fontWeight: 'bold', width: '50%' }}>₹ {item.amount}</Text>
                                    <Text style={{ color: colors.primary500, fontSize: 16, fontWeight: 'bold', width: '50%' }}>No. {item.mn}</Text>
                                </View>
                                <Text style={{ color: colors.primary500, fontSize: 14 }}>{item.name}</Text>
                            </View>
                        </Pressable>
                    }} />
                </View>}
            </View>}
            {/* Adjust margin according to prevtrans array */}
            <View style={[styles.inputContainer, { marginTop: prevTrans.length > 0 ? (showPrevTrans ? 40 : 8) : 0 }]}>
                <Text style={styles.inputLabel}>Please enter mobile or name</Text>
                <View style={styles.mobileNoInput}>
                    {/* <Text style={styles.countryCode}>+91</Text> */}
                    <TextInput style={styles.input}
                        placeholder='Number or Name'
                        value={mobileNo}
                        autoFocus
                        onChangeText={onSearchMobileNo} />
                </View>
            </View>


            <View style={{ flex: 1 }}>
                {filteredContactList.length > 0 ?
                    <FlatList showsVerticalScrollIndicator={true} data={filteredContactList} renderItem={contactItem} /> :
                    <Pressable onPress={newContactPressHandler} style={styles.typedNumberContainer}>
                        <Text style={styles.newNumberLable}>New Number</Text>
                        <Text style={styles.typedNumber}>+91 {mobileNo}</Text>
                    </Pressable>}
            </View>
        </View>
    )
}

export default SearchContact

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 8
    },
    inputContainer: {
        backgroundColor: colors.white
    },
    inputLabel: {
        fontSize: 18,
        color: colors.primary500,
        // marginVertical: 4,
        fontWeight: 'bold'
    },
    mobileNoInput: {
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: colors.primary100,
        alignItems: 'center',
        paddingHorizontal: 8
    },
    countryCode: {
        fontSize: 20,
        color: colors.primary500,
        fontWeight: 'bold'
    },
    input: {
        fontSize: 20,
        color: colors.primary500,
        fontWeight: 'bold',
        width: '100%'
    },

    typedNumberContainer: {
        paddingVertical: 8,
        backgroundColor: colors.primary50,
        paddingHorizontal: 4
    },
    typedNumber: {
        fontSize: 18,
        color: colors.primary500,
        fontWeight: 'bold',
        marginTop: 4,
        paddingLeft: 8
    },
    newNumberLable: {
        fontStyle: 'italic',
        fontSize: 16,
        color: colors.primary500,
        paddingLeft: 8
    },


    contactItem: {
        paddingVertical: 8,
        borderBottomColor: colors.primary200,
        borderBottomWidth: 1,
        paddingHorizontal: 4
    },
    contactName: {
        fontSize: 18,
        color: colors.primary500,
        fontWeight: 'bold'
    },
    contactNumber: {
        fontSize: 18,
        color: colors.primary400,
    }

})