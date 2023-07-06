import { Pressable, StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import InputWithLabelAndError from '../../../components/InputWithLabelAndError';
import CustomImagePicker from '../../../components/CustomImagePicker';
import colors from '../../../constants/colors';

const UpdatePan = () => {

    const [pan, setPan] = useState<string>('');
    const [panImage, setPanImage] = useState<any>('');
    return (
        <ScrollView style={styles.rootContainer}>
            <Text style={styles.pageTitle}>Update Your PAN Details</Text>
            <View style={styles.formCard}>
                {/* PAN number */}
                <InputWithLabelAndError
                    value={pan}
                    onChangeText={(text: string) => setPan(text)}
                    placeholder='Enter PAN'
                    inputLabel='Enter PAN'

                />
                {/* Adhar Front */}
                <CustomImagePicker value={panImage} setValue={setPanImage} placeholder='Tap to upload image of your PAN' label='Image of your PAN' />

                <Pressable style={styles.uploadButton}>
                    <Text style={styles.uploadButtonText}>Upload and Update Details</Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}

export default UpdatePan

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        padding: 8,
        backgroundColor: colors.white,


    }, pageTitle: {
        fontSize: 24,
        color: colors.primary500,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    formCard: {
        marginTop: 24,
    },
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
    uploadButton: {
        paddingVertical: 16,
        backgroundColor: colors.primary500,
        alignItems: 'center',
        borderRadius: 8
    },
    uploadButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    }
})