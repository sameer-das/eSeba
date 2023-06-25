import { StyleSheet, Text, View, Modal, Pressable, TextInput, FlatList } from 'react-native'
import React, { useState } from 'react'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { windowHeight, windowWidth } from '../../utils/dimension'
import colors from '../../constants/colors'
import { useNavigation, useRoute } from '@react-navigation/native';

const SignUp = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const navigation = useNavigation();
  const route = useRoute<any>();

  const [flatListData, setFlatListData] = useState<any[]>([
    { name: 'Sameer' },
    { name: 'Sunny' },
    { name: 'Meera' },
    { name: 'Venagesh' },
    { name: 'Priya' },
    { name: 'Ankhi' },
    { name: 'Ramesh' },
    { name: 'Pramod' },
    { name: 'Surya' },
  ])
  return (
    <View style={styles.rootContainer}>
      <Text style={styles.welcomeText}>Sign Up</Text>
      <View>
        <Text style={styles.textInputLabel}>Please Enter First Name</Text>
        <TextInput style={styles.textInput} />
        <Text style={styles.textInputErrorLabel}>Error in First Name</Text>
      </View>
      <Pressable onPress={() => setModalVisible(true)}>
        <Text>Open Modal</Text>
      </Pressable>
      <Text>{route.params.refNo}</Text>

      <Modal visible={modalVisible}
        transparent={true} animationType='fade'>
        <View style={styles.modalArea}>
          <View style={styles.modalBody}>
            <View>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{'This is header'}</Text>
                <Pressable onPress={() => { setModalVisible(false) }}>
                  <MaterialIcon name='close' size={30} color={colors.secondary300} />
                </Pressable>
              </View>
              <TextInput style={styles.searchBox} placeholder='Search' />

              <View style={styles.flatListContainer}>
                <FlatList data={flatListData} renderItem={({ item }) => {
                  return (<Pressable style={styles.listItem}>
                    <Text style={styles.listItemText}>{item.name}</Text>
                  </Pressable>)
                }} />
              </View>
            </View>

            <Pressable style={styles.modalFooterColseButton} onPress={() => { setModalVisible(false) }}>
              <Text style={styles.modalFooterColseButtonLabel}>Close</Text>
            </Pressable>
          </View>


        </View>
      </Modal>



    </View>
  )
}

export default SignUp

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    padding: 8,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: colors.white
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary500,
    textAlign: 'center'
  },
  textInput: {
    borderWidth: 2,
    borderColor: colors.primary100,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 16,
    color: colors.primary500,
    borderRadius: 8,
    width: '100%'
  },
  textInputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary500,
  },
  textInputErrorLabel: {
    fontSize: 14,
    color: colors.secondary500,
    fontWeight:'bold'
  },
  modalArea: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBody: {
    height: (windowHeight / 2) + 40,
    width: windowWidth - 20,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'space-between'
  },
  modalHeader: {
    flexDirection: 'row',
    paddingBottom: 12,
    justifyContent: 'space-between'
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary500
  },
  modalFooterColseButton: {
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.secondary300,
  },
  modalFooterColseButtonLabel: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',

  },
  searchBox: {
    borderWidth: 1,
    borderColor: colors.primary100,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 16,
    color: colors.primary500,
    borderRadius: 8,
    width: '100%'
  },
  flatListContainer: {
    height: (windowHeight / 2) - 160,
    marginTop: 12
  },
  listItem: {
    paddingVertical: 14,
    borderBottomColor: colors.primary100,
    borderBottomWidth: 1
  },
  listItemText: {
    color: colors.primary500,
    fontSize: 18
  }

})