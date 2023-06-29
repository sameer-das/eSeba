import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../constants/colors';
import { windowHeight } from '../../utils/dimension';
import RecipientStack from './RecipientTab/ListRecipientTabStack';
import SendMoney from './SendMoneyTab/SendMoney';

const Tab = createBottomTabNavigator();
const DMTTabs = () => {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: colors.primary500, },
      tabBarActiveTintColor: colors.white,
      tabBarInactiveTintColor: colors.primary100,
      tabBarLabelStyle: { fontSize: 16},
      tabBarShowLabel: false
    }}>
      <Tab.Screen name="Send" component={SendMoney}
        options={{
          tabBarIcon: ({ focused, color }) => <MaterialIcon name="send" size={30} color={color}/>,
        }} />
      <Tab.Screen name="Recipients" component={RecipientStack}
        options={{
          tabBarIcon: ({ focused, color }) => <MaterialIcon name="format-list-bulleted" size={30} color={color}/>,
        }} />
    </Tab.Navigator>
  )
}

export default DMTTabs

const styles = StyleSheet.create({})