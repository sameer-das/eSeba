import { Alert, Dimensions, Linking, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import ButtonPrimary from '../../components/ButtonPrimary'
import RNFS from 'react-native-fs';
import { AuthContext } from '../../context/AuthContext';
import { downloadIcardURL } from '../../API/services';
import colors from '../../constants/colors';


const Icard = () => {
    const { userData } = useContext(AuthContext);
    const [isDownloading, setIsDownloading] = useState(false);
    const [buttonLabel, setButtonLabel] = useState('Download');
    const [error, setError] = useState(null);
    const downloadPath = RNFS.DownloadDirectoryPath + `/epay/${userData.personalDetail.user_FName.toLowerCase()}_${userData.personalDetail.user_LName.toLowerCase()}_icard.pdf`;

    const downloadFileBegin = () => {
        console.log('Download Begin');

    };

    const downloadFileProgress = (data: any) => {
        const percentage = ((100 * data.bytesWritten) / data.contentLength).toFixed(1);
        setButtonLabel(`Downloading... (${percentage})%`)
    };

    const handleFileDownload = async () => {
        console.log(downloadPath)
        setError(null);
        setIsDownloading(true);
        setButtonLabel('Downloading')


        try {
            await RNFS.mkdir(RNFS.DownloadDirectoryPath + `/epay`);
            console.log('folder created')
            // await RNFS.unlink(downloadPath);
        } catch (error: any) {
            console.log(error);
            setError(error.message)
        }

        RNFS.downloadFile({
            begin: downloadFileBegin,
            progress: downloadFileProgress,
            fromUrl:  downloadIcardURL(userData.user.user_ID),
            toFile: downloadPath,
        }).promise.then((result) => {
                console.log('Download successful:', result);
                setIsDownloading(false);
                setButtonLabel('Download');
                Alert.alert('File Downloaded', `The ID card is downloaded to path ${downloadPath}`)
            })
            .catch((error: any) => {
                console.log('Failed to download file:', error);
                setIsDownloading(false);
                setButtonLabel('Download Failed');
                setError(error.message)
            });
    }

    return (
        <View style={{ flex: 1, padding: 20, justifyContent: 'space-between' }}>
            <View style={{flex: 1}}>
                <Text style={{ textAlign: 'center', fontSize: 20, marginTop: 20, color: colors.primary500, fontWeight: 'bold' }}>Please download the identity card </Text>
                <Text style={{ textAlign: 'center', fontSize: 16, marginTop: 20, color: colors.primary300 }}>Take a print out of the downloaded PDF file and use only for official purpose.</Text>
                <View style={{ marginTop: 60  }}>
                    <ButtonPrimary disabled={isDownloading} label={buttonLabel} onPress={handleFileDownload} />
                </View>

                <View style={{marginTop: 20}}>
                    {error && <Text>{error}</Text>}
                </View>
            </View>

            <View style={{ }}>
                <Text style={{ textAlign: 'center', fontSize: 14, textDecorationLine: 'underline' }}>Disclaimer</Text>
                <Text style={{ fontSize: 12 }}>1. By Downloading this identity card you are agreeing to the terms and conditions of the ePay.</Text>
                <Text style={{ fontSize: 12 }}>2. The identity card is not meant to be used for Governmental purpose.</Text>
                <Text style={{ fontSize: 12 }}>3. Any misuse of the identity card is prohibited and GESIL will not be responsible for that. </Text>
                <Text style={{ fontSize: 12 }}>3. Any tampering/editing to the identity card is prohibited and GESIL will not be responsible for that. </Text>
            </View>
        </View>
    )
}

export default Icard

const styles = StyleSheet.create({
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
})