import { StyleSheet, Text, View, Pressable, Modal, TextInput, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import colors from '../constants/colors'
import { windowHeight, windowWidth } from '../utils/dimension';

const SelectBoxWithLabelAndError = ({ errorMessage, onSelectionChange, value, label,
    placeholder, listData, optionLable, searchKey, disabled }: any) => {
    // const borderStyle = errorMessage === '' ? { borderColor: colors.secondary100 }
    //     : { borderColor: colors.primary100 }
    const borderStyle = { borderColor: colors.primary100 }
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalHeight, setModalHeight] = useState<number>();
    const handleItemPress = (item: any) => {
        onSelectionChange(item);
        setModalVisible(false);
    }

    const [searchValue, setSearchValue] = useState('');
    const [filteredListData, setFilteredListData] = useState(listData);

    const onSearchChange = (text: string) => {
        setSearchValue(text);       
    }

    useEffect(() => {
        const filtered = listData.filter((curr: any) => curr[searchKey].toLowerCase().includes(searchValue.toLowerCase()));
        setFilteredListData(filtered);
    }, [searchValue, listData]);


    const openModal = () => {
        console.log('open modal ')
        let height = 420;
        if (listData.length > 0) {
            // if (listData.length < 5) {
            //     height = listData.length * 50;
            // }
            setModalHeight(height)
            console.log('height ' + height);
            setModalVisible(!modalVisible)
        }

    }

    return (
        <>
            <View style={{}}>
                <Text style={styles.label}>{label}</Text>
                <Pressable style={[styles.pressable, {borderStyle : disabled ? 'dotted': 'solid'}]} onPress={openModal} disabled={disabled}>
                    <Text style={[styles.text, {color: disabled ? colors.grey : colors.primary500}]}>{value === '' ? placeholder : (typeof value === 'object' ? optionLable(value) : value)}</Text>
                    <MaterialIcon name='arrow-drop-down' size={30} color={disabled ? colors.grey : colors.primary500} />
                </Pressable>
                <Text style={styles.errorLabel}>{errorMessage}</Text>
            </View>

            <Modal visible={modalVisible}
                transparent={true} animationType='fade'>
                <View style={styles.modalArea}>
                    <View style={[styles.modalBody, { height: listData.length >= 5 ? 430 : (listData.length * 50) + 130 }]}>
                        <View>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{label}</Text>
                                <Pressable onPress={() => { setModalVisible(false) }}>
                                    <MaterialIcon name='close' size={30} color={colors.secondary300} />
                                </Pressable>
                            </View>

                            {listData.length > 5 && <TextInput style={styles.searchBox} onChangeText={onSearchChange} value={searchValue} placeholder='Search' />}

                            <View style={{ height: listData.length >= 5 ? 250 : (listData.length * 50) }}>
                                <FlatList showsVerticalScrollIndicator={true} data={searchValue ? filteredListData : listData} renderItem={({ item }) => {
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
        borderBottomColor: colors.grey,
        borderBottomWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 11,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        fontSize: 16,
        
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.grey,
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
        width: windowWidth - 20,
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        paddingBottom: 12,
        justifyContent: 'space-between',
        height: 50
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary500
    },
    modalFooterColseButton: {
        marginTop: 10,
        height: 50,
        // paddingVertical: 12,
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
        width: '100%',
        height: 50,
    },
    listItem: {
        height: 50,
        justifyContent: 'center'
    },
    listItemText: {
        color: colors.primary500,
        fontSize: 18
    },
})