import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/home/Home';
import FetchBillDetails from '../screens/bbps/FetchBillDetails';


const Stack = createNativeStackNavigator();

const HomeScreenStack = () => {
  return (
   <Stack.Navigator>
    <Stack.Screen name='home' component={Home} options={{headerShown: true}}/>
    <Stack.Screen name='fetchbill' component={FetchBillDetails} options={{headerShown: false}}/>
   </Stack.Navigator>
  )
}

export default HomeScreenStack

const styles = StyleSheet.create({})