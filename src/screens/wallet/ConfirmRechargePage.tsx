import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useEffect, useContext } from 'react';
import { WebView } from 'react-native-webview';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { getEncryptedResponse } from '../../API/services';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../constants/colors';

const ConfirmRechargePage = () => {

    const { userData } = useContext(AuthContext);
    const route = useRoute<any>();
    const navigation = useNavigation<any>();

    const redirect_url: string = `https://api.esebakendra.com/api/GSKRecharge/CCAvenueCallBack`;

    useEffect(() => {

    }, []);

    const _onWebViewMessage = (message: any) => {
        console.log(message.nativeEvent.data);
        if (message.nativeEvent.data === 'go_back_to_wallet') {
            navigation.popToTop();
        }
    }

    /**
     * email
     * phone number
     * amount
     * redirect url
     */
    const webviewRef = useRef<WebView>(null);
    return (
        <WebView
            style={{ flex: 1, borderWidth: 2, borderColor: 'red' }}
            ref={webviewRef}
            // originWhitelist={['https://esebakendra.com', 'https://secure.ccavenue.com']}
            source={{ uri: `https://esebakendra.com/esk/ccavenuemobile?email=${userData.user.user_EmailID}&mobile=${userData.user.mobile_Number}&amount=${(route.params as any).amount}&redirectUrl=${redirect_url}` }}

            onNavigationStateChange={(event) => {
                // console.log(event);
                console.log('Navigation changed :: ' + event.url);
                    if (event.url.includes("upi://pay?pa")) {
                        Linking.openURL(event.url);
                    } else {
                        console.log('Normal url')
                    }              
            }}
            domStorageEnabled
            javaScriptEnabled
            allowUniversalAccessFromFileURLs
            onMessage={message => _onWebViewMessage(message)}
            onError={e => console.log('Webview Error', e)}
            mixedContentMode='always'
            cacheEnabled={false}
            startInLoadingState
            renderLoading={() => {
                return (<View style={{ flex: 1 }}>
                    <ActivityIndicator size={'large'} color={colors.primary500} />
                </View>)
            }}
        />
    )
}

export default ConfirmRechargePage

const styles = StyleSheet.create({})