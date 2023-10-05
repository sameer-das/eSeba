
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import HelpSupport from './HelpSupport';
import MyTickets from './MyTickets';
const Stack = createNativeStackNavigator();

const HelpSupportStack = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name='helpSupport' component={HelpSupport} />
            <Stack.Screen name='myTickets' component={MyTickets}/>
        </Stack.Navigator>
    )
}

export default HelpSupportStack

