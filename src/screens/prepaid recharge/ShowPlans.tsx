import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { getMobileNumberDetails, getPlanForMobileNo } from '../../API/services';
import Loading from '../../components/Loading';
import colors from '../../constants/colors';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ContactAndOperatorDetailCard from '../../components/ContactAndOperatorDetailCard';
import MobilePlanCard from '../../components/MobilePlanCard';

const ShowPlans = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const [planDetails, setPlanDetails] = useState<any[]>([]);
  const [filteredPlanDetails, setFilteredPlanDetails] =  useState<any[]>([]);
  const [planSearchText, setPlanSearchText] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false)


  const getMobileDetails = async () => {
    try {
      setIsLoading(true);
      const { data } = await getMobileNumberDetails((route.params as any).number.trim().substr(-10));
      console.log(data);
      if (data.code === 200 && data.status === 'Success' && data.resultDt !== "") {
        await AsyncStorage.setItem('rechargeContactDetail', JSON.stringify({ ...data.resultDt.data, contactName: (route.params as any).name }))
        // setMobileDetails(data.resultDt.data);


        const planResponse = await getPlanForMobileNo(data.resultDt.data.currentOptBillerId, data.resultDt.data.currentLocation)
        if (planResponse.data.code === 200 && planResponse.data.status === 'Success' && planResponse.data.resultDt !== "") {
          setPlanDetails(planResponse?.data?.resultDt?.data?.rechargePlan?.rechargePlansDetails);
          setFilteredPlanDetails(planResponse?.data?.resultDt?.data?.rechargePlan?.rechargePlansDetails);
        }
      }
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }

  }



  useEffect(() => {
    getMobileDetails()
  }, []);


  if (isLoading)
    return <Loading label={'Hang tight! We are fetching the details!'} />


  const onPlanPress = async (item: any) => {
    console.log(item);
    await AsyncStorage.setItem('rechargePlan', JSON.stringify(item))
    navigation.navigate('proceedToPay');
  }

  console.log(planDetails[0])
  const planSearchHandler = (searchText: string) => {
    const _searchText = searchText.toLowerCase().trim();
    console.log(_searchText)
    if(_searchText === '')
      setFilteredPlanDetails(planDetails);
    else {
      const filterd = planDetails.filter((plan:any) =>{
        return plan.amount.toString().toLowerCase().indexOf(_searchText) >= 0 || 
          plan.description.toLowerCase().indexOf(_searchText) >= 0 ||
          plan.validity.toLowerCase().indexOf(_searchText) >= 0 ||
          plan.planName.toLowerCase().indexOf(_searchText) >= 0
      })
      setFilteredPlanDetails(filterd);
    }    
    setPlanSearchText(searchText);
  }

  return (
    <View style={styles.rootContainer}>
      <ContactAndOperatorDetailCard />

      <View style={styles.listContainer}>
        <View style={styles.searchboxContainer}>
          <TextInput style={styles.searchboxInput} 
          placeholder='Search plan or validity' 
          keyboardType='default'
          value={planSearchText}
          onChangeText={planSearchHandler}
          placeholderTextColor={colors.primary300} />
        </View>
        <FlatList showsVerticalScrollIndicator={false} data={filteredPlanDetails}
          renderItem={({ item }) => <MobilePlanCard item={item} handlePress={onPlanPress} />} />
      </View>
    </View>
  )
}

export default ShowPlans

const styles = StyleSheet.create({
  rootContainer: { flex: 1, padding: 8 },
  mobileDetials: {
    padding: 8,
    backgroundColor: colors.primary200,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  mobileNoLabel: {
    fontSize: 16,
    color: colors.white,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  mobileOperatorLabel: {
    fontSize: 16,
    color: colors.white,
  },
  mobileCircleLable: {
    fontSize: 16,
    color: colors.white,
  },

  listContainer: {
    marginTop: 12
  },
  searchboxContainer: {
    marginVertical: 8,
    borderWidth: 2,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 24,
    borderColor: colors.primary500
  },
  searchboxInput: {
    fontSize: 18,
    color: colors.primary500,
    width: '100%'
  }
})