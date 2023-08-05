import { StyleSheet, Text, View, Pressable, Alert, FlatList } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import colors from '../../../constants/colors'
import { useNavigation } from '@react-navigation/native'
import { getAllRecipients } from '../../../API/services'
import { AuthContext } from '../../../context/AuthContext'
import Loading from '../../../components/Loading'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const ListRecipient = () => {

    const navigation = useNavigation<any>();
    const { userData } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [recipient, setRecipient] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAllRecipient = async () => {
        const payload = {
            "requestType": "AllRecipient",
            "senderMobileNumber": userData.user.mobile_Number,
            "txnType": "IMPS"
        }
        setIsLoading(true);

        try {
            setIsLoading(false);
            const { data } = await getAllRecipients(payload);
            if (data.code === 200 && data.status === 'Success') {
                if (data.resultDt && data.resultDt?.responseCode == 0) {
                    setRecipient(data.resultDt?.recipientList?.dmtRecipient)
                    console.log(data.resultDt?.recipientList?.dmtRecipient)
                } else {
                    setRecipient([]);
                }
            } else {
                setIsLoading(false);
                Alert.alert('Fail', 'Failed while fetching recipients. Please try after sometime.')
            }
            setRefreshing(false)
        } catch (e) {
            setIsLoading(false);
            setRefreshing(false)
            console.log('Error while fetching recipient')
            console.log(e)
            Alert.alert('Error', 'Error while fetching recipients. Please try after sometime.')
        }


    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            console.log('List DMT Recipient focus');
            fetchAllRecipient()
        });
        return unsubscribe;
    }, [])

    const onPullRefresh = () => {
        setRefreshing(true);
        fetchAllRecipient();
    }


    if (isLoading)
        return <Loading label='Loading...' />

    return (
        <View style={styles.rootContainer}>
            {/* <View>
                <Pressable style={styles.addRecipientButton} >
                    <Text style={styles.addRecipientButtonLabel}>Add Recipient</Text>
                </Pressable>
            </View> */}

            <View style={{ borderBottomColor:colors.primary500, borderBottomWidth: 2, 
                paddingBottom: 20, flexDirection: 'row', alignItems: 'center', 
                justifyContent: 'space-between', marginTop: 16 }}>
                <Text style={{ color: colors.primary500, fontSize: 20, fontWeight: 'bold' }}>My Recipients</Text>

                <Pressable onPress={() => navigation.push('AddRecipient')} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <MaterialIcon name='person-add' color={colors.primary500} size={20} />
                    <Text style={{ color: colors.primary500, fontSize: 16 }}>Add Recipient</Text>
                </Pressable>
            </View>
            <FlatList data={recipient}
                onRefresh={onPullRefresh}
                refreshing={refreshing}
                progressViewOffset={0}
                style={{ marginTop: 20 }}
                keyExtractor={(item: any) => item.recipientId}
                renderItem={({ item }) => {
                    return (<View style={{ borderBottomColor: colors.grey, borderBottomWidth: 0.2, paddingBottom: 4 }}>
                        <Text style={{ fontSize: 16, color: colors.primary500, fontWeight: 'bold' }}>{item.recipientName}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                            <Text style={{ fontSize: 14, color: colors.primary200, fontWeight: 'bold' }}>AC No: {item.bankAccountNumber}</Text>
                            <Text style={{ fontSize: 14, color: colors.primary200 }}>{item.bankName}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 14, color: colors.primary200 }}>Mobile: {item.mobileNumber}</Text>
                            <Text style={{ fontSize: 14, color: colors.primary200 }}>IFSC: {item.ifsc}</Text>
                        </View>
                    </View>)

                }} />
        </View>
    )
}

export default ListRecipient

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        padding: 8,
        backgroundColor: colors.white
    },
    addRecipientButton: {
        paddingVertical: 8,
        paddingHorizontal: 8,
        alignItems: 'center',
        borderRadius: 8,
        flexDirection: 'row',
        marginTop: 16,
        justifyContent: 'space-around',
        backgroundColor: colors.primary500
    },
    addRecipientButtonLabel: {
        color: colors.white,
        fontSize: 24,
        textAlign: 'center'
    }
})