import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNav from './src/navigations/AppNav';
import { WalletProvider } from './src/context/WalletContext';

export default function App() {


  return (
    <AuthProvider>
        <AppNav />
    </AuthProvider>
  )
}

