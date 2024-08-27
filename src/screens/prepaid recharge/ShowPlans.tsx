import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View, ScrollView, useWindowDimensions } from 'react-native';
import { getMobileNumberDetails, getPlanForMobileNo } from '../../API/services';
import Loading from '../../components/Loading';
import colors from '../../constants/colors';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ContactAndOperatorDetailCard from '../../components/ContactAndOperatorDetailCard';
import MobilePlanCard from '../../components/MobilePlanCard';
import PlanTabView from './PlanTabView';

const groupPlans = (plans: any[]) => {
  if (plans.length === 0) return [];

  const result: any[] = [];
  // iterate over plans
  plans.forEach((rechargePlan: any) => {
    // find if the array contains the current plan
    const x = result.find((curr) => curr.planName === rechargePlan.planName);
    // check if any object is there with current plan name
    if (x) {
      // if found the any object with current plan name then push current rechargPlan to plan array
      x.plans.push(rechargePlan);
    } else {
      // if any object with current plan name not found then create one object with current plan name and push to result array
      result.push({ planName: rechargePlan.planName, plans: [] });
    }
  });
  return result;
}


const ShowPlans = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const [planDetails, setPlanDetails] = useState<any[]>([]);
  const [filteredPlanDetails, setFilteredPlanDetails] = useState<any[]>(planDetails);
  const [groupedPlan, setGroupedPlan] = useState<any[]>([]);
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
          setGroupedPlan(groupPlans(planResponse?.data?.resultDt?.data?.rechargePlan?.rechargePlansDetails));
        }
      }
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }

  }



  useEffect(() => {
    getMobileDetails();    
  }, []);

  useEffect(() => {
    const filterd = planDetails.filter((plan: any) => {
      const _searchText = planSearchText.toLowerCase().trim();
      return plan.amount.toString().toLowerCase().indexOf(_searchText) >= 0 ||
        plan.description.toLowerCase().indexOf(_searchText) >= 0 ||
        plan.validity.toLowerCase().indexOf(_searchText) >= 0 ||
        plan.planName.toLowerCase().indexOf(_searchText) >= 0
    })
    setFilteredPlanDetails(filterd);
  }, [planDetails, planSearchText])



  const onPlanPress = async (item: any) => {
    await AsyncStorage.setItem('rechargePlan', JSON.stringify(item));
    let isCommission: boolean = true;
    if ('isCommission' in (route.params as any)) {
      isCommission = (route.params as any).isCommission
    }
    await AsyncStorage.setItem('rechargeIsCommission', JSON.stringify(isCommission));

    navigation.navigate('proceedToPay');
  }


  const planSearchHandler = (searchText: string) => {
    setPlanSearchText(searchText);
  }




  if (isLoading)
    return <Loading label={'Hang tight! We are fetching the details!'} />

  return (
    <View style={styles.rootContainer}>
      <ContactAndOperatorDetailCard />

      <View style={styles.searchboxContainer}>
        <TextInput style={styles.searchboxInput}
          placeholder='Search plan or validity'
          keyboardType='default'
          value={planSearchText}
          onChangeText={planSearchHandler}
          placeholderTextColor={colors.primary500} />
      </View>

      {planSearchText ? 
      <View style={styles.listContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredPlanDetails}
          renderItem={({ item }) => <MobilePlanCard item={item} handlePress={onPlanPress} />} />
      </View> : <PlanTabView plans={groupedPlan} handlePress={onPlanPress}/>}


    </View>
  )





}

export default ShowPlans

const styles = StyleSheet.create({
  rootContainer: { flex: 1, padding: 8, paddingBottom: 0 },
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
    paddingHorizontal: 6,
    borderRadius: 8,
    borderColor: colors.primary500
  },
  searchboxInput: {
    fontSize: 16,
    color: colors.primary500,
    width: '100%'
  }
})