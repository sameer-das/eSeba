import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import HomeCard from '../../components/HomeCard';
import colors from '../../constants/colors';
import { AuthContext } from '../../context/AuthContext';



const Home = () => {
  const { userData, menuCategories } = useContext(AuthContext);
  const drawerNavigation = useNavigation<any>();
  const title = drawerNavigation.getState().routeNames[drawerNavigation.getState().index].toUpperCase();

  return (
    <View style={styles.rootContainer}>
      <View style={styles.flatListContainer}>
        <FlatList
          data={menuCategories}
          keyExtractor={(item: any) => item.services_ID}
          renderItem={(item) => <HomeCard {...item} />}
          showsVerticalScrollIndicator={false} />
      </View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  homeHeader: {
    height: 70,
    backgroundColor: colors.primary500,
    alignItems: 'center',
    paddingHorizontal: 8,
    flexDirection:'row'
  },
  routeName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8
  },
  flatListContainer: {padding: 8}

})