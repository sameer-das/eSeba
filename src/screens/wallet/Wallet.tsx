import { StyleSheet, Text, View, Pressable, Alert, RefreshControl, ScrollView, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import colors from '../../constants/colors';
import { AuthContext } from '../../context/AuthContext';
import { generateOtpForWalletPinChange, getWalletBalance } from '../../API/services';
import Loading from '../../components/Loading';


const Wallet = ({ navigation }: any) => {
  const { userData } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingText, setShowLoadingText] = useState(false);
  const [walletBalance, setWalletBallance] = useState('');
  const [commissionEarned, setCommissionEarned] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchWalletBalance = async (email: string, withRefresh: boolean) => {
    setShowLoadingText(true);
    try {
      const { data } = await getWalletBalance(email);
      console.log(data)
      if (data.status === 'Success' && data.code === 200) {
        console.log('Wallet Fetched')
        const [walletBalance, commission] = data.data.split(',');
        setWalletBallance(walletBalance);
        setCommissionEarned(commission);
      } else {
        Alert.alert('Error', 'Something went wrong while fetching wallet balance.', [{
          text: 'Ok',
          onPress: () => {
            navigation.goBack()
          }
        }])
      }
    } catch (e) {
      Alert.alert('Error', 'Error while fetching wallet balance.', [{
        text: 'Ok',
        onPress: () => {
          navigation.goBack()
        }
      }])
    } finally {
      withRefresh && setRefreshing(false);
      setShowLoadingText(false);
    }
  }

  // fetch wallet balance
  // useEffect(() => {
  //   fetchWalletBalance(userData.user.user_EmailID, false)
  // }, [])


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Wallet focus fetch balance');
      fetchWalletBalance(userData.user.user_EmailID, false)
    });
    return unsubscribe;
  }, [])

  if (isLoading) {
    return (<Loading label={"Brewing at back"} />)
  }


  const onRefresh = () => {
    setRefreshing(true);
    console.log('Pull Refresh fetch balance');
    fetchWalletBalance(userData.user.user_EmailID, true);
  }

  const onForgotPinClick = () => {
    // navigation.navigate('wallet', { screen: 'enterOTPForPinChange' });
    // return;
    Alert.alert('Forgot Wallet PIN',
      'An OTP will be sent to your registered mobile number and will be used to validate. Press OK to continue.',
      [
        {
          text: 'Ok',
          onPress: async () => {
            setIsLoading(true);
            try {
              //sendOtp 
              const { data } = await generateOtpForWalletPinChange(userData.user.user_ID);
              if (data.status === 'Success' && data.code === 200 && data.data === "OTP send to the user") {
                // navigate to otp screen
                setIsLoading(false);
                navigation.navigate('wallet', { screen: 'enterOTPForPinChange' });
              } else {
                setIsLoading(false);
                Alert.alert('Failed', 'OTP generation failed!, Please contact support!')
              }
            } catch (e) {
              setIsLoading(false);
              console.log('Error while sending otp to user');
              console.log(e);
              Alert.alert('Error', 'OTP generation error!, Please try after sometime.')
            }
          }
        },
        {
          text: 'Cancel',
          onPress: () => { }
        },
      ])
  }
  const RefreshLoader = <RefreshControl refreshing={refreshing} onRefresh={onRefresh}
    colors={[colors.primary500, colors.success500, colors.primary500]}
    progressBackgroundColor={colors.white} />
  // Actual JSX
  return (
    <ScrollView contentContainerStyle={styles.rootContainer}
      refreshControl={RefreshLoader}>
      <View style={styles.topCardContainer}>
        <View style={styles.innerCard}>
          <Text style={styles.cardTitle}>Wallet Balance</Text>
          {showLoadingText ? <ActivityIndicator size={30} color={colors.white}/> : <Text style={styles.cardValue}>₹ {walletBalance}</Text>}

        </View>
        <View style={styles.innerCard}>
          <Text style={styles.cardTitle}>Commission Earned</Text>
          <Text style={styles.cardValue}>₹ {commissionEarned}</Text>
        </View>
      </View>

      <Pressable style={styles.addMoneyButton} onPress={() => {
        navigation.navigate('wallet', { screen: 'rechargeWallet' });
      }}>
        <Text style={styles.addMoneyButtonLabel}>Recharge Wallet</Text>
      </Pressable>

      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8, gap: 12 }}>

        <Pressable style={styles.ChangePasswordButton} onPress={() => {
          navigation.navigate('wallet', { screen: 'changeWalletPin' });
        }}>
          <Text style={styles.ChangePasswordButtonLabel}>Change Wallet PIN</Text>
        </Pressable>
        <Pressable style={styles.ChangePasswordButton} onPress={onForgotPinClick}>
          <Text style={styles.ChangePasswordButtonLabel}>Forgot Wallet PIN</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

export default Wallet;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 8
  },
  topCardContainer: {
    height: 100,
    flexDirection: 'row',
    gap: 8
  },
  innerCard: {
    flex: 1,
    backgroundColor: colors.primary500,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardTitle: {
    fontSize: 18,
    color: colors.white,
  },
  cardValue: {
    fontSize: 28,
    color: colors.white,
    fontWeight: 'bold'
  },
  addMoneyButton: {
    paddingVertical: 16,
    backgroundColor: colors.primary500,
    borderRadius: 8,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addMoneyButtonLabel: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold'
  },
  ChangePasswordButtonLabel: {
    color: colors.primary500,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold'

  },
  ChangePasswordButton: {
    paddingVertical: 16,
    flex: 1,
    borderColor: colors.primary500,
    borderWidth: 1,
    borderRadius: 8
  }
})