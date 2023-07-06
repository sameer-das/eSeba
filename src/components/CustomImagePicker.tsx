import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import React from 'react'
import colors from '../constants/colors'
import ImagePicker from 'react-native-image-crop-picker';

interface ImagePickerProps {
    value: string,
    setValue: Function,
    placeholder: string,
    label: string,
}
const CustomImagePicker = ({ value, setValue, placeholder, label }: ImagePickerProps) => {

    const openPicker = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            includeBase64: true
        }).then((image: any) => {
            // console.log(image);
            setValue('data:image/jpeg;base64,' + image.data)
        }).catch(x => {
            console.log(x);
        });
    }


    return (
        <View style={styles.imageUploadSection}>
            <Text style={styles.imageLabel}>{label}</Text>
            <Pressable style={[styles.adharFrontPicContainer, styles.centerText]} onPress={openPicker}>
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
    )
}

export default CustomImagePicker

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