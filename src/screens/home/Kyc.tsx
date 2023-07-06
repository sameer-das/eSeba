import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import colors from '../../constants/colors';


const Kyc = () => {
  const navigation = useNavigation<any>();

  const editButtonPressHandler = (type: string) => {
    console.log('Presses ' + type)
    if (type === 'adhar') {
      navigation.navigate('updateAdhar');
    } else if (type === 'pan') {
      navigation.navigate('updatePan');
    } else if (type === 'profilepic') {
      navigation.navigate('updateProfilePic');
    } else if (type === 'gst') {
      navigation.navigate('updateGst');
    }
  }

  return (
    <ScrollView style={styles.rootContainer}>
      {/* Passport size photo */}
      <View style={styles.cardContainer}>
        <Pressable style={styles.cardHeaderContainer}>
          <Text style={styles.cardHeader}>Passport Size Photo</Text>
          <Pressable onPress={() => editButtonPressHandler('profilepic')} style={{ paddingVertical: 4, paddingHorizontal: 8, backgroundColor: colors.primary300, borderRadius: 16 }}>
            <Text style={styles.editButton}>Edit</Text>
          </Pressable>
        </Pressable>
        <View style={styles.imageContainer}>
          <Image source={
            {
              uri: 'https://api.esebakendra.com/api/User/Download?fileName=AYQPO5896LPan.jpg',
              method: 'GET'
            }} style={{ height: '100%', width: '100%', resizeMode: 'contain' }} />
        </View>
      </View>

      {/* Adhar */}
      <View style={styles.cardContainer}>
        <Pressable style={styles.cardHeaderContainer} >
          <Text style={styles.cardHeader}>Adhar Details</Text>
          <Pressable onPress={() => editButtonPressHandler('adhar')} style={{ paddingVertical: 4, paddingHorizontal: 8, backgroundColor: colors.primary300, borderRadius: 16 }}>
            <Text style={styles.editButton}>Edit</Text>
          </Pressable>
        </Pressable>
        <View style={styles.adharNumberContainer}>
          <Text style={styles.adharNumber}>Adhar No : 1236 5698 5256</Text>
        </View>

        <Text style={styles.imageLabel}>Adhar Front Side Pic</Text>
        <View style={styles.imageContainer}>
          <Image source={
            {
              uri: 'https://api.esebakendra.com/api/User/Download?fileName=111122223333Front.jpg',
              method: 'GET'
            }} style={{ height: '100%', width: '100%', resizeMode: 'contain' }} />
        </View>
        <Text style={styles.imageLabel}>Adhar Back Side Pic</Text>
        <View style={styles.imageContainer}>
          <Image source={
            {
              uri: 'https://api.esebakendra.com/api/User/Download?fileName=111122223333Back.jpg',
              method: 'GET'
            }} style={{ height: '100%', width: '100%', resizeMode: 'contain' }} />
        </View>
      </View>

      {/* PAN */}
      <View style={styles.cardContainer}>
        <Pressable style={styles.cardHeaderContainer}>
          <Text style={styles.cardHeader}>PAN Details</Text>
          <Pressable onPress={() => editButtonPressHandler('pan')} style={{ paddingVertical: 4, paddingHorizontal: 8, backgroundColor: colors.primary300, borderRadius: 16 }}>
            <Text style={styles.editButton}>Edit</Text>
          </Pressable>
        </Pressable>
        <View style={styles.adharNumberContainer}>
          <Text style={styles.adharNumber}>PAN : AYQPD3866P</Text>
        </View>

        <Text style={styles.imageLabel}>PAN Card Pic</Text>
        <View style={styles.imageContainer}>
          <Image source={
            {
              uri: 'https://api.esebakendra.com/api/User/Download?fileName=AYQPO5896LPan.jpg',
              method: 'GET'
            }} style={{ height: '100%', width: '100%', resizeMode: 'contain' }} />
        </View>
      </View>

      {/* GST Certificate */}
      <View style={styles.cardContainer}>
        <Pressable style={styles.cardHeaderContainer}>
          <Text style={styles.cardHeader}>GST Details</Text>
          <Pressable onPress={() => editButtonPressHandler('gst')} style={{ paddingVertical: 4, paddingHorizontal: 8, backgroundColor: colors.primary300, borderRadius: 16 }}>
            <Text style={styles.editButton}>Edit</Text>
          </Pressable>
        </Pressable>
        <View style={styles.adharNumberContainer}>
          <Text style={styles.adharNumber}>GSTN : 37AADCS0472N1Z1</Text>
        </View>

        <Text style={styles.imageLabel}>GST Certificate Pic</Text>
        <View style={styles.imageContainer}>
          <Image source={
            {
              uri: 'https://api.esebakendra.com/api/User/Download?fileName=AYQPO5896LPan.jpg',
              method: 'GET'
            }} style={{ height: '100%', width: '100%', resizeMode: 'contain' }} />
        </View>
      </View>
    </ScrollView>
  )
}

export default Kyc

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 8
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: colors.primary100,
    borderRadius: 8,
    marginBottom: 16,
  },
  cardHeaderContainer: {
    backgroundColor: colors.primary500,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardHeader: {
    fontSize: 20,
    color: colors.white
  },
  adharNumberContainer: {
    marginVertical: 20,
    paddingHorizontal: 8
  },
  adharNumber: {
    fontSize: 18,
    color: colors.primary500,
    fontWeight: 'bold'
  },
  imageContainer: {
    width: '100%',
    height: 180,
    marginVertical: 8,
    paddingHorizontal: 8,

  },
  imageLabel: {
    fontSize: 16,
    color: colors.primary500,
    fontWeight: 'bold',
    marginLeft: 8
  },
  editButton: {
    fontSize: 16,
    color: colors.white
  }
})