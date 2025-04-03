import { StyleSheet, Text, View, Alert, FlatList, Pressable } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
import colors from '../../../constants/colors'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../../../context/AuthContext'
import { getAllRecipients } from '../../../API/services'

const ListRecipientsToSendMoney = () => {
  const navigation = useNavigation<any>();
  const { userData } = useContext(AuthContext);
  const [recipient, setRecipient] = useState([]);
  const [refreshing, setRefreshing] = useState(false);


  const fetchAllRecipient = async () => {
    const payload = {
      "requestType": "AllRecipient",
      "senderMobileNumber": userData.user.mobile_Number,
      "txnType": "IMPS",
      "bankId": "FINO"
    }
    console.log('Fetching recipient')
    try {
      const { data } = await getAllRecipients(payload);
      if (data.code === 200 && data.status === 'Success') {
        if (data.resultDt && data.resultDt?.responseCode == 0) {
          setRecipient(data.resultDt?.recipientList?.dmtRecipient)
          console.log(data.resultDt?.recipientList?.dmtRecipient)
        } else {
          setRecipient([]);
        }
      } else {
        Alert.alert('Fail', 'Failed while fetching recipients. Please try after sometime.')
      }
      setRefreshing(false);
    } catch (e) {
      console.log('Error while fetching recipient')
      console.log(e);
      setRefreshing(false);
      Alert.alert('Error', 'Error while fetching recipients. Please try after sometime.')
    }
  }



  useEffect(() => {
    fetchAllRecipient()
  }, [])


  const onPullRefresh = () => {
    setRefreshing(true);
    fetchAllRecipient();
  }
  return (
    <View style={styles.rootContainer}>
      <Text style={{ fontSize: 20, color: colors.primary500, fontWeight: 'bold', textAlign: 'center' }}>Send Money</Text>
      <Text style={{ color: colors.primary500, marginTop: 8, fontSize: 16, textAlign: 'center' }}>Choose one from below list to transfer money</Text>

      <FlatList data={recipient}
        style={{ marginTop: 20 }}
        onRefresh={onPullRefresh}
        refreshing={refreshing}
        progressViewOffset={0}
        keyExtractor={(item: any) => item.recipientId}
        renderItem={({ item }) => {
          return (<Pressable
            style={{
              borderBottomColor: colors.grey,
              borderBottomWidth: 0.2,
              paddingVertical: 8
            }}
            onPress={() => {
              navigation.push('sendMoneyForm', {
                acNo: item.bankAccountNumber,
                recipientName: item.recipientName,
                recipientId: item.recipientId,
                bankName: item.bankName
              });
            }}>
            <Text style={{ fontSize: 16, color: colors.primary500, fontWeight: 'bold' }}>{item.recipientName}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <Text style={{ fontSize: 14, color: colors.primary200, fontWeight: 'bold' }}>AC No: {item.bankAccountNumber}</Text>
              <Text style={{ fontSize: 14, color: colors.primary200 }}>{item.bankName}</Text>
            </View>
            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: colors.primary200 }}>Mobile: {item.mobileNumber}</Text>
              <Text style={{ fontSize: 14, color: colors.primary200 }}>IFSC: {item.ifsc}</Text>
            </View> */}
          </Pressable>)

        }} />
    </View>


  )
}

export default ListRecipientsToSendMoney

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    padding: 8,
    backgroundColor: colors.white
  },
})