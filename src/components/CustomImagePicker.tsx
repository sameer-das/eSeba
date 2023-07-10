import { StyleSheet, Text, View, Pressable, Image, Modal } from 'react-native'
import React, { useState } from 'react'
import colors from '../constants/colors'
import ImagePicker from 'react-native-image-crop-picker';
import { windowWidth } from '../utils/dimension';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

interface ImagePickerProps {
    value: string,
    setValue: Function,
    placeholder: string,
    label: string,
    cropperCircleOverlay?: boolean,
    useFrontCamera?: boolean,
    compressImageQuality?: number
}
const CustomImagePicker = ({ value, setValue, placeholder, label, cropperCircleOverlay, useFrontCamera, compressImageQuality }: ImagePickerProps) => {

    const [modalVisible, setModalVisible] = useState(false)
    const openGallery = () => {
        setModalVisible(false);
        ImagePicker.openPicker({
            freeStyleCropEnabled: true,
            cropping: true,
            includeBase64: true,
            cropperActiveWidgetColor: colors.primary500,
            cropperCircleOverlay: cropperCircleOverlay || false, // add circle for cropping
            mediaType: 'photo',
            compressImageQuality: compressImageQuality || 0.3,
            // cropperToolbarColor: colors.primary500,
            // cropperToolbarWidgetColor: colors.white
        }).then((image: any) => {
            // console.log(image.size);
            setValue('data:image/jpeg;base64,' + image.data)
        }).catch(x => {
            console.log(x);
        });
    }
    const openCamera = () => {
        setModalVisible(false);
        ImagePicker.openCamera({
            freeStyleCropEnabled: true,
            cropping: true,
            includeBase64: true,
            cropperActiveWidgetColor: colors.primary500,
            cropperCircleOverlay: cropperCircleOverlay || false, // add circle for cropping
            mediaType: 'photo',
            useFrontCamera: useFrontCamera || false,
            compressImageQuality: compressImageQuality || 0.3,
            // cropperToolbarColor: colors.primary500,
            // cropperToolbarWidgetColor: colors.white
        }).then((image: any) => {
            // console.log(image);
            setValue('data:image/jpeg;base64,' + image.data)
        }).catch(x => {
            console.log(x);
        });
    }

    const openPickerOption = () => {
        setModalVisible(true)
    }


    return (
        <>
            <View style={styles.imageUploadSection}>
                <Text style={styles.imageLabel}>{label}</Text>
                <Pressable style={[styles.adharFrontPicContainer, styles.centerText]} onPress={openPickerOption}>
                    {!value && <Text style={styles.uploadText}>{placeholder}</Text>}
                    {value && <Image source={{ uri: value }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />}
                </Pressable>
                {value ? <View style={styles.imageBottomControlContainer}>
                    <Text style={styles.uploadAgainText}>Tap on the image to upload again!</Text>
                    <Pressable style={styles.deleteButton} onPress={() => setValue('')}>
                        <Text style={styles.deleteButtonText}>Remove</Text>
                    </Pressable>
                </View> : <View style={styles.imageBottomControlContainer}></View>}
            </View>

            <Modal visible={modalVisible}
                transparent={true} animationType='fade' onRequestClose={() => { setModalVisible(false) }} >
                <View style={modal.modal}>
                    <View style={modal.contentArea}>
                        <View style={modal.modalHeader}>
                            <Text style={modal.modalHeaderText}>Choose from</Text>
                        </View>
                        <Pressable style={modal.option} onPress={openCamera}>
                            <MaterialIcon name='image' size={40} color={colors.primary500} />
                            <Text style={modal.optionLabel}>Camera</Text>
                        </Pressable>
                        <Pressable style={modal.option} onPress={openGallery}>
                            <MaterialIcon name='photo-camera' size={40} color={colors.primary500} />
                            <Text style={modal.optionLabel}>Gallery</Text>
                        </Pressable>

                        <View style={modal.bottomContainer}>
                            <Pressable onPress={() => setModalVisible(false)}>
                                <Text style={modal.closeLabel}>Close</Text>    
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}

export default CustomImagePicker

const modal = StyleSheet.create({
    modal: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentArea: {
        width: windowWidth - 50,
        height: 210,
        backgroundColor: colors.white,
        borderRadius: 8
    },
    modalHeader: {
        paddingVertical: 8
    },
    modalHeaderText: {
        color: colors.black,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    option: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary500,
        marginLeft: 12
    },
    bottomContainer: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        borderTopColor: '#ccc',
        borderTopWidth:0.5
        // borderColor: 'red',
        // borderWidth: 1
    },
    closeLabel: {
        fontSize: 18,
        color: colors.secondary500,
        fontWeight:'bold'
    }
})

const styles = StyleSheet.create({
    imageUploadSection: { marginBottom: 20 },
    adharFrontPicContainer: {
        height: 180,
        borderColor: colors.primary500,
        borderWidth: 1,
        borderRadius: 8
    },
    centerText: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    uploadText: {
        fontSize: 16,
        color: colors.primary100
    },
    imageLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary500,
        marginBottom: 4
    },
    imageBottomControlContainer: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 36, // constant height 
    },
    uploadAgainText: {
        fontSize: 16,
        color: colors.primary100,
        fontStyle: 'italic'
    },
    deleteButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 16,
        backgroundColor: colors.secondary500,
    },
    deleteButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold'
    },
})