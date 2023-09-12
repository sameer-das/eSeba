import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { FlatList, StyleSheet, View, Pressable, Text, Alert } from 'react-native';
import HomeCard from '../../components/HomeCard';
import colors from '../../constants/colors';
import { AuthContext } from '../../context/AuthContext';
import CarouselComponent from '../../components/Carousel';
import { windowWidth } from '../../utils/dimension';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';


const AllMenus = () => {
  const { menuCategories } = useContext(AuthContext);

  return <View style={styles.flatListContainer}>
    <FlatList
      data={menuCategories}
      keyExtractor={(item: any) => item.services_ID}
      renderItem={(item) => <HomeCard {...item} />}
      showsVerticalScrollIndicator={false} />
  </View>
}


// const Carousel = () => {
//   return <View style={{ height: 125, paddingHorizontal: 8, marginTop: 10 }}>
//     <CarouselComponent />
//   </View>
// }

const TopMoneyTransferMenu = () => {
  const navigation = useNavigation<any>();
  const { userData } = useContext(AuthContext);
  const onTransferMoneyMenuPress = (type: string) => {
    if (type === 'add_recipient') {
      navigation.navigate('AddDMTRecipientFromHomeScreen')
    } else if (type === 'check_balance') {
      Alert.alert('Coming Soon', 'This feature is currently not available.');
    } else if (type === 'to_mobile') {
      const searchBy = 'mobile';
      navigation.navigate('transferMoneyFromHomeScreenStack', { screen: 'searchDMTRecipient', params: { searchBy } })
    } else if (type === 'to_account') {
      const searchBy = 'acno';
      navigation.navigate('transferMoneyFromHomeScreenStack', { screen: 'searchDMTRecipient', params: { searchBy } })
    }
  }

  return <>
    <View style={{ height: 186, borderRadius: 10, backgroundColor: colors.homeScreenCardBg, marginHorizontal: 8, marginTop: 12 }}>
      <Text style={{ marginLeft: 8, marginTop: 8, fontSize: 20, lineHeight: 23, color: colors.white, fontWeight: 'bold' }}>Transfer Money</Text>
      <View style={{ height: 127, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>

        <Pressable onPress={() => onTransferMoneyMenuPress('to_mobile')} style={{ height: windowWidth / 4 - 14, width: windowWidth / 4 - 28, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ backgroundColor: colors.transferMoneyIconBg, width: '80%', height: '70%', borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
            <MaterialIcon name='smartphone' size={36} color={colors.white} />
          </View>
          <Text style={{ color: colors.white, textAlign: 'center', fontSize: 14 }}>To Mobile</Text>
          <Text style={{ color: colors.white, textAlign: 'center', fontSize: 14 }}>Number</Text>

        </Pressable>
        <Pressable onPress={() => onTransferMoneyMenuPress('to_account')} style={{ height: windowWidth / 4 - 14, width: windowWidth / 4 - 28, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ backgroundColor: colors.transferMoneyIconBg, width: '80%', height: '70%', borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
            <MaterialIcon name='account-balance' size={36} color={colors.white} />
          </View>
          <Text style={{ color: colors.white, textAlign: 'center', fontSize: 14 }}>To Bank</Text>
          <Text style={{ color: colors.white, textAlign: 'center', fontSize: 14 }}>Account</Text>
        </Pressable>
        <Pressable onPress={() => onTransferMoneyMenuPress('add_recipient')} style={{ height: windowWidth / 4 - 14, width: windowWidth / 4 - 28, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ backgroundColor: colors.transferMoneyIconBg, width: '80%', height: '70%', borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
            <MaterialIcon name='person-add' size={36} color={colors.white} />
          </View>
          <Text style={{ color: colors.white, textAlign: 'center', fontSize: 14 }}>Add New</Text>
          <Text style={{ color: colors.white, textAlign: 'center', fontSize: 14 }}>Recipient</Text>
        </Pressable>
        <Pressable onPress={() => onTransferMoneyMenuPress('check_balance')} style={{ height: windowWidth / 4 - 14, width: windowWidth / 4 - 28, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ backgroundColor: colors.transferMoneyIconBg, width: '80%', height: '70%', borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
            <MaterialIcon name='attach-money' size={36} color={colors.white} />
          </View>
          <Text style={{ color: colors.white, textAlign: 'center', fontSize: 14 }}>Check</Text>
          <Text style={{ color: colors.white, textAlign: 'center', fontSize: 14 }}>Balance</Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 4, alignItems: 'center', height: 31, backgroundColor: colors.primary500, borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }}>
        <View>
          <Text style={{ color: colors.white }}>My ID : {userData.user.login_Code}</Text>
        </View>

        <Pressable style={{ flexDirection: 'row', alignItems: 'center', }} onPress={() => {Alert.alert('Coming Soon', 'This feature is currently not available.')}}>
          <MaterialIcon name='qr-code' size={20} color={colors.white} />
          <Text style={{ fontSize: 14, lineHeight: 16.1, color: colors.white, marginHorizontal: 8 }}>My QR</Text>
          <MaterialIcon name='keyboard-arrow-right' size={20} color={colors.white} />

        </Pressable>
      </View>
    </View>

    <View style={styles.walletAwardReferContainer}>
      <Pressable onPress={() => { navigation.navigate('wallet') }} style={styles.walletAwardReferItem}><Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.white }}>Wallet</Text></Pressable>
      <View style={styles.walletAwardReferItem}><Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.white }}>NA</Text></View>
      <View style={styles.walletAwardReferItem}><Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.white }}>NA</Text></View>
    </View>

  </>
}


const Home = () => {
  // const { userData, menuCategories } = useContext(AuthContext);
  const drawerNavigation = useNavigation<any>();
  const title = drawerNavigation.getState().routeNames[drawerNavigation.getState().index].toUpperCase();
  const data = [
    // { component: <Carousel />, id: 1 },
    { component: <TopMoneyTransferMenu />, id: 2 },
    { component: <AllMenus />, id: 4 },
  ]

  return (
    <View style={styles.rootContainer}>
      <FlatList data={data}
        renderItem={({ item }) => {
          return item.component
        }}
        showsVerticalScrollIndicator={false} />

    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.pageDarkBg
  },
  homeHeader: {
    height: 70,
    backgroundColor: colors.primary500,
    alignItems: 'center',
    paddingHorizontal: 8,
    flexDirection: 'row'
  },
  routeName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8
  },
  flatListContainer: { padding: 8 },
  walletAwardReferContainer: { flexDirection: 'row', height: windowWidth / 3, gap: 8, marginHorizontal: 8, marginTop: 12 },
  walletAwardReferItem: { flex: 1, borderRadius: 12, height: windowWidth / 3 - 16, width: windowWidth / 3, backgroundColor: colors.primary500, justifyContent: 'center', alignItems: 'center' }
})