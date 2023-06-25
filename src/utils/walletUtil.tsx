import { Alert } from 'react-native';
import { getWalletBalance, validateTPin } from "../API/services";

export const validateWalletPin = async (userId: number, pin: string) => {
    let bRet = false;
    try {
        const pinValidateResponse = await validateTPin(userId, pin);
        if (pinValidateResponse.data.status === 'Success' && pinValidateResponse.data.code === 200 && pinValidateResponse.data.data) {
            bRet = true;
        } else {
            bRet = false;
        }
    } catch (e) {
        console.log(e);
        bRet = false;
        Alert.alert('Error', 'Error while validating PIN!');
    } finally {

    }
    return bRet;
}

export const validateWalletBalance = async (amount: number, userEmail: string) => {
    let bRet = false;
    try {
        const validateWalletResponse = await getWalletBalance(userEmail);
        // console.log(validateWalletResponse);
        if (validateWalletResponse.data.status === 'Success' && validateWalletResponse.data.code === 200) {
            const [walletBalance, commission] = validateWalletResponse.data.data.split(',');
            if (+walletBalance < +amount) {
                bRet = false;
                Alert.alert('Low Wallet Balance', 'You dont have sufficient balance for this transaction!');
            } else {
                // wallet balance OK to proceed
                bRet = true;
            }
        } else {
            bRet = false;
            Alert.alert('Error', 'Error while checking wallet balance!');
        }
    } catch (e) {
        console.log(e);
        bRet = false;
        Alert.alert('Error', 'Error while checking wallet balance!');
    } finally {

    }
    return bRet;
}
