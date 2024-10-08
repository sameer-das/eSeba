import { StyleSheet, Text, View, FlatList, Touchable, Alert } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { getTransactionHistory } from '../../API/services';
import { AuthContext } from '../../context/AuthContext';
import Loading from '../../components/Loading';
import colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';

const ListTransactions = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { userData } = useContext(AuthContext);
    const navigation = useNavigation<any>();

    const getTransactons = async () => {
        // console.log('Get Transaction')
        try {
            setIsLoading(true);
            const { data } = await getTransactionHistory(userData.user.user_EmailID);

            if (data.status === 'Success' && data.code === 200 && data.data?.length > 0) {
                const _formattedData = data.data.map((curr: any) => {
                    return { ...curr, wallet_transaction_Date: new Date(curr.wallet_transaction_Date), trans_details: getTransDetails(curr) }
                });
                // console.log(_formattedData)
                setTransactions(_formattedData);
            } else {
                setTransactions([]);
            }
        } catch (e) {
            console.log(e);
            Alert.alert('Error', 'Error reading transaction history.');
        } finally {
            setIsLoading(false);
        }

    }

    const getObjFromXml = (str: string) => {
        function getParam(paramName: string) {
          let startIndex = str.indexOf(`<${paramName}>`);
          let endIndex = str.indexOf(`</${paramName}>`);
          const key = str.slice(startIndex + paramName.length + 2, endIndex);
          str = str.slice(endIndex + 2 + paramName.length + 1);
          return key;
        }
        const result: any = {};
        while (str.length > 0) {
          let key = getParam('paramName');
          let val = getParam('paramValue');
          result[key] = val;
        }    
        return result;
      }


    const getTransDetails = (trans: any) => {
        let ret: string = '';
        if (trans.wallet_transaction_recall === 'ManiMulti') {
          const json = JSON.parse(trans.wallet_transaction_Logfile)
          ret = `Mobile No. : ${json.mn}`;
        }
        else if (trans.wallet_transaction_recall === 'BBPS') {
          const x = trans.wallet_transaction_Logfile;
          const str = x.slice(x.indexOf('<paramName>'), x.lastIndexOf('</paramValue>') + 13);
          const res = getObjFromXml(str);
          for (let k in res) {
            ret = ret + `${k} : ${res[k]}`
          }
        }
        return ret
      }
    // useEffect(() => {
    //     console.log('Fetch history')
    //     getTransactons();
    // }, [])

    useEffect(() => {
        // console.log('List Transactions Focused')
        const unsubscribe = navigation.addListener('focus', async () => {
            await getTransactons();
        });
        return unsubscribe;
    }, []);

    const TransactionItem = ({ item }: any) => {
        return (
            <View style={styles.transItem}>
                <View style={styles.row}>
                    <Text style={styles.transId}>{item.wallet_transaction_ID.toUpperCase()}</Text>
                    <Text style={styles.transDate}>{item.wallet_transaction_Date.toDateString()}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.transAmount}>₹ {item.wallet_Amount}</Text>
                    <Text style={[styles.transStatus, { color: colors.primary500 }]}>{item.wallet_transaction_Status}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.transType}>Type : {item.wallet_transaction_type}</Text>
                    <Text style={styles.transRecall}>Service : {item.wallet_transaction_recall === 'ManiMulti' ? 'Prepaid Recharge' : item.wallet_transaction_recall}</Text>
                </View>
                {item.trans_details && <View style={styles.row}>
                    <Text style={styles.commission}>Txn Details : {item.trans_details}</Text>
                </View>}
                <View style={styles.row}>
                    <Text style={styles.commission}>Commission Earned: {item.payment_Per_Amount.toFixed(2)}</Text>
                </View>
            </View>
        )
    }

    if (isLoading)
        return <Loading label={'Reading transactions'} />

    return (
        <View style={styles.rootContainer}>
            <FlatList data={transactions} renderItem={TransactionItem} />
        </View>
    )
}

export default ListTransactions

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        padding: 8
    },
    transItem: {
        marginVertical: 8,
        borderBottomColor: colors.primary300,
        borderBottomWidth: 1,
        paddingVertical: 8
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    transId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary500
    },
    transDate: {
        fontSize: 16,
        color: colors.primary500
    },
    transAmount: {
        fontSize: 22,
        color: colors.primary500,
        fontWeight: 'bold'
    },
    transStatus: {
        fontSize: 18,
        fontWeight: '400'
    },
    transType: {
        fontSize: 16,
        color: colors.primary500
    },
    transRecall: {
        fontSize: 16,
        color: colors.primary500
    },
    commission: {
        fontSize: 16,
        color: colors.primary500,
        fontWeight: '500'
    }
})