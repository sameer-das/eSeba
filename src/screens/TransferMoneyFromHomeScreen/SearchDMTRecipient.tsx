import { StyleSheet, Text, View, Pressable, Alert } from 'react-native'
import React, { useState, useContext } from 'react'
import colors from '../../constants/colors'
import AnimatedInput from '../../components/AnimatedInput'
import { useNavigation, useRoute } from '@react-navigation/native'
import ButtonPrimary from '../../components/ButtonPrimary'
import { AuthContext } from '../../context/AuthContext'
import { getAllRecipients } from '../../API/services'
import Loading from '../../components/Loading'

const SearchDMTRecipient = () => {
  const route = useRoute<any>();
  const { userData } = useContext(AuthContext);
  const navigation = useNavigation<any>();
  const [searchValue, setSearchValue] = useState('');
  const [disableSearchButton, setDisableSearchButton] = useState(true);
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [allRecipient, setAllRecipient] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  console.log(route.params.searchBy);

  const fetchAllRecipient = async () => {
    setIsLoading(true);
    const payload = {
      "requestType": "AllRecipient",
      "senderMobileNumber": userData.user.mobile_Number,
      "txnType": "IMPS"
    }
    console.log('Fetching recipient')
    try {
      if (allRecipient.length === 0) {
        const { data } = await getAllRecipients(payload);
        if (data.code === 200 && data.status === 'Success') {
          if (data.resultDt && data.resultDt?.responseCode == 0) {
            setAllRecipient(data.resultDt?.recipientList?.dmtRecipient)
            console.log(data.resultDt?.recipientList?.dmtRecipient)
          } else {
            setAllRecipient([]);
          }
        } else {
          Alert.alert('Fail', 'Failed while fetching recipients. Please try after sometime.');
          setAllRecipient([]);
        }
        searchRecipient(data.resultDt?.recipientList?.dmtRecipient);
      } else {
        searchRecipient(allRecipient);
      }



    } catch (e) {
      console.log('Error while fetching recipient');
      console.log(e);
      Alert.alert('Error', 'Error while fetching recipients. Please try after sometime.');
      setAllRecipient([]);
    }

    setIsLoading(false);
  }
  // 50100349424441
  // 8144252726

  const onSearchValueInput = (value: string) => {
    setSearchValue(value);
    if (route.params.searchBy === 'mobile') {
      if (value.length === 10) {
        setDisableSearchButton(false); // enable the button if length is 10 
      } else {
        setDisableSearchButton(true); // disable the button if length is not 10
      }
    } else if (route.params.searchBy === 'acno') {
      if (value) {
        setDisableSearchButton(false); // enable the button if something is typed
      } else {
        setDisableSearchButton(true); // disable the button if emtpy
      }
    }



  }

  const onSearchCtaPress = async () => {
    console.log(searchValue)
    setSearchResult([]);
    await fetchAllRecipient();
  }



  const searchRecipient = (recipients: any[]) => {
    if (recipients.length > 0) {
      const filtered = recipients.filter((curr: any) => {
        if (route.params.searchBy === 'mobile') {
          return curr.mobileNumber === searchValue;
        } else if (route.params.searchBy === 'acno') {
          return curr.bankAccountNumber === searchValue;
        }
      });
      console.log(filtered)
      if (filtered.length > 0) {
        setSearchResult(filtered);
      } else {
        Alert.alert('Not Found', 'No Recipients found with the search criteria.');
      }
    } else {
      Alert.alert('Not Found', 'No Recipients found with the search criteria.');
    }
  }

  if (isLoading)
    return <Loading label='Searching for recipients...' />

  return (
    <View style={{ flex: 1, backgroundColor: colors.white, padding: 8 }}>
      <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: colors.primary500 }}>Transfer Money</Text>
      <View>
        <AnimatedInput
          value={searchValue}
          errorMessage={''}
          onChangeText={(text: string) => onSearchValueInput(text)}
          inputLabel={route.params.searchBy === 'mobile' ? 'Search by Mobile Number' : 'Search by Account Number'}
          keyboardType={'numeric'}
          maxLength={route.params.searchBy === 'mobile' ? 10 : null}
        />
      </View>

      <View>
        <ButtonPrimary onPress={onSearchCtaPress} label='Search' disabled={disableSearchButton} />
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={{ color: colors.primary200, fontSize: 14 }}>Please note that, you can search only added the recipients. If you have not added any recipients then please add the recipients in DMT menu.</Text>
      </View>

      <View style={{ marginVertical: 12 }}>
        {searchResult.length > 0 && <Text style={{ color: colors.primary500, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}> Search Result</Text>}
      </View>
      <View>
        {searchResult.length > 0 && searchResult.map((item: any) => {
          return <Pressable key={item.recipientId}
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: colors.primary200 }}>Mobile: {item.mobileNumber}</Text>
              <Text style={{ fontSize: 14, color: colors.primary200 }}>IFSC: {item.ifsc}</Text>
            </View>
          </Pressable>
        })}
      </View>

    </View>
  )
}

export default SearchDMTRecipient

const styles = StyleSheet.create({})