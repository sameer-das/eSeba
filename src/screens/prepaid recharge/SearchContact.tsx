import { StyleSheet, Text, View, TextInput, Pressable, FlatList, Image, Alert, Modal, Appearance } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext';
import colors from '../../constants/colors';
import Contacts from 'react-native-contacts';
import { PermissionsAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPreviousTransations } from '../../API/services';
import { windowHeight, windowWidth } from '../../utils/dimension';
import { MobileOperatorLogoMapping, MunimultiOperatorLogoMapping } from '../../constants/mobile-operator-logo-mapping';
import * as convert from 'xml-js';
import BouncyCheckbox from "react-native-bouncy-checkbox";

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



const getTransDetailsAsJSON = (trans: any) => {
    // console.log(trans)
    const j = convert.xml2json(trans['wallet_transaction_request'], { compact: true });
    // console.log(j)
    const json = JSON.parse(j);
    return {
        billerId: json.billPaymentRequest.billerId['_text'],
        amt: json.billPaymentRequest.amountInfo.amount['_text'] / 100, // to convert to rupees
        mn: json.billPaymentRequest.inputParams.input.paramValue['_text']
    }
}



/************************************************************************************
 *                              SearchContact Component 
 ************************************************************************************/


const SearchContact = () => {
    const navigation = useNavigation<any>();

    const { userData } = useContext(AuthContext);
    const [mobileNo, setMobileNo] = useState('');

    const [contactList, setContactList] = useState<any[]>([]);
    const [filteredContactList, setFilteredContactList] = useState<any[]>(contactList);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [prevTrans, setPrevTrans] = useState([]);
    const [showPrevTrans, setShowPrevTrans] = useState(false);

    const [isCommission, setIsCommission] = useState<boolean>(false);

    const [transModalVisible, setTransModalVisible] = useState(false);
    const colorScheme = Appearance.getColorScheme();

    const contactPressHandler = (item: any) => {
        navigation.push('showPlan', { ...item, isCommission })
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
        navigation.push('showPlan', { number: mobileNo, name: 'Unknow', isCommission })
    }



    const callApi = async () => {

        // console.log('In getPreviousTransactions search contact')
        const prevTransResp: any = await getPreviousTransations(userData.user.user_EmailID, 1, 1);
        if (prevTransResp.data['code'] === 200 && prevTransResp.data["status"] === "Success") {
            // console.log(prevTransResp.data['data'])
            const arr = prevTransResp.data['data'].map((curr: any) => {

                if (curr.wallet_transaction_recall === 'BBPS') {
                    // IF BBPS 
                    // console.log(curr)
                    const req = getTransDetailsAsJSON(curr);
                    // console.log(req)
                    const found = MobileOperatorLogoMapping.find(curr => curr.BBPSBillerID === req.billerId)
                    const foundContact = contactList.find(c => c.number.slice(-10) === req.mn);
                    return {
                        ...req,
                        operatorLogo: found?.imageUri,
                        operatorName: found?.BBPSBillerName,
                        name: foundContact ? foundContact.name : 'Unknown'
                    }

                } else {
                    // IF Munimulti
                    const req = curr.wallet_transaction_request && JSON.parse(curr.wallet_transaction_request);
                    let operatorDetails: any;
                    let foundOp: any;
                    if (req) {
                        operatorDetails = MunimultiOperatorLogoMapping.find(curr => +curr.op === +req.op)
                        foundOp = MobileOperatorLogoMapping.filter((op: any) => op.name.includes(operatorDetails?.provider?.trim().toLowerCase()))
                    }
                    const foundContact = contactList.find(c => c.number === req.mn);
                    return {
                        ...JSON.parse(curr.wallet_transaction_Logfile),
                        operatorLogo: foundOp?.length > 0 ? foundOp[0].imageUri : '',
                        operatorName: operatorDetails ? operatorDetails?.provider : '',
                        name: foundContact ? foundContact.name : 'Unknown'
                    }
                }
            })

            //  console.log(arr)
            setPrevTrans(arr.slice(0,10))
        }
    }



    useEffect(() => {
        // console.log('in list contacts')
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
        if (contactList.length > 0) {
            console.log('Contact List Popullated, fetch Prev Trans')
            callApi()
        }
    }, [contactList.length])



    if (isLoading)
        return <Loading label={'Reading your contacts'} />

    return (
        <View style={styles.rootContainer}>


            {/* Adjust margin according to prevtrans array */}
            <View style={[styles.inputContainer, { marginTop: 0 }]}>
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

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                {
                    prevTrans.length > 0 ?
                        <Pressable onPress={() => setTransModalVisible(true)}>
                            <Text style={{ fontSize: 16, textDecorationLine:'underline' ,color: colors.primary500 }}>Show History</Text>
                            </Pressable>
                        : <View></View> // empty view
                }

                <BouncyCheckbox
                    size={25}
                    isChecked={isCommission}
                    fillColor={colors.primary500}
                    text="Commission"
                    textStyle={{ textDecorationLine: "none", color: colors.primary500 }}
                    iconStyle={{ borderColor: colors.primary500 }}
                    innerIconStyle={{ borderWidth: 2 }}
                    onPress={(isChecked: boolean) => {
                        setIsCommission(isChecked)        
                    }} />
            </View>

            <Modal visible={transModalVisible} 
                transparent
                animationType='fade' 
                onRequestClose={() => { setTransModalVisible(false) }}>
                    <View style={modalStyle.modalBackdrop}>
                        <View style={modalStyle.modalContent}>

                        <View style={modalStyle.modalHeader}>
                            <Text style={modalStyle.modalHeaderLAbel}>Previous Transations</Text>
                            <Pressable onPress={() => {console.log('modal close'); setTransModalVisible(false)}}>
                                <Text style={modalStyle.modalCloseLabel}>Close</Text>
                            </Pressable>
                        </View>

                        <View style={{flex: 1, marginTop: 12}}>
                            <FlatList data={prevTrans} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} renderItem={({ item }: any) => {
                                return <Pressable key={item.trans_id}
                                    onPress={() => {
                                        setTransModalVisible(false);
                                        console.log('pressed ' + JSON.stringify(item))
                                        navigation.push('showPlan', { number: item.mn, name: item.name, isCommission })
                                    }}
                                    style={{
                                        flexDirection: 'row',
                                        borderBottomWidth: 1,
                                        borderBottomColor: colors.primary100,
                                        alignItems: 'center',
                                        paddingVertical: 8,                   
                                    }}>
                                    <View>
                                        <Image source={item?.operatorLogo}
                                            style={{ width: 40, height: 40 }} />
                                    </View>
                                    <View style={{ paddingLeft: 8 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                            <Text style={{ color: colors.primary500, fontSize: 16, fontWeight: 'bold', width: '50%' }}>₹ {item.amt}</Text>
                                            <Text style={{ color: colors.primary500, fontSize: 16, fontWeight: 'bold', width: '50%' }}>No. {item.mn}</Text>
                                        </View>
                                        <Text style={{ color: colors.primary500, fontSize: 14 }}>{item.name}</Text>
                                    </View>
                                </Pressable>
                            }} />
                        </View>

                        </View>
                    </View>
            </Modal>



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
    },

    

})


const modalStyle = StyleSheet.create({
    modalBackdrop: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        width: windowWidth - 50,
        height: windowHeight - 200,
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 8
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent:'space-between'
    },
    modalHeaderLAbel: {
        fontSize: 20,
        color: colors.primary500,
        fontWeight: 'bold'
    },
    modalCloseLabel: {
        fontSize: 18,
        color: colors.secondary500,
        fontWeight: 'bold'
    }
})