import { StyleSheet, Text, View, Pressable, Modal, TextInput, FlatList } from 'react-native'
import React, { useState } from 'react'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import colors from '../constants/colors'
import { windowHeight, windowWidth } from '../utils/dimension';

const SelectBoxWithLabelAndError = ({ errorMessage, onSelectionChange, value, label, 
    placeholder, listData, optionLable }: any) => {
    // const borderStyle = errorMessage === '' ? { borderColor: colors.secondary100 }
    //     : { borderColor: colors.primary100 }
    const borderStyle = { borderColor: colors.primary100 }
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const handleItemPress = (item: any) => {
        onSelectionChange(item);
        setModalVisible(false);
    }

    return (
        <>
            <View style={{ marginVertical: 2 }}>
                <Text style={styles.label}>{label}</Text>
                <Pressable style={[styles.pressable, borderStyle]} onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.text}>{value === '' ? placeholder : value}</Text>
                </Pressable>
                <Text style={styles.errorLabel}>{errorMessage}</Text>
            </View>

            <Modal visible={modalVisible}
                transparent={true} animationType='fade'>
                <View style={styles.modalArea}>
                    <View style={styles.modalBody}>
                        <View>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{label}</Text>
                                <Pressable onPress={() => { setModalVisible(false) }}>
                                    <MaterialIcon name='close' size={30} color={colors.secondary300} />
                                </Pressable>
                            </View>

                            {listData.length > 5 && <TextInput  style={styles.searchBox} placeholder='Search' />}

                            <View style={styles.flatListContainer}>
                                <FlatList data={listData} renderItem={({ item }) => {
                                    return (<Pressable style={styles.listItem} onPress={() => handleItemPress(item)}>
                                        <Text style={styles.listItemText}>{optionLable(item)}</Text>
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
        </>


    )
}

export default SelectBoxWithLabelAndError

const styles = StyleSheet.create({
    pressable: {
        borderWidth: 2,
        paddingHorizontal: 8,
        paddingVertical: 11,
        borderRadius: 8,
        width: '100%'
    },
    text: {
        fontSize: 16,
        color: colors.primary500,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary500,
        marginBottom: 4
    },
    errorLabel: {
        fontSize: 14,
        color: colors.secondary500,
        fontWeight: 'bold'
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
        paddingVertical: 16,
        // borderBottomColor: colors.primary100,
        // borderBottomWidth: 1
    },
    listItemText: {
        color: colors.primary500,
        fontSize: 18
    },
})