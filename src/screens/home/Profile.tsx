import { StyleSheet, Text, View, Pressable, ScrollView, Modal } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import colors from '../../constants/colors'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { windowHeight } from '../../utils/dimension';
import { AuthContext } from '../../context/AuthContext';
import { useDrawerStatus } from '@react-navigation/drawer';
import { getBankMaster, getBlocks, getDistrict, getStates } from '../../API/services';
import Loading from '../../components/Loading';

const Profile = () => {
  const [openModal, setOpenModal] = useState(false);
  const { userData } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const [stateMasterData, setStateMasterData] = useState<any>([]);
  const [districtMasterData, setDistrictMasterData] = useState<any>([]);
  const [blockMasterData, setBlockMasterData] = useState<any>([]);
  const [bankMasterData, setBankMasterData] = useState<any>([]);

  const [currentState, setCurrentState] = useState<any>();
  const [currentDistrict, setCurrentDistrict] = useState<any>();
  const [currentBlock, setCurrentBlock] = useState<any>();
  const [currentBank, setCurrentBank] = useState<any>();

  const populateStates = async () => {
    const { data } = await getStates(1);
    if (data.status === 'Success')
      setStateMasterData(data.data);
    else
      setStateMasterData([])
  }

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

  const populateBankMaster = async () => {
    const { data } = await getBankMaster();
    if (data.status === 'Success')
      setBankMasterData(data.data)
  }

  const populateAll = async () => {
    setIsLoading(true);
    try {
      const [state, district, block, bank] = await Promise.all([await getStates(1),
      await getDistrict(userData.personalDetail.state_ID),
      await getBlocks(userData.personalDetail.state_ID, userData.personalDetail.district_ID),
      await getBankMaster()])
      // const state = await getStates(1);
      // const district = await getDistrict(userData.personalDetail.state_ID);
      // const block = await getBlocks(userData.personalDetail.state_ID, userData.personalDetail.district_ID);

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
        const currentDistrict = district.data.data.find((dist: any) => dist.district_ID === userData.personalDetail.district_ID)
        setCurrentDistrict(currentDistrict)
        // console.log(currentDistrict)
      }
      else
        setDistrictMasterData([])

      // console.log(block.data);
      if (block.data.status === 'Success' && block.data.code === 200) {
        setBlockMasterData(block.data.data);
        const currentBlock = block.data.data.find((block: any) => block.block_ID === userData.personalDetail.block_ID)
        setCurrentBlock(currentBlock)
        // console.log(currentBlock)
      }
      else
        setBlockMasterData([])

      if (bank.data.status === 'Success' && bank.data.code === 200) {
        // console.log(bank.data)
        setBankMasterData(bank.data.data);
        const currentBank = bank.data.data.find((bank: any) => bank.id === userData.bankDetail?.bank_ID)
        setCurrentBank(currentBank)
        // console.log(currentBank)
      }
      else
        setBlockMasterData([])

    } catch (e) {
      console.log('Error fetching master details');
      console.log(e)
    } finally {
      setIsLoading(false);
    }

  }


  useEffect(() => {
    populateAll()
  }, []);

  const editPressHandler = (editName: string) => {
    console.log(editName);
    setOpenModal(true)
  }

  if (isLoading)
    return <Loading label={'Fetching your details'} />

  return (
    <ScrollView style={styles.rootContainer}>
      {/* Personal Details */}
      <View style={styles.headerContainer}>

        <Text style={styles.header}>Communicaton Details</Text>
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
          <Text style={styles.lable}>PIN</Text>
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
          <Text style={styles.value}>{userData?.personalDetail?.nomine_Relation}</Text>
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

      <Modal visible={openModal} onRequestClose={() => { setOpenModal(false) }}>
        <View style={styles.modalBody}>
          <Pressable onPress={() => { setOpenModal(false) }}>
            <Text>Close</Text>
          </Pressable>
        </View>
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
  modalBody: {
    flex: 1,
    minHeight: windowHeight,
    // borderColor: 'red',
    // borderWidth: 2,
    padding: 8
  }
})