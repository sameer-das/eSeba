import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import colors from '../../../constants/colors'
import { getTransactionHistory } from '../../../API/services';
import { AuthContext } from '../../../context/AuthContext';
import { useIsFocused } from '@react-navigation/native';
import Loading from '../../../components/Loading';

const ListTransactions = () => {

    // ======================== States =================================
    const [trans, setTrans] = useState([]);
    const { userData } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const isFocused = useIsFocused();


    // =========================== Functions =============================
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setIsLoading(true)
                const { data: resp } = await getTransactionHistory(userData.user.user_EmailID);
                // console.log(resp)
                if (resp.status === 'Success' && resp.code === 200) {
                    const arr = resp.data.filter((trans: any) => trans.wallet_transaction_recall === "BBPS Fund Transfer")
                    setTrans(arr)
                }
            } catch (error) {
                Alert.alert('Error', 'Error while fetching transaction details.')
            } finally {
                setIsLoading(false);
            }
        }

        if (trans.length === 0) {
            fetchTransactions()
        }

    }, [isFocused])


    const onPullRefresh = async () => {
        try {
            // setIsLoading(true)
            const { data: resp } = await getTransactionHistory(userData.user.user_EmailID);
            // console.log(resp)
            if (resp.status === 'Success' && resp.code === 200) {
                const arr = resp.data.filter((trans: any) => trans.wallet_transaction_recall === "BBPS Fund Transfer")
                setTrans(arr)
            }
        } catch (error) {
            Alert.alert('Error', 'Error while fetching transaction details.')
        } finally {
            // setIsLoading(false);
        }
    }


    // ============================== JSX ================================== 

    if (isLoading)
        return <Loading />
    return (
        <View style={styles.rootContainer}>
            <Text style={{ fontSize: 20, color: colors.primary500, fontWeight: 'bold', textAlign: 'center' }}>DMT History</Text>

            <FlatList data={trans}
                onRefresh={onPullRefresh}
                refreshing={refreshing}
                progressViewOffset={0}
                style={{ marginTop: 20 }}
                keyExtractor={(item: any) => item.wallet_transaction_ID}
                renderItem={({ item }) => {
                    return (
                        <Pressable
                            style={{ borderBottomColor: colors.grey, borderBottomWidth: 0.2, paddingVertical: 4, marginBottom: 4 }}
                            onPress={() => {
                                console.log('Pressed ===================')
                                console.log(item)
                            }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <Text style={{ fontSize: 20, color: colors.primary500, fontWeight: 'bold' }}>₹ {item.wallet_Amount}</Text>
                                <Text style={{ fontSize: 14, color: colors.primary500, fontWeight: 'bold' }}>{new Date(item.wallet_transaction_Date).toLocaleString()}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 }}>
                                <Text style={{ fontSize: 16, color: colors.primary500, fontWeight: 'bold' }}>{item.wallet_transaction_Status === 'TXN_SUCCES' ? 'Success' : 'Fail'}</Text>
                                <Text style={{ fontSize: 14, color: colors.primary500, fontWeight: 'bold' }}>{item.wallet_transaction_ID?.toUpperCase()}</Text>
                            </View>
                        </Pressable>)
                }} />
        </View>
    )
}

export default ListTransactions

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        padding: 8,
        backgroundColor: colors.white
    },
})