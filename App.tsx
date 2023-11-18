import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNav from './src/navigations/AppNav';
import { WalletProvider } from './src/context/WalletContext';
import {StatusBar} from 'react-native';
import colors from './src/constants/colors';
export default function App() {


  return (
    <AuthProvider>
      <StatusBar backgroundColor={colors.homeScreenCardBg}/>
        <AppNav />
    </AuthProvider>
  )
}

