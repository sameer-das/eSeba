import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import DocumentImage from '../../../components/DocumentImage';
import colors from '../../../constants/colors';
import { AuthContext } from '../../../context/AuthContext';


const Documents = () => {
  const navigation = useNavigation<any>();
  const { userData } = useContext(AuthContext);

  const time = new Date().getTime();
  console.log('Documents rerun')
  const editButtonPressHandler = (type: string) => {
    // console.log('Presses ' + type)
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


  const ImageLoader = <View style={{ position: 'absolute' }}>
    <ActivityIndicator size={40} color={colors.primary100} />
    <Text style={styles.imageLoadingText}>Image Loading</Text>
  </View>

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
          <DocumentImage imageUrl={`${userData.kycDetail?.passport_Photo}&time=${time}`}  />
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
          <Text style={styles.adharNumber}>Adhar No : {userData.kycDetail?.aadhar_Number}</Text>
        </View>

        <Text style={styles.imageLabel}>Adhar Front Side Pic</Text>
        <View style={styles.imageContainer}>
          <DocumentImage imageUrl={userData.kycDetail?.aadhar_FontPhoto} />
        </View>
        <Text style={styles.imageLabel}>Adhar Back Side Pic</Text>
        <View style={styles.imageContainer}>
          <DocumentImage imageUrl={userData.kycDetail?.aadhar_BackPhoto} />
          {/* {userData.kycDetail?.aadhar_BackPhoto && imageLoading.adharBack && ImageLoader}
          {userData.kycDetail?.aadhar_BackPhoto && <Image source={
            {
              uri: `https://api.esebakendra.com/api/User/Download?fileName=${userData.kycDetail?.aadhar_BackPhoto}`,
            }}
            style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
            onLoadStart={() => setImageLoading({ ...imageLoading, adharBack: true })}
            onLoadEnd={() => setImageLoading({ ...imageLoading, adharBack: false })} />} */}
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
          <Text style={styles.adharNumber}>PAN : {userData.kycDetail?.pancard_Number?.toUpperCase()}</Text>
        </View>

        <Text style={styles.imageLabel}>PAN Card Pic</Text>
        <View style={styles.imageContainer}>
          <DocumentImage imageUrl={userData.kycDetail?.pancard_Photo} />
          {/* {userData.kycDetail?.pancard_Photo && imageLoading.pan && ImageLoader}
          {userData.kycDetail?.pancard_Photo && <Image source={
            {
              uri: `https://api.esebakendra.com/api/User/Download?fileName=${userData.kycDetail?.pancard_Photo}`,
            }}
            style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
            onLoadStart={() => setImageLoading({ ...imageLoading, pan: true })}
            onLoadEnd={() => setImageLoading({ ...imageLoading, pan: false })} />} */}
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
          <Text style={styles.adharNumber}>GSTN : {userData.kycDetail?.gsT_Number}</Text>
        </View>

        <Text style={styles.imageLabel}>GST Certificate Pic</Text>
        <View style={[styles.imageContainer]}>
          <DocumentImage imageUrl={userData.kycDetail?.gsT_Photo} />
          {/* {userData.kycDetail?.gsT_Photo && imageLoading.gst && ImageLoader}
          {userData.kycDetail?.gsT_Photo && <Image source={
            {
              uri: `https://api.esebakendra.com/api/User/Download?fileName=${userData.kycDetail?.gsT_Photo}`,
            }}
            style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
            onLoadStart={() => setImageLoading({ ...imageLoading, gst: true })}
            onLoadEnd={() => setImageLoading({ ...imageLoading, gst: false })} />} */}
        </View>
      </View>
    </ScrollView>
  )
}

export default Documents

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

    justifyContent: 'center',
    alignItems: 'center'

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
  },
  imageLoadingText: {
    fontSize: 14,
    color: colors.primary100
  }
})