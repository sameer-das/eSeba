import { StyleSheet, Text, View, TextInput, Pressable, FlatList } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext';
import colors from '../../constants/colors';
import Contacts from 'react-native-contacts';
import { PermissionsAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../components/Loading';

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
        navigation.push('showPlan', {...item})
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
        navigation.push('showPlan', {number:mobileNo, name: 'Unknow'})
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
        })
            .catch((error) => {
                console.error('Permission error: ', error);
            });
    }, []);


    if(isLoading)
       return <Loading label={'Reading your contacts'}/>

    return (
        <View style={styles.rootContainer}>
            <View style={styles.inputContainer}>
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
                    <FlatList showsVerticalScrollIndicator={false} data={filteredContactList} renderItem={contactItem} /> :
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
        marginTop: 8
    },
    inputLabel: {
        fontSize: 18,
        color: colors.primary500,
        marginVertical: 4,
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
        width:'100%'
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