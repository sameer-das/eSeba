import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { getSenderInfo } from '../../API/services';
import Loading from '../../components/Loading';
import colors from '../../constants/colors';
import { AuthContext } from '../../context/AuthContext';
import AddSender from './AddSender/AddSender';
import RecipientStack from './RecipientTab/ListRecipientTabStack';
import ListRecipientsToSendMoney from './SendMoneyTab/ListRecipientsToSendMoney';
import DMTOtpScreen from './AddSender/DMTOtpScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SendMoneyForm from './SendMoneyTab/SendMoneyForm';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AddSenderStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='addSender' component={AddSender} />
      <Stack.Screen name='dmtOtpScreen' component={DMTOtpScreen} />
    </Stack.Navigator>
  )
}

const SendMoneyStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='listSenderToSend' component={ListRecipientsToSendMoney} />
      <Stack.Screen name='sendMoneyForm' component={SendMoneyForm} />
    </Stack.Navigator>
  )
}

const DMTTabs = () => {
  const { userData } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddSender, setShowAddSender] = useState(false);

  const senderinfo = async () => {
    const payload = {
      "requestType": "SenderDetails",
      "senderMobileNumber": userData.user.mobile_Number,
      "txnType": "IMPS"
    }

    try {
      setIsLoading(true);
      const { data } = await getSenderInfo(payload);
      console.log(data);
      if (data.code === 200 && data.status === 'Success' && (data.resultDt.senderMobileNumber === 0 || !data.resultDt.senderName)) {
        // sender not found
        setShowAddSender(true);
        setIsLoading(false)
      } else {
        // sender found
        setShowAddSender(false);
        setIsLoading(false)
      }
    } catch (e) {
      console.log('Error Fetching Sender for DMT');
      console.log(e)
    }
  }

  useEffect(() => {
    senderinfo()
  }, [])


  if (isLoading)
    return <Loading label={'Fetching your details'} />

  if (!isLoading && showAddSender) {
    return <AddSenderStack />
  } else if (!isLoading && !showAddSender) {
    return (
      <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.primary500, height: 65 },
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.primary100,
        tabBarLabelStyle: { fontSize: 18, marginBottom: 8 },
        // tabBarShowLabel: false
      }}>
        <Tab.Screen name="Send" component={SendMoneyStack}
          options={{
            tabBarIcon: ({ focused, color }) => <MaterialIcon name="send" size={25} color={color} />,
          }} />
        <Tab.Screen name="Recipients" component={RecipientStack}
          options={{
            tabBarIcon: ({ focused, color }) => <MaterialIcon name="format-list-bulleted" size={30} color={color} />,
          }} />
      </Tab.Navigator>
    )
  }

  return <></>
}

export default DMTTabs

const styles = StyleSheet.create({})