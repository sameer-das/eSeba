import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, PermissionsAndroid } from 'react-native';
import DocumentImage from '../../../components/DocumentImage';
import colors from '../../../constants/colors';
import { AuthContext } from '../../../context/AuthContext';
import { getUserVerifiedAdharaDetails, getUserVerifiedPanDetail } from '../../../API/services';
import Loading from '../../../components/Loading';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const Documents = () => {
    const navigation = useNavigation<any>();
    const { userData } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [userVerifiedAdharaDetails, setUserVerifiedAdharaDetails] = useState<any>();
    const [userVerifiedPan, setUserVerifiedPan] = useState<null | string>(null);

    const [userVerifiedAdharNo, setUserVerifiedAdharNo] = useState();

    const isFocused = useIsFocused();

    // Fetch the details
    useEffect(() => {
        const _getUserVerifiedAdharDetails = async () => {
            try {
                setIsLoading(true)
                const { data } = await getUserVerifiedAdharaDetails(userData.user.user_ID);
                console.log(data)
                if (data.code === 200 && data.status === 'Success') {
                    setUserVerifiedAdharaDetails(JSON.parse(data.data));
                    setUserVerifiedAdharNo(JSON.parse(data.data)?.data?.aadhaar_number);
                } else {
                    setUserVerifiedAdharaDetails(null);
                }
            } catch (error) {
                setUserVerifiedAdharaDetails(null);
            } finally {
                setIsLoading(false);
            }
        }


        const _getUserVerifiedPanDetail = async () => {
            try {
                setIsLoading(true)
                const { data: resp } = await getUserVerifiedPanDetail(userData.user.user_ID);
                console.log(resp)
                if (resp.code === 200 && resp.status === 'Success') {
                    setUserVerifiedPan(JSON.parse(resp.data)?.data?.pan_number)
                } else {
                    setUserVerifiedPan('');
                }
            } catch (error) {
                setUserVerifiedPan('');
            } finally {
                setIsLoading(false);
            }
        }

        if(isFocused) {
            _getUserVerifiedAdharDetails();
            _getUserVerifiedPanDetail();
        }

    }, [isFocused])




    const editButtonPressHandler = async (type: string) => {

        let checkStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
        let checkCamera = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
        console.log(checkStorage, checkCamera);

        if (!checkCamera) {
            let permissionCamera = await PermissionsAndroid
                .request(PermissionsAndroid.PERMISSIONS.CAMERA)
            console.log(permissionCamera)
            checkCamera = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
        }

        if (!checkStorage) {
            let permissionExt = await PermissionsAndroid
                .request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
            console.log(permissionExt)
            checkStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
        }


        if (checkCamera || checkStorage) {
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
    }




    const ImageLoader = <View style={{ position: 'absolute' }}>
        <ActivityIndicator size={40} color={colors.primary100} />
        <Text style={styles.imageLoadingText}>Image Loading</Text>
    </View>

    if (isLoading) {
        return <Loading />
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
                    <DocumentImage imageUrl={`${userData.kycDetail?.passport_Photo}`} />
                </View>
            </View>

            {/* Adhar */}
            <View style={styles.cardContainer}>
                <Pressable style={styles.cardHeaderContainer} >
                    <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                        <Text style={styles.cardHeader}>Adhar Details</Text>
                        {/* <MaterialIcon size={20} name={userVerifiedAdharaDetails?.data?.aadhaar_number ? 'check' : 'close'} /> */}
                    </View>

                    <Pressable onPress={() => editButtonPressHandler('adhar')} style={{ paddingVertical: 4, paddingHorizontal: 8, backgroundColor: colors.primary300, borderRadius: 16 }}>
                        <Text style={styles.editButton}>Edit</Text>
                    </Pressable>
                </Pressable>
                <View style={styles.adharNumberContainer}>
                    <Text style={styles.adharNumber}>Adhar No : {userVerifiedAdharNo || 'Not Available'}</Text>
                </View>

                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems: 'center', paddingHorizontal: 8, paddingBottom: 8}}>
                        {
                            userVerifiedAdharNo ?
                                <Text style={{ color: 'limegreen' }}>Verified</Text> :
                                <Text style={{ color: 'orangered' }}>Not Verified</Text>
                        }

                        {
                            (userData.kycDetail.aadhar_Number === userVerifiedAdharNo) ? 
                                <Text style={{ color: 'limegreen' }}>Uploaded</Text> :
                                <Text style={{ color: 'orangered' }}>Not Uplaoded</Text>
                        }
                </View>


                {/* Show the pics of only adhar details uploaded  */}

                {
                    (userVerifiedAdharNo && (userData.kycDetail.aadhar_Number === userVerifiedAdharNo)) &&
                    <>
                        <Text style={styles.imageLabel}>Adhar Front Side Pic</Text>
                        <View style={styles.imageContainer}>
                            <DocumentImage imageUrl={userData.kycDetail?.aadhar_FontPhoto} />
                        </View>
                        <Text style={styles.imageLabel}>Adhar Back Side Pic</Text>
                        <View style={styles.imageContainer}>
                            <DocumentImage imageUrl={userData.kycDetail?.aadhar_BackPhoto} />
                        </View>
                    </>
                }

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
                    <Text style={styles.adharNumber}>PAN : {userVerifiedPan}</Text>
                </View>

                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems: 'center', paddingHorizontal: 8, paddingBottom: 8}}>
                        {
                            userVerifiedPan ?
                                <Text style={{ color: 'limegreen' }}>Verified</Text> :
                                <Text style={{ color: 'orangered' }}>Not Verified</Text>
                        }

                        {
                            (userData.kycDetail.pancard_Number === userVerifiedPan) ? 
                                <Text style={{ color: 'limegreen' }}>Uploaded</Text> :
                                <Text style={{ color: 'orangered' }}>Not Uplaoded</Text>
                        }
                </View>

                <Text style={styles.imageLabel}>PAN Card Pic</Text>
                <View style={styles.imageContainer}>
                    <DocumentImage imageUrl={userData.kycDetail?.pancard_Photo} />
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 4,
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