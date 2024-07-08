import { Alert, Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useDebugValue, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useIsFocused } from '@react-navigation/native';
import { getBankMaster, getPmfbyStatus, getUserVerifiedAdharaDetails, getUserVerifiedPanDetail, pmfbyDocUpload, pmfbyRegistration, saveUserKycDetails } from '../../API/services';
import colors from '../../constants/colors';
import { windowWidth } from '../../utils/dimension';
import DocumentImage from '../../components/DocumentImage';
import AnimatedInput from '../../components/AnimatedInput';
import ButtonPrimary from '../../components/ButtonPrimary';
import Loading from '../../components/Loading';
import SelectBoxWithLabelAndError from '../../components/SelectBoxWithLabelAndError';
import CustomImagePicker from '../../components/CustomImagePicker';
import { string } from 'yup';

const PmfbyHome = () => {

    const { userData } = useContext(AuthContext);
    const isFocused = useIsFocused();
    const [pmfbyStatusData, setPmfbyStatusData] = useState<null | any>(null);
    const [aadharDetails, setAadharDetails] = useState<null | any>(null);
    const [panDetails, setPanDetails] = useState<null | any>(null);
    const [fatherName, setFatherName] = useState<string>('');
    const [education, setEducation] = useState<any>();
    const [educationDocument, setEducationDocument] = useState<any>();
    const [bankMaster, setBankMaster] = useState<any>(null);
    const [bankName, setBankName] = useState<string>('');


    const [isLoading, setIsLoading] = useState(false)

    const educationType = [
        { name: 'Below Secondary (10th)', value: '<10' },
        { name: 'Secondary (10th Pass)', value: '10' },
        { name: 'Senior Secondary (12th Pass)', value: '12' },
        { name: 'Graduate or Equivalent', value: 'graduate' },
        { name: 'Post Graduate and Above (Or Equivalent)', value: 'post graduate' },
    ]


    // Only run when focused
    useEffect(() => {

        const _getPmfbyStatus = async () => {
            try {
                const { data: resp } = await getPmfbyStatus(userData.user.mobile_Number);
                console.log('0 PMFBY resp=============');  
                console.log(resp.data)
                if (resp.status === 'Success' && resp.code === 200) {
                    if (resp.data.data?.index_id) {
                        setPmfbyStatusData(resp.data)
                    } else {
                        setPmfbyStatusData(null);
                    }
                } else {
                    Alert.alert('Failed', 'Failed while fetching PMFBY status');
                    setPmfbyStatusData(null);
                }
            } catch (error) {
                console.log(error);
                setPmfbyStatusData(null);
                Alert.alert('Error', 'Error while fetching PMFBY status');
            }
        }



        const _getUserVerifiedAdharDetails = async () => {
            try {
                setIsLoading(true)
                const { data } = await getUserVerifiedAdharaDetails(userData.user.user_ID);
                // console.log(data)
                if (data.code === 200 && data.status === 'Success') {
                    setAadharDetails(null);
                    if (!data.data) {
                        console.log('Verified Adhar not available');
                        // If verified adhar number is not there
                        setAadharDetails(null)
                    } else {
                        // If adhar no is already verified 
                        setAadharDetails(JSON.parse(data.data).data);
                    }
                }
            } catch (error) {

            } finally {
                setIsLoading(false);
            }
        }



        const _getUserVerifiedPanDetail = async () => {
            try {
                setIsLoading(true)
                const { data } = await getUserVerifiedPanDetail(userData.user.user_ID);
                // console.log(data)
                if (data.code === 200 && data.status === 'Success') {
                    if (JSON.parse(data.data)?.data) {
                       setPanDetails(JSON.parse(data.data)?.data);
                    } else {
                        setPanDetails(null);
                    }
                } else {
                    setPanDetails(null);
                }
            } catch (error) {
                console.log(error)
                setPanDetails(null);
            } finally {
                setIsLoading(false);
            }
        }



        const _getBankMaster = async () => {
            try {
                setIsLoading(true)
                const {data:resp} = await getBankMaster();
                if(resp.status === 'Success' && resp.code === 200) {
                    setBankMaster(resp.data);
                }
            } catch (error) {
                
            } finally {
                setIsLoading(false)
            }
        }



        if (isFocused) {
            _getPmfbyStatus();
            _getUserVerifiedAdharDetails();
            _getUserVerifiedPanDetail();

            if(Object.keys(userData?.bankDetail)?.length > 0) {
                _getBankMaster();
            }
        }

    }, [isFocused])



    // Populate Bank name
    useEffect(() => {
        if(bankMaster) {            
            const bank: any[] = bankMaster.filter((x: any) => x.id === userData?.bankDetail?.bank_ID);
            setBankName(bank && bank[0].bank_Name)
        }
    }, [bankMaster])



    // Document Uplaod
    const PMFBYDocUpload = async (indexId: number, educationCertUrl: string) => {
        const BASEURL = `https://api.esebakendra.com/api/User/Download?fileName=`
        const payload = {
            "index_id": indexId,
            "pan_image": BASEURL + userData.kycDetail?.pancard_Photo,
            "education_image": BASEURL + educationCertUrl,
            "profile_image": BASEURL + userData.kycDetail?.passport_Photo
        }
        console.log(payload);

        try {
            setIsLoading(true);
            const {data: resp} = await pmfbyDocUpload(payload, userData.user.user_ID);
            console.log('Doc upload resp=============');
            console.log(resp)
            if (resp.status === 'Success' && resp.code === 200) {
                if (resp.data?.code === 101) {
                    Alert.alert( 'Success', resp.data?.message );

                    const {data:stausResp } = await getPmfbyStatus(userData.user.mobile_Number); 
                    console.log('3 PMFBY resp=============');                  
                    console.log(stausResp)
                    setIsLoading(false);
                    if (stausResp.status === 'Success' && stausResp.code === 200) {
                        if (stausResp.data.data?.index_id) {
                            setPmfbyStatusData(resp.data?.data)
                        } else {
                            setPmfbyStatusData(null);
                        }
                    } else {
                        Alert.alert('Alert', 'Something went wrong.');
                    }  

                } else {
                    Alert.alert('Fail', resp.data?.message )
                }
            } else {
                Alert.alert('Fail', JSON.stringify(resp))
            }
        } catch (error) {
            console.log(error)
            Alert.alert('Fail', 'Failed to save data' )
        } finally{
            setIsLoading(false);
        }
       
    }



    const handleEnrollPress = () => {
        const confirmMessage = `Are you sure to enroll for PMFBY with the following details?\n
Mobile: ${userData.user.mobile_Number}
Email: ${userData.user.user_EmailID}\n   
Aadhar: ${aadharDetails?.aadhaar_number}
PAN: ${panDetails?.pan_number}
Father Name: ${fatherName}
Qualification : ${education.name}`;

        Alert.alert('Confirm',confirmMessage
            ,
            [{
                text: 'Confirm',
                onPress: () => {
                    console.log('Confirmed to go for enroll PMFBY');                    
                    enrollForPMFBY ()
                }
            }, {
                text: 'Cancel',
                onPress: () => {
                    console.log('Cancelled')
                    return;
                },
            }]);
    }



    // Enroll Button Press
    const enrollForPMFBY = async () => {

        let educationCertUrl;

        const getPanIssueDateFromDob = (date: string) => {
            return new Date(new Date(date).getTime() + (20 * 366 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
        }
        
        const getFullAddressFromAdharResponse = (add: any) => {
            return Object.entries(add).reduce((acc, curr) => { return acc + curr[1] + ", " }, "")
        }

        // Upload the education document to GESIL backend

        const educationCertificateUploadPayload = {
            kyC_ID: userData.kycDetail.kyC_ID,
            user_ID: userData.user.user_ID,
            aadhar_Number: "",
            aadhar_FontPhoto: "",
            aadhar_BackPhoto: "",
            pancard_Number: "",
            pancard_Photo: "",
            passport_Photo: "",
            gsT_Number: "",
            gsT_Photo: "",
            center_IndoorPhoto: "",
            center_OutDoorPhoto: "",
            user_Education: `education`,
            education_Photo: educationDocument
        };

        console.log('Education Cert upload payload =============');
        console.log(educationCertificateUploadPayload)

        try {
            setIsLoading(true);
            const { data: uploadResp } = await saveUserKycDetails(educationCertificateUploadPayload);
            console.log('Education Cert upload resp =============');
            console.log(uploadResp);

            if (uploadResp.code === 200 && uploadResp.status === 'Success') {
                setIsLoading(false);
                educationCertUrl = uploadResp.data.education_Photo;
                console.log('Education Cert URL :: ======= ' + educationCertUrl);
            } else {
                setIsLoading(false);
                Alert.alert('Fail', 'Failed to upload education certificate. Please try after sometime.')
                return;
            }
        } catch(error) {
            setIsLoading(false);
            console.log(error);
            Alert.alert('Error', 'Error while uploading education certificate. Please try again.');
            return;
        }
        

        if(!educationCertUrl || educationCertUrl === '') {
            Alert.alert('Error', 'Could not get the education certificate url! Please try again.');
            // return from the function;
            return;
        }


        // PMFBY Enroll *******************************

        const pmfby = {
            "posp_mobile": userData.user.mobile_Number,
            "email_id": userData.user.user_EmailID,
            "pan_no": panDetails?.pan_number,
            "pan_status": "active",
            "name_as_pan": panDetails?.full_name,
            "dob_as_pan": panDetails?.dob,
            "fathername_as_pan": fatherName.trim(),
            "pan_issue_date": getPanIssueDateFromDob(panDetails?.dob),
            // "masked_aadhaar_number": this.pan_verified_response.masked_aadhaar,

            // take the last 4 digit of adhar and append to XXXXXXXX (8 X's)
            // This is for people whose adhar is not linked with pan
            "masked_aadhaar_number": 'XXXXXXXX' + (String(aadharDetails?.aadhaar_number)).slice(8), 
            "name_as_aadhaar": aadharDetails?.full_name,
            "dob_as_aadhaar": aadharDetails?.dob,
            "gender_as_aadhaar": aadharDetails?.gender,
            "fathername_as_aadhaar": fatherName.trim(),
            "full_address": getFullAddressFromAdharResponse(aadharDetails?.address),
            "pincode": aadharDetails?.zip,
            "education": education?.value,
            "bank_account_number": userData?.bankDetail?.user_Account_Number,
            "bank_ifsc": userData?.bankDetail?.user_IFSCCode,
            "account_holder_name": userData?.bankDetail?.userAccount_HolderName,
            "bank_name": bankName
        }

        console.log('PMFBY enroll payload =============')
        console.log(pmfby);

        try {
            setIsLoading(true);
            const {data: resp} = await pmfbyRegistration(pmfby);
            console.log('PMFBY enroll resp=============');
            console.log(resp)
            if (resp.status === 'Success' && resp.code === 200) {
                setIsLoading(false);
                if (resp.data?.code === 101 && resp.data.data?.index_id) {
                    // It's pending status
                    // Call the document upload method
                    PMFBYDocUpload(+resp.data.data?.index_id, educationCertUrl)
                } else if (resp.data?.code === 104 || resp.data?.code === 102 ) {
                    // Its error status
                    Alert.alert('Alert', resp.data?.message);
                } else {
                    // Dont know the status so Call status API to get index_id
                    setIsLoading(true);
                    const {data:stausResp } = await getPmfbyStatus(userData.user.mobile_Number); 
                    console.log('1 PMFBY resp=============');                  
                    console.log(stausResp)
                    setIsLoading(false);
                    if (stausResp.status === 'Success' && stausResp.code === 200) {
                        if (stausResp.data.data?.index_id) {
                            PMFBYDocUpload(+stausResp.data.data?.index_id, educationCertUrl)
                        }
                    } else {
                        Alert.alert('Alert', 'Something went wrong.');
                    }                          
                }

            } else {
                setIsLoading(false);
                Alert.alert( 'Alert', "Server Error! Registration Unuccessful.")
            }
        } catch (error) {
            console.log(error)
            setIsLoading(false);
            Alert.alert( 'Error', "Server Error! Registration Unuccessful.")
        } finally {
            setIsLoading(false);
        }
        
    }



    




    // ********************** JSX *************************
    
    if(isLoading)
        return <Loading />

    return (
        <ScrollView style={{ flex: 1, padding: 8 }}>

            <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: colors.primary500,
                textAlign: 'center',
                marginVertical: 20
            }}>
                Pradhan Mantri Fasal Bima Yojana
            </Text>

            {pmfbyStatusData ?
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.primary500, textAlign: 'center', marginBottom: 14, textDecorationLine: 'underline' }}>Your Application Status</Text>
                    <Text style={[{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 14 }, { color: colors.primary500 }]}>{pmfbyStatusData.message}</Text>

                    <View style={{ marginTop: 12, alignItems: 'center' }}>
                        <Text style={styles.lable}>POSP ID : {pmfbyStatusData?.data?.posp_id}</Text>
                        <Text style={styles.lable}>Index ID : {pmfbyStatusData?.data?.index_id}</Text>
                    </View>

                    <View style={{ marginTop: 12, alignItems: 'center' }}>
                        <Text style={styles.lable}>Name : {pmfbyStatusData?.data?.name}</Text>
                        <Text style={styles.lable}>Mobile : {pmfbyStatusData?.data?.mobile_no}</Text>
                    </View>

                    {/* Education Details If Available */}
                    <View style={{ marginTop: 12, alignItems: 'center' }}>
                        {pmfbyStatusData?.data?.education && <Text style={styles.lable}>Education : {pmfbyStatusData?.data?.education}</Text>}
                        {pmfbyStatusData?.data?.education_status && <Text style={styles.lable}>Education Status : {pmfbyStatusData?.data?.education_status}</Text>}
                        {pmfbyStatusData?.data?.remarks && <Text style={styles.lable}>Remarks Status : {pmfbyStatusData?.data?.remarks}</Text>}
                    </View>

                    {
                        pmfbyStatusData?.data?.file_path &&
                        <View style={{height: 300, marginTop: 40}}>
                            <Image style={{ width: windowWidth - 16, height: '100%', resizeMode: 'center' }} source={{ uri: pmfbyStatusData?.data?.file_path }} />
                        </View>
                    }

                </View> :


                    // =================  If the PMFBY status not found  ================


                <View>
                    <Text style={styles.lable}>Name : {userData.personalDetail.user_FName} {userData.personalDetail.user_FName}</Text>
                    <Text style={styles.lable}>Mobile : {userData.user.mobile_Number} </Text>
                    <Text style={styles.lable}>Email : {userData.user.user_EmailID}</Text>

                    {
                        userData.kycDetail?.aadhar_Number ?
                        <View style={{marginTop: 12}}>
                            <Text style={[styles.lable, {marginBottom: 8}]}>Aadhar Number : {userData.kycDetail?.aadhar_Number}</Text>
                            <View style={{flexDirection:'row', gap: 6}}>
                                <View style={{flex: 1, height: 100, }}>
                                    <DocumentImage imageUrl={`${userData.kycDetail?.aadhar_FontPhoto}`} />                                
                                </View>
                                <View style={{flex: 1, height: 100,}}>
                                    <DocumentImage imageUrl={`${userData.kycDetail?.aadhar_BackPhoto}`} />                                
                                </View>
                            </View>
                        </View> :
                        <Text  style={[styles.lable, {color: colors.secondary500}]}>Adhar Details Not Uploaded</Text>
                    }

                    {
                        userData.kycDetail.pancard_Number ? 
                        <View style={{marginTop: 12}}>
                            <Text style={[styles.lable, {marginBottom: 8}]}>PAN : {userData.kycDetail.pancard_Number}</Text>
                            <View style={{flex: 1, height: 100 }}>
                                <DocumentImage imageUrl={`${userData.kycDetail?.pancard_Photo}`} />                                
                            </View>
                        </View> :
                        <Text style={[styles.lable, {color: colors.secondary500}]}>Pan Details Not Uploaded</Text>
                    }
                    
                    <View>
                        <AnimatedInput 
                            inputLabel={'Please enter father\'s name'}
                            value={fatherName} 
                            onChangeText={(text: string) => {setFatherName(text)}}/>                    

                    </View>

                    <View>
                        <SelectBoxWithLabelAndError 
                            listData={educationType}
                            label={'Your highest education.'}
                            placeholder={'Select'}
                            errorMessage={''}
                            value={education}
                            optionLable={(curr: any) => { return curr.name }}
                            searchKey='name'
                            onSelectionChange={(item: any) => {
                                console.log(item)
                                setEducation(item);
                            }}
                            disabled={false} />
                    </View>

                    <View>
                        <CustomImagePicker 
                            value={educationDocument} 
                            setValue={setEducationDocument} 
                            placeholder='Tap to upload education certificate pic.' 
                            label='Education certificate pic.' />
                    </View>                  

                    <View style={{marginBottom: 30}}>
                        <ButtonPrimary 
                        label='Enroll' 
                        onPress={handleEnrollPress}
                        disabled={!fatherName || 
                        !userData.kycDetail.aadhar_Number || 
                        !userData.kycDetail.pancard_Number ||
                        !education?.value || !educationDocument}/>
                    </View>

                    {/* <View style={{marginBottom: 30}}>
                        <ButtonPrimary 
                        label='Upload Education Certificate' 
                        onPress={handleDocUploadPress}
                        disabled={!educationDocument}/>
                    </View> */}
                    
                </View>
            }

        </ScrollView>
    )
}

export default PmfbyHome

const styles = StyleSheet.create({
    lable: {
        fontSize: 14, 
        fontWeight: 'bold', 
        color: colors.primary500, 
    }
})