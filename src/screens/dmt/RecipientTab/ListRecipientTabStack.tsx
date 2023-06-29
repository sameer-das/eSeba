import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import AddRecipient from './AddRecipient';
import ListRecipient from './ListRecipient';

const Stack = createNativeStackNavigator();

const RecipientStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='ListRecipients' component={ListRecipient} />
      <Stack.Screen name='AddRecipient' component={AddRecipient} />
    </Stack.Navigator>
  )
}

export default RecipientStack

const styles = StyleSheet.create({})