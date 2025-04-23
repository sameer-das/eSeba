import { Alert } from 'react-native';
import RNFS from 'react-native-fs';

const writeToFile = (content: string) => {
    // console.log(RNFS.DownloadDirectoryPath);
    const filePath = RNFS.DownloadDirectoryPath + `/mylog.txt`;
    RNFS.appendFile(filePath, `${new Date} ========================== \n ${content} \n`, 'utf8')
        .then((success) => {
            console.log(success)
            // console.log('FILE WRITTEN !');
        })
        .catch((err) => {
            console.log(err.message);
            Alert.alert('Error File Write', err.message)
        });
}

export default writeToFile;