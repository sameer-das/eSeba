import { StyleSheet, Text, View, Pressable, Alert, RefreshControl, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import colors from '../../constants/colors';
import { AuthContext } from '../../context/AuthContext';
import { getWalletBalance } from '../../API/services';
import Loading from '../../components/Loading';


const Wallet = ({ navigation }: any) => {
  const { userData } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [walletBalance, setWalletBallance] = useState('');
  const [commissionEarned, setCommissionEarned] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchWalletBalance = async (email: string, withRefresh: boolean) => {
    !withRefresh && setIsLoading(true);
    try {
      const { data } = await getWalletBalance(email);
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
      !withRefresh && setIsLoading(false);
      withRefresh && setRefreshing(false);
    }
  }

  // fetch wallet balance
  useEffect(() => {
    fetchWalletBalance(userData.user.user_EmailID, false)
  }, [])



  if (isLoading) {
    return (<Loading label={"Brewing at back"} />)
  }


  const onRefresh = () => {
    setRefreshing(true)
    fetchWalletBalance(userData.user.user_EmailID, true);
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
          <Text style={styles.cardValue}>₹ {walletBalance}</Text>
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

      <Pressable style={styles.ChangePasswordButton}  onPress={() => {
        navigation.navigate('wallet', { screen: 'changeWalletPin' });
      }}>
        <Text style={styles.ChangePasswordButtonLabel}>Change Wallet PIN</Text>
      </Pressable>
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
    fontWeight:'bold'
  },
  ChangePasswordButtonLabel: {
    color: colors.primary500,
    fontSize: 18,
    textAlign: 'center',
    
  },
  ChangePasswordButton: {
    padding: 16,
    marginTop: 16
  }
})