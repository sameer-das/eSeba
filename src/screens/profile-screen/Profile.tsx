import { StyleSheet, Text, View, Pressable, ScrollView, Modal, Appearance, KeyboardAvoidingView, Alert } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import colors from '../../constants/colors'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { windowHeight } from '../../utils/dimension';
import { AuthContext } from '../../context/AuthContext';
import { useDrawerStatus } from '@react-navigation/drawer';
import { getBankMaster, getBlocks, getDistrict, getStates, saveUserBankDetails, updateUserBankDetails, updateUserPersonalInfo } from '../../API/services';
import Loading from '../../components/Loading';
import InputWithLabelAndError from '../../components/InputWithLabelAndError';
import { useNavigation } from '@react-navigation/native';
import SelectBoxWithLabelAndError from '../../components/SelectBoxWithLabelAndError';
import DatePicker from 'react-native-date-picker';
import AnimatedInput from '../../components/AnimatedInput';

const Profile = () => {
  const colorScheme = Appearance.getColorScheme();
  const navigation = useNavigation();

  const [openModal, setOpenModal] = useState(false);
  const { userData, refreshUserDataInContext } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const [stateMasterData, setStateMasterData] = useState<any>([]);
  const [districtMasterData, setDistrictMasterData] = useState<any>([]);
  const [blockMasterData, setBlockMasterData] = useState<any>([]);
  const [bankMasterData, setBankMasterData] = useState<any>([]);

  const [currentState, setCurrentState] = useState<any>();
  const [currentDistrict, setCurrentDistrict] = useState<any>();
  const [currentBlock, setCurrentBlock] = useState<any>();
  const [currentBank, setCurrentBank] = useState<any>();
  const [currentGender, setCurrentGender] = useState<any>();
  const [currentNomineeRelation, setCurrentNomineeRelation] = useState<any>();

  const populateDistricts = async (stateId: number) => {
    const { data } = await getDistrict(stateId);
    if (data.status === 'Success' && data.code === 200)
      setDistrictMasterData(data.data);
    else
      setDistrictMasterData([])
  }

  const populateBlocks = async (stateId: number, districtId: number) => {
    const { data } = await getBlocks(stateId, districtId);
    if (data.status === 'Success' && data.code === 200)
      setBlockMasterData(data.data);
    else
      setBlockMasterData([])
  }


  const genderMasterData = [
    { name: 'Male', value: 'Male' },
    { name: 'Female', value: 'Female' },
    { name: 'Others', value: 'Others' },
  ]

  const relations: any[] = [
    { id: 'father', name: 'Father' },
    { id: 'mother', name: 'Mother' },
    { id: 'spouse', name: 'Spouse' },
    { id: 'son', name: 'Son' },
    { id: 'daughter', name: 'Daughter' },
    { id: 'sibling', name: 'Sibling' },
  ];

  const populateAll = async () => {
    setLoadingMessage('Fetching your details');
    // console.log('populate all ');
    // this is to fetch fresh data after update
    // context was not refreshing so implemented this

    // const userData = isRefresh ? await getFreshUserData() : userData;
    // const userData = userData;

    setIsLoading(true);
    try {
      const [state, district, block, bank] = await Promise.all([await getStates(1),
      await getDistrict(userData.personalDetail.state_ID),
      await getBlocks(userData.personalDetail.state_ID, userData.personalDetail.district_ID),
      await getBankMaster()])
      console.log('All fetched');

      // console.log(state.data);
      if (state.data.status === 'Success') {
        setStateMasterData(state.data.data);
        const currentState = state.data.data.find((state: any) => state.state_ID === userData.personalDetail.state_ID)
        setCurrentState(currentState)
        // console.log(currentState)
      }
      else
        setStateMasterData([])


      // console.log(district.data);
      if (district.data.status === 'Success' && district.data.code === 200) {
        setDistrictMasterData(district.data.data);
        // console.log(district.data)
        const _currentDistrict = district.data.data.find((dist: any) => dist.district_ID === userData.personalDetail.district_ID)
        setCurrentDistrict(_currentDistrict)
        // console.log(_currentDistrict)
      }
      else
        setDistrictMasterData([])

      // console.log(block.data);
      if (block.data.status === 'Success' && block.data.code === 200) {
        setBlockMasterData(block.data.data);
        const _currentBlock = block.data.data.find((block: any) => block.block_ID === userData.personalDetail.block_ID)
        setCurrentBlock(_currentBlock)
        // console.log(_currentBlock)
      }
      else
        setBlockMasterData([])

      if (bank.data.status === 'Success' && bank.data.code === 200) {
        // console.log(bank.data)
        setBankMasterData(bank.data.data);
        // console.log('setting current bank ' + userData.bankDetail?.bank_ID);
        const _currentBank = bank.data.data.find((bank: any) => bank.id === userData.bankDetail?.bank_ID)
        setCurrentBank(_currentBank)
        // console.log('in 125' ,currentBank)
      }
      else
        setBlockMasterData([])

      const _currentGender = genderMasterData.find(gender => gender.value === userData.personalDetail.user_Gender)
      setCurrentGender(_currentGender);


      const _currentNomineeRelation = relations.find(rel => rel.id === userData.personalDetail.nomine_Relation);
      console.log(_currentNomineeRelation);

      setCurrentNomineeRelation(_currentNomineeRelation);



    } catch (e) {
      console.log('Error fetching master details');
      console.log(e)
    } finally {
      setIsLoading(false);
      setLoadingMessage('Loading');
    }

  }



  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('on focus');
      populateAll()
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // console.log('User data changed');
    populateAll()
  }, [userData])

  const [updateType, setUpdateType] = useState<string>('');

  const editPressHandler = (editName: string) => {
    console.log(editName);
    setUpdateType(editName);
    if (editName === 'personal') {
      setUserPersonalDetailEditForm((currState: any) => {
        const obj = {
          ...currState,
          firstName: { ...userPersonalDetailEditForm.firstName, value: userData?.personalDetail?.user_FName, error: '' },
          lastName: { ...userPersonalDetailEditForm.lastName, value: userData?.personalDetail?.user_LName, error: '' },
          dob: { ...userPersonalDetailEditForm.dob, value: userData?.personalDetail?.user_Dob, error: '' },
          gender: { ...userPersonalDetailEditForm.gender, value: currentGender, error: '' },
          state: { ...userPersonalDetailEditForm.state, value: currentState, error: '' },
          district: { ...userPersonalDetailEditForm.district, value: currentDistrict, error: '' },
          block: { ...userPersonalDetailEditForm.block, value: currentBlock, error: '' },
          pin: { ...userPersonalDetailEditForm.pin, value: userData?.personalDetail?.user_Pin, error: '' },
          ward: { ...userPersonalDetailEditForm.ward, value: userData?.personalDetail?.user_GP, error: '' },
          nomineeName: { ...userPersonalDetailEditForm.nomineeName, value: userData?.personalDetail?.user_Nomine_Name, error: '' },
          nomineeMobile: { ...userPersonalDetailEditForm.nomineeMobile, value: userData?.personalDetail?.nomine_ContactNumber, error: '' },
          nomineeRelationship: { ...userPersonalDetailEditForm.nomineeRelationship, value: currentNomineeRelation, error: '' },
        }
        console.log(obj)
        return obj;
      });
    } else if (editName === 'bank') {
      setUserBankDetailEditForm((currentState: any) => {
        return {
          ...currentState,
          bank: { ...userBankDetailEditForm.bank, value: currentBank, error: '' },
          accountHolderName: { ...userBankDetailEditForm.accountHolderName, value: userData?.bankDetail?.userAccount_HolderName, error: '' },
          accountNo: { ...userBankDetailEditForm.accountNo, value: userData?.bankDetail?.user_Account_Number, error: '' },
          branchName: { ...userBankDetailEditForm.branchName, value: userData?.bankDetail?.user_BranchName, error: '' },
          ifsc: { ...userBankDetailEditForm.ifsc, value: userData?.bankDetail?.user_IFSCCode, error: '' },
        }
      })
    }
    setOpenModal(true)
  }


  const [userPersonalDetailEditForm, setUserPersonalDetailEditForm] = useState<any>({
    firstName: { value: '', error: '', pattern: new RegExp(/^[a-zA-Z ]*$/), required: true },
    lastName: { value: '', error: '', pattern: new RegExp(/^[a-zA-Z ]*$/), required: true },
    gender: { value: '', error: '', pattern: '', required: true },
    dob: { value: new Date().toISOString(), error: '', pattern: '', required: true },
    state: { value: '', error: '', pattern: '', required: true },
    district: { value: '', error: '', pattern: '', required: true },
    block: { value: '', error: '', pattern: '', required: true },
    pin: { value: '', error: '', pattern: new RegExp(/^[0-9]{6}$/), required: true },
    ward: { value: '', error: '', pattern: '', required: true },
    nomineeName: { value: '', error: '', pattern: '', required: true },
    nomineeMobile: { value: '', error: '', pattern: new RegExp(/^((\\+91-?)|0)?[0-9]{10}$/), required: true },
    nomineeRelationship: { value: '', error: '', pattern: '', required: true },
  });

  const [userBankDetailEditForm, setUserBankDetailEditForm] = useState<any>({
    bank: { value: '', error: '', pattern: '', required: true },
    accountHolderName: { value: '', error: '', pattern: new RegExp(/^[a-zA-Z ]*$/), required: true },
    accountNo: { value: '', error: '', pattern: new RegExp(/^[0-9]*$/), required: true },
    branchName: { value: '', error: '', pattern: '', required: true },
    ifsc: { value: '', error: '', pattern: new RegExp(/^[a-zA-Z0-9]+$/), required: true },
  });
  // console.log(userBankDetailEditForm)

  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const requiredErrorMessage: any = {
    firstName: 'Please enter first name',
    lastName: 'Please enter last name',
    mobile: 'Please enter mobile no',
    email: 'Please enter email',
    pin: 'Please enter PIN Code',
    ward: 'Please enter GP/Ward',
    nomineeName: 'Pleased enter nominiee name',
    nomineeMobile: 'Pleased enter nominiee mobile no',
    nomineeRelationship: 'Please choose nominee relation type',

    bank: 'Please choose bank',
    accountHolderName: 'Please enter A/C holder name',
    accountNo: 'Please enter A/C number',
    branchName: 'Please enter bank name',
    ifsc: 'Please enter IFSC',
  }
  const patternErrorMessage: any = {
    nomineeMobile: 'Mobile number should be of only 10 digits',
    pin: 'PIN should be of only 6 digits',
    accountNo: 'A/C number should contain only digits',
    firstName: 'First name can contain only characters',
    lastName: 'Last name can contain only characters',
    accountHolderName: 'Account holder name can contain only characters'
  }

  const handleInputChange = (text: string, keyName: string) => {
    let errorMessage = '';

    if (userPersonalDetailEditForm[keyName].required && text.trim() === '') {
      errorMessage = requiredErrorMessage[keyName];
    } else if (userPersonalDetailEditForm[keyName].pattern !== '' && !(userPersonalDetailEditForm[keyName].pattern.test(text.trim())))
      errorMessage = patternErrorMessage[keyName];

    const obj = { ...userPersonalDetailEditForm[keyName], value: text, error: errorMessage }
    setUserPersonalDetailEditForm({ ...userPersonalDetailEditForm, [keyName]: obj });
  }

  const handleInputChangeForBankForm = (text: string, keyName: string) => {
    let errorMessage = '';

    if (userBankDetailEditForm[keyName].required && text.trim() === '') {
      errorMessage = requiredErrorMessage[keyName];
    } else if (userBankDetailEditForm[keyName].pattern !== '' && !(userBankDetailEditForm[keyName].pattern.test(text.trim()))) {
      errorMessage = patternErrorMessage[keyName];
    }

    const obj = { ...userBankDetailEditForm[keyName], value: text, error: errorMessage }
    setUserBankDetailEditForm({ ...userBankDetailEditForm, [keyName]: obj });
  }

  const getDate = (date: Date | string) => {
    const d = new Date(date).getTime() + 19800000;
    return new Date(d).toISOString();
  }

  const getDateWithZeroTime = (date: string) => {
    const newDate = new Date(date.substring(0, 10)).getTime()
    return new Date(newDate).toISOString();
  }

  const validatePersonalDetailEditForm = () => {
    const keyNames = ['firstName', 'lastName', 'ward', 'pin',
      'nomineeName', 'nomineeMobile', 'state', 'district', 'block',
      'gender', 'dob', 'nomineeRelationship'];

    let bRet = true;

    try {
      keyNames.forEach(keyName => {
        let errorMessage = '';
        // console.log('checking ' + keyName)
        if (userPersonalDetailEditForm[keyName].required && !userPersonalDetailEditForm[keyName].value) {
          // console.log(keyName + ' not filled');
          errorMessage = requiredErrorMessage[keyName];
        } else if (userPersonalDetailEditForm[keyName].pattern !== '' && !(userPersonalDetailEditForm[keyName].pattern?.test(userPersonalDetailEditForm[keyName].value.trim()))) {
          // console.log(keyName + ' invalid')
          errorMessage = patternErrorMessage[keyName];
        }
        const obj = { ...userPersonalDetailEditForm[keyName], error: errorMessage };
        setUserPersonalDetailEditForm((currentFormValue: any) => {
          return { ...currentFormValue, [keyName]: obj }
        });

        if (errorMessage !== '')
          bRet = false;

      });
    } catch (e) {
      console.log(e)
    }

    return bRet;
  }

  const validateBankDetailForm = () => {
    const keyNames = ['bank', 'accountHolderName', 'accountNo', 'branchName', 'ifsc']
    //
    let bRet = true;
    try {
      keyNames.forEach(keyName => {
        let errorMessage = '';
        // console.log('checking ' + keyName)
        if (userBankDetailEditForm[keyName].required && !userBankDetailEditForm[keyName].value) {
          // console.log(keyName + ' not filled');
          errorMessage = requiredErrorMessage[keyName];
        } else if (userBankDetailEditForm[keyName].pattern !== '' && !(userBankDetailEditForm[keyName].pattern?.test(userBankDetailEditForm[keyName].value.trim()))) {
          errorMessage = patternErrorMessage[keyName];
        }
        const obj = { ...userBankDetailEditForm[keyName], error: errorMessage };
        setUserBankDetailEditForm((currentFormValue: any) => {
          return { ...currentFormValue, [keyName]: obj }
        });

        if (errorMessage !== '')
          bRet = false;

      });
    } catch (e) {
      console.log(e)
    }

    return bRet;
  }

  // API CALL
  const updateUserPersonalDetail = async () => {
    const userPersonalInfo = {
      user_psnal_ID: userData.personalDetail.user_psnal_ID,
      user_ID: userData.personalDetail.user_ID,
      user_FName: userPersonalDetailEditForm.firstName.value,
      user_LName: userPersonalDetailEditForm.lastName.value,
      user_Gender: userPersonalDetailEditForm.gender.value.value,
      user_Dob: getDateWithZeroTime(userPersonalDetailEditForm.dob.value),
      state_ID: userPersonalDetailEditForm.state.value.state_ID,
      district_ID: userPersonalDetailEditForm.district.value.district_ID,
      block_ID: userPersonalDetailEditForm.block.value.block_ID,
      user_GP: userPersonalDetailEditForm.ward.value,
      user_Pin: userPersonalDetailEditForm.pin.value,
      user_Nomine_Name: userPersonalDetailEditForm.nomineeName.value,
      nomine_Relation: userPersonalDetailEditForm.nomineeRelationship.value.id,
      nomine_ContactNumber: userPersonalDetailEditForm.nomineeMobile.value,
    };

    console.log(userPersonalInfo);
    try {
      setLoadingMessage('Saving your details');
      setIsLoading(true);
      // sAve to DB
      const { data } = await updateUserPersonalInfo(userPersonalInfo);
      if (data.code === 200 && data.status === 'Success') {
        // fetch and set to context 
        Alert.alert('Success', 'Personal details has been updated successfully!');
        // run the Populate ALL method again 
        await refreshUserDataInContext();
        // await populateAll(true);
        setOpenModal(false);
      } else {
        Alert.alert('Fail', 'Failed while updating personal details!');
      }
    } catch (e) {
      console.log('error while updating personal info');
      Alert.alert('Error', 'Error while updating personal details!');
      console.log(e);
    } finally {
      setLoadingMessage('Loading...');
      setIsLoading(false);
    }
  }

  // API CALL for BANK UPDATE

  const updateBankDetail = async () => {
    const bankDetails = {
      bank_Detail_Id: userData.bankDetail ? userData.bankDetail.bank_Detail_Id : 0,
      user_ID: userData.user.user_ID,

      bank_ID: userBankDetailEditForm.bank?.value?.id,
      userAccount_HolderName: userBankDetailEditForm.accountHolderName?.value,
      user_Account_Number: userBankDetailEditForm.accountNo?.value,
      user_IFSCCode: userBankDetailEditForm.ifsc?.value?.toUpperCase(),
      user_BranchName: userBankDetailEditForm.branchName?.value,
    };



    console.log(bankDetails);
    try {
      setLoadingMessage('Saving your details');
      setIsLoading(true);
      // save to DB
      let data;
      if (userData.bankDetail) {
        const updateBankResp = await updateUserBankDetails(bankDetails);
        data = updateBankResp.data;
      }
      else {
        const saveBankResp = await saveUserBankDetails(bankDetails);
        data = saveBankResp.data;
      }
      if (data?.code === 200 && data?.status === 'Success') {
        // fetch and set to context 
        console.log(data)
        Alert.alert('Success', 'Bank details has been updated successfully!');
        // run the Populate ALL method again 
        await refreshUserDataInContext();
        // await populateAll(true);
        setOpenModal(false);
      } else {
        Alert.alert('Fail', 'Failed while updating bank details!');
      }
    } catch (e) {
      console.log('error while updating bank info');
      Alert.alert('Error', 'Error while updating bank details!');
      console.log(e);
    } finally {
      setLoadingMessage('Loading...');
      setIsLoading(false);
    }
  }


  const updateHandler = async () => {
    if (updateType === 'personal') {

      if (validatePersonalDetailEditForm()) {
        console.log('All ok go for API call ');
        await updateUserPersonalDetail()
      }
    } else if (updateType === 'bank') {
      console.log(userBankDetailEditForm)
      if (validateBankDetailForm()) {
        console.log('All ok go for Bank Update API call ');
        await updateBankDetail()
      }
    }
  }

  if (isLoading)
    return <Loading label={loadingMessage} />

  return (

    <ScrollView style={styles.rootContainer}>

      {/* Personal Details */}
      <View style={styles.headerContainer}>

        <Text style={styles.header}>Communication Details</Text>
        {/* <Pressable onPress={() => editPressHandler('communicaton')}>
          <MaterialIcon name='edit' size={25} color={colors.primary500} />
        </Pressable> */}
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.lableContainer}>
          <Text style={styles.lable}>Mobile</Text>
          <Text style={styles.lable}>Email</Text>
        </View>

        <View style={styles.valueContainer}>
          <Text style={styles.value}>{userData.user.mobile_Number}</Text>
          <Text style={styles.value}>{userData.user.user_EmailID}</Text>
        </View>
      </View>

      {/* Address */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Personal Details</Text>
        <Pressable style={styles.editButton} onPress={() => editPressHandler('personal')}>
          {/* <MaterialIcon name='edit' size={25} color={colors.primary500} /> */}
          <Text style={styles.editBottonText}>Edit</Text>
        </Pressable>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.lableContainer}>
          <Text style={styles.lable}>Name</Text>
          <Text style={styles.lable}>Gender</Text>
          <Text style={styles.lable}>Date Of Birth</Text>
          <Text style={styles.lable}>State</Text>
          <Text style={styles.lable}>District</Text>
          <Text style={styles.lable}>Block</Text>
          <Text style={styles.lable}>GP/Ward</Text>
          <Text style={styles.lable}>PIN Code</Text>
          <Text style={styles.break}></Text>
          <Text style={styles.lable}>Nominee Name</Text>
          <Text style={styles.lable}>Relation</Text>
          <Text style={styles.lable}>Nominee Mobile</Text>
        </View>

        <View style={styles.valueContainer}>
          <Text style={styles.value}>{userData?.personalDetail?.user_FName} {userData?.personalDetail?.user_LName}</Text>
          <Text style={styles.value}>{userData?.personalDetail?.user_Gender}</Text>
          <Text style={styles.value}>{new Date(userData?.personalDetail?.user_Dob).toDateString()}</Text>
          <Text style={styles.value}>{currentState?.state_Name.trim()}</Text>
          <Text style={styles.value}>{currentDistrict?.district_Name.trim()}</Text>
          <Text style={styles.value}>{currentBlock?.block_Name.trim()}</Text>
          <Text style={styles.value}>{userData?.personalDetail?.user_GP}</Text>
          <Text style={styles.value}>{userData?.personalDetail?.user_Pin}</Text>
          <Text style={styles.break}></Text>
          <Text style={styles.value}>{userData?.personalDetail?.user_Nomine_Name}</Text>
          <Text style={styles.value}>{currentNomineeRelation?.name}</Text>
          <Text style={styles.value}>{userData?.personalDetail?.nomine_ContactNumber}</Text>
        </View>
      </View>

      {/* Bank Details */}

      <View style={styles.headerContainer}>
        <Text style={styles.header}>Bank Details</Text>
        <Pressable style={styles.editButton} onPress={() => editPressHandler('bank')}>
          {/* <MaterialIcon name='edit' size={25} color={colors.primary500} /> */}
          <Text style={styles.editBottonText}>Edit</Text>
        </Pressable>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.lableContainer}>
          <Text style={styles.lable}>Bank Name</Text>
          <Text style={styles.lable}>Branch Name</Text>
          <Text style={styles.lable}>IFSC</Text>
          <Text style={styles.lable}>Name</Text>
          <Text style={styles.lable}>Account No.</Text>
        </View>

        <View style={styles.valueContainer}>
          <Text style={styles.value}>{currentBank?.bank_Name}</Text>
          <Text style={styles.value}>{userData?.bankDetail?.user_BranchName}</Text>
          <Text style={styles.value}>{userData?.bankDetail?.user_IFSCCode}</Text>
          <Text style={styles.value}>{userData?.bankDetail?.userAccount_HolderName}</Text>
          <Text style={styles.value}>{userData?.bankDetail?.user_Account_Number}</Text>
        </View>
      </View>

      {/* PAN and ADHAR Details */}

      <View style={styles.headerContainer}>
        <Text style={styles.header}>PAN and Adhar Details</Text>
        {/* <Pressable>
          <MaterialIcon name='edit' size={25} color={colors.primary500} />
        </Pressable> */}
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.lableContainer}>
          <Text style={styles.lable}>PAN</Text>
          <Text style={styles.lable}>Adhar</Text>

        </View>

        <View style={styles.valueContainer}>
          <Text style={styles.value}>{userData?.kycDetail?.pancard_Number}</Text>
          <Text style={styles.value}>{userData?.kycDetail?.aadhar_Number}</Text>
        </View>
      </View>

      <Modal visible={openModal} style={styles.modal} onRequestClose={() => { setOpenModal(false) }}>
        <ScrollView >
          <KeyboardAvoidingView style={styles.modalBody}>
            {updateType === 'personal' ? <>

              <Text style={styles.editFormHeader}>Edit Your Personal Details</Text>
              <AnimatedInput
                value={userPersonalDetailEditForm.firstName.value}
                errorMessage={userPersonalDetailEditForm.firstName.error}
                onChangeText={(text: string) => handleInputChange(text, 'firstName')}
                inputLabel={'Enter First Name'} />
              <AnimatedInput
                value={userPersonalDetailEditForm.lastName.value}
                errorMessage={userPersonalDetailEditForm.lastName.error}
                onChangeText={(text: string) => handleInputChange(text, 'lastName')}
                inputLabel={'Enter Last Name'} />

              <Text style={styles.dobLable}>Choose Date Of Birth</Text>
              <Pressable style={styles.dobButton} onPress={() => setDatePickerOpen(true)} >
                <Text style={styles.dobText}>{userPersonalDetailEditForm.dob.value ? new Date(userPersonalDetailEditForm.dob.value).toDateString() : 'Choose DOB'}</Text>
              </Pressable>

              <DatePicker
                modal
                mode='date'
                open={datePickerOpen}
                date={new Date(userPersonalDetailEditForm.dob.value)}
                textColor={colorScheme === null || colorScheme === 'light' ? colors.primary500 : colors.white}
                title={null}
                maximumDate={new Date()}
                onConfirm={(date) => {
                  setDatePickerOpen(false)
                  setUserPersonalDetailEditForm({
                    ...userPersonalDetailEditForm, dob: { ...userPersonalDetailEditForm.dob, value: getDate(date) }
                  })
                }}
                onCancel={() => {
                  setDatePickerOpen(false)
                }}
              />

              {/* Gender */}
              <SelectBoxWithLabelAndError listData={genderMasterData}
                label={'Choose Gender'}
                placeholder={'Select'}

                value={userPersonalDetailEditForm?.gender?.value?.name}
                optionLable={(curr: any) => { return curr.name }}
                searchKey='name'
                onSelectionChange={(item: any) => {
                  const obj = { ...userPersonalDetailEditForm.gender, value: item }
                  setUserPersonalDetailEditForm({ ...userPersonalDetailEditForm, gender: obj });
                }} />

              {/* State */}

              <SelectBoxWithLabelAndError listData={stateMasterData}
                label={'Choose State'}
                placeholder={'Select'}
                errorMessage={userPersonalDetailEditForm.state?.error}
                value={userPersonalDetailEditForm.state?.value?.state_Name}
                optionLable={(curr: any) => { return curr.state_Name }}
                searchKey='state_Name'
                onSelectionChange={(item: any) => {
                  const obj = { ...userPersonalDetailEditForm.state, value: item, error: '' }
                  const district = { ...userPersonalDetailEditForm.district, value: '' }
                  const block = { ...userPersonalDetailEditForm.block, value: '' }
                  setUserPersonalDetailEditForm({ ...userPersonalDetailEditForm, state: obj, district: district, block: block });
                  populateDistricts(item.state_ID);
                }} />

              {/* District */}
              <SelectBoxWithLabelAndError listData={districtMasterData}
                label={'Choose District'}
                placeholder={'Select'}
                errorMessage={userPersonalDetailEditForm.district?.error}
                value={userPersonalDetailEditForm.district?.value?.district_Name}
                optionLable={(curr: any) => { return curr.district_Name }}
                searchKey='district_Name'
                onSelectionChange={(item: any) => {
                  const obj = { ...userPersonalDetailEditForm.district, value: item, error: '' }
                  const block = { ...userPersonalDetailEditForm.block, value: '' }
                  setUserPersonalDetailEditForm({ ...userPersonalDetailEditForm, district: obj, block: block });
                  populateBlocks(item.state_ID, item.district_ID);
                }} />


              {/* Block */}
              <SelectBoxWithLabelAndError listData={blockMasterData}
                label={'Choose Block'}
                placeholder={'Select'}
                errorMessage={userPersonalDetailEditForm.block?.error}
                value={userPersonalDetailEditForm.block?.value?.block_Name}
                optionLable={(curr: any) => { return curr.block_Name }}
                searchKey='block_Name'
                onSelectionChange={(item: any) => {
                  const obj = { ...userPersonalDetailEditForm.block, value: item, error: '' }
                  setUserPersonalDetailEditForm({ ...userPersonalDetailEditForm, block: obj });
                }} />

              <AnimatedInput
                value={userPersonalDetailEditForm.ward.value}
                errorMessage={userPersonalDetailEditForm.ward.error}
                onChangeText={(text: string) => handleInputChange(text, 'ward')}
                inputLabel={'Enter GP/Ward'} />

              <AnimatedInput
                value={userPersonalDetailEditForm.pin.value}
                errorMessage={userPersonalDetailEditForm.pin.error}
                keyboardType={'numeric'}
                maxLength={6}
                onChangeText={(text: string) => handleInputChange(text, 'pin')}
                inputLabel={'Enter PIN Code'} />

              <AnimatedInput
                value={userPersonalDetailEditForm.nomineeName.value}
                errorMessage={userPersonalDetailEditForm.nomineeName.error}
                onChangeText={(text: string) => handleInputChange(text, 'nomineeName')}
                inputLabel={'Enter Nominee Name'} />

              <AnimatedInput
                value={userPersonalDetailEditForm.nomineeMobile.value}
                errorMessage={userPersonalDetailEditForm.nomineeMobile.error}
                onChangeText={(text: string) => handleInputChange(text, 'nomineeMobile')}
                keyboardType={'numeric'}
                maxLength={10}
                inputLabel={'Enter Nominee Mobile'} />


              {/* Nominee Relation */}
              <SelectBoxWithLabelAndError listData={relations}
                label={'Nominee Relationship'}
                placeholder={'Select'}
                errorMessage={userPersonalDetailEditForm?.nomineeRelationship?.error}
                value={userPersonalDetailEditForm.nomineeRelationship?.value?.name}
                optionLable={(curr: any) => { return curr.name }}
                searchKey="name"
                onSelectionChange={(item: any) => {
                  const obj = { ...userPersonalDetailEditForm.nomineeRelationship, value: item, error: '' }
                  setUserPersonalDetailEditForm({ ...userPersonalDetailEditForm, nomineeRelationship: obj });
                }} />

              <Pressable style={styles.updateButton} onPress={updateHandler}>
                <Text style={styles.updateButtonLabel}>Update</Text>
              </Pressable>
            </> : <>
              <Text style={styles.editFormHeader}>Edit Your Bank Details</Text>

              <SelectBoxWithLabelAndError listData={bankMasterData}
                label={'Choose Bank'}
                placeholder={'Select'}
                errorMessage={userBankDetailEditForm?.bank?.error}
                value={userBankDetailEditForm?.bank?.value?.bank_Name}
                optionLable={(curr: any) => { return curr.bank_Name }}
                searchKey="bank_Name"
                onSelectionChange={(item: any) => {
                  const obj = { ...userBankDetailEditForm.bank, value: item, error: '' }
                  setUserBankDetailEditForm({ ...userBankDetailEditForm, bank: obj });
                }} />

              <AnimatedInput
                value={userBankDetailEditForm.accountHolderName.value || ''}
                errorMessage={userBankDetailEditForm.accountHolderName.error}
                onChangeText={(text: string) => handleInputChangeForBankForm(text, 'accountHolderName')}
                inputLabel={'Enter A/C Holder Name'} />
              <AnimatedInput
                value={userBankDetailEditForm.accountNo.value || ''}
                errorMessage={userBankDetailEditForm.accountNo.error}
                onChangeText={(text: string) => handleInputChangeForBankForm(text, 'accountNo')}
                inputLabel={'Enter A/C Number'} />
              <AnimatedInput
                value={userBankDetailEditForm.branchName.value || ''}
                errorMessage={userBankDetailEditForm.branchName.error}
                onChangeText={(text: string) => handleInputChangeForBankForm(text, 'branchName')}
                inputLabel={'Enter Branch Name'} />
              <AnimatedInput
                value={userBankDetailEditForm.ifsc.value || ''}
                errorMessage={userBankDetailEditForm.ifsc.error}
                onChangeText={(text: string) => handleInputChangeForBankForm(text, 'ifsc')}
                inputLabel={'Enter IFSC'} />

              <Pressable style={styles.updateButton} onPress={updateHandler}>
                <Text style={styles.updateButtonLabel}>Update</Text>
              </Pressable>

            </>}
          </KeyboardAvoidingView>
        </ScrollView>
      </Modal>

    </ScrollView>
  )
}

export default Profile

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    padding: 8,
    backgroundColor: colors.white
  },
  detailsContainer: {
    borderColor: colors.primary100,
    borderWidth: 0.5,
    padding: 8,
    borderRadius: 16,
    flexDirection: 'row',
    width: '100%',
    marginBottom: 16,
  },
  lableContainer: {
    width: '35%'
  },
  valueContainer: {

  },
  lable: {
    color: colors.primary500,
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 4,
  },
  value: {
    color: colors.primary500,
    fontSize: 16,
    paddingVertical: 4,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary500,
  },
  break: {
    height: 16
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: colors.primary500,
    borderRadius: 16
  },
  editBottonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold'
  },
  modal: { flex: 1 },
  modalBody: {
    flex: 1,
    minHeight: windowHeight,
    padding: 8,

  },
  editFormHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary500,
    textAlign: 'center'
  },
  updateButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primary500,
    borderRadius: 8,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 60
  },
  updateButtonLabel: {
    color: colors.white,
    fontSize: 24,
    textAlign: 'center'
  },
  dobButton: {
    borderBottomWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 11,
    // borderRadius: 8,
    width: '100%',
    borderBottomColor: colors.grey,
    marginBottom: 16
  },
  dobText: {
    fontSize: 16,
    color: colors.primary500,
  },
  dobLable: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.grey,
    marginBottom: 4
  }
})