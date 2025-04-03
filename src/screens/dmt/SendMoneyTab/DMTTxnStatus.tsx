import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { BackHandler, Pressable, StyleSheet, Text, View } from 'react-native'
import colors from '../../../constants/colors'

const DMTTxnStatus = () => {
    const route = useRoute();
    const navigation = useNavigation<any>();

    const params = (route.params as any) || {}; // Default to empty object to prevent crashes

    const handleBackButton = () => {
        console.log('back button pressed in DMTTxnStatus');
        navigation.popToTop(); // goes to the main screen
        return true; // do not default go back if true
    }

    useEffect(() => {
        // console.log(params)
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton)
        }
    }, []);


    const calculateConvFee = (fee: string) => {
        let f = 0;
        try {
            f = Number(fee) / 100;
        } catch(e) {
            f = 0;
            console.log('Error converting Conv fee');
            console.log(e);
        }
        return f;
    }

    return (
        <View style={
            [styles.rootContainer,
            { backgroundColor: params.responseReason === 'Successful' ? colors.success500 : colors.failed }]}>
            <Text style={{ textAlign: 'center', color: colors.white, fontSize: 28, marginTop: 80, marginBottom: 20, fontWeight: 'bold' }}>{params.responseReason}</Text>
            {/* If there is Error Info !params?.respDesc &&  */}
            {
                (params?.errorInfo) &&
                <View>
                    <Text style={{ textAlign: 'center', color: colors.white, fontSize: 16, }}>
                        {params.errorInfo?.error?.errorMessage}</Text>

                        <Text style={{ textAlign: 'center', color: colors.white, fontSize: 12, marginVertical: 8 }}>
                        Error Code : {params.errorInfo?.error?.errorCode}</Text>
                </View>
            } 
            
            {
                (!params?.errorInfo) && 
                <View>
                    <Text style={{ textAlign: 'center', color: colors.white, fontSize: 16, }}>
                    {params.respDesc}</Text>
                </View>
            }

            
                <View style={{marginTop: 40}}>
                    <Text style={{ textAlign: 'center', color: colors.white, fontSize: 20, textDecorationLine:'underline'}}>Fund Transaction Details</Text>
                    <View style={{flexDirection: 'row', justifyContent:'center', gap:16, marginTop: 8}}>
                        {params?.fundTransferDetails?.fundDetail?.txnAmount && <Text style={{textAlign: 'center', color: colors.white, fontSize: 16}}>Amount: {params?.fundTransferDetails?.fundDetail?.txnAmount} ₹</Text>}
                        {params?.fundTransferDetails?.fundDetail?.custConvFee && <Text style={{textAlign: 'center', color: colors.white, fontSize: 16}}>Conveyance Fee: {calculateConvFee(params?.fundTransferDetails?.fundDetail?.custConvFee)} ₹</Text>}
                    </View>
                    
                    <Text style={{textAlign: 'center', color: colors.white, fontSize: 12, marginTop: 8}}>URID: {params?.fundTransferDetails?.fundDetail?.uniqueRefId}</Text>
                    <Text style={{textAlign: 'center', color: colors.white, fontSize: 12, marginTop: 4}}>Ref ID: {params?.fundTransferDetails?.fundDetail?.refId}</Text>
                    {params?.fundTransferDetails?.fundDetail?.dmtTxnId && <Text style={{textAlign: 'center', color: colors.white, fontSize: 12, marginTop: 4}}>DMT Txn ID: {params?.fundTransferDetails?.fundDetail?.dmtTxnId}</Text>}
                    {params?.fundTransferDetails?.fundDetail?.bankTxnId && <Text style={{textAlign: 'center', color: colors.white, fontSize: 12, marginTop: 4}}>Bank Txn ID: {params?.fundTransferDetails?.fundDetail?.bankTxnId}</Text>}
                    
                    {/* {<Text style={{textAlign: 'center', color: colors.white, fontSize: 14, marginTop: 4}}>Ref ID: {params?.fundTransferDetails?.fundDetail?.impsName}</Text>} */}
                </View>
                {/* Go back Button */}
                <View style={{alignItems:'center', marginTop: 30}}>
                    <Pressable 
                        style={{paddingVertical: 10, 
                                backgroundColor: colors.primary500, 
                                width: '70%',
                                borderRadius: 8}} 
                        onPress={() => navigation.popToTop() } >
                        <Text style={{color: colors.white, 
                            fontSize: 18, 
                            textAlign: 'center', 
                            fontWeight:'bold'}}>Go Back</Text>
                    </Pressable>
                </View>
            
        </View>
    )
}

export default DMTTxnStatus

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        padding: 8
    }
})