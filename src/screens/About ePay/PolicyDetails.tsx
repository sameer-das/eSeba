import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'
import { windowHeight } from '../../utils/dimension'
import { WebView } from 'react-native-webview';
import colors from '../../constants/colors';
import { useRoute } from '@react-navigation/native';

const PolicyDetails = () => {

    const route = useRoute<any>();
    console.log(route.params)
  return (
    <View style={styles.container}>
    <WebView
         style={{ flex: 1 }}
         originWhitelist={['https://esebakendra.com', 'https://secure.ccavenue.com']}
         source={{ uri: `https://esebakendra.com/esk/about/${route.params?.policy}` }}
         domStorageEnabled
         javaScriptEnabled
         allowUniversalAccessFromFileURLs
         onError={e => console.log('Webview Error', e)}
         mixedContentMode='always'
         cacheEnabled={false}
         startInLoadingState
         renderLoading={() => {
             return (<View style={{flex: 1}}>
                 <ActivityIndicator size={'large'} color={colors.primary500}/>
             </View>)
         }}
     />
 </View>
  )
}

export default PolicyDetails

const styles = StyleSheet.create({
    container: {flex: 1}
})