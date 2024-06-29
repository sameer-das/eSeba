import { StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native'
import React from 'react'
import colors from '../constants/colors'

const Loading = ({label}: any) => {

  return (
    <View style={styles.loaderWrapper}>
            <ActivityIndicator size={50}  color={colors.primary500}/>
            {/* <Image source={require('../../assets/loader.gif')} style={{ width: 80, height: 80, resizeMode: 'cover' }} /> */}
            <Text style={styles.loadingText}>{label || 'Loading...'}</Text>
        </View>
  )
}

export default Loading;

const styles = StyleSheet.create({
    loaderWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white
    },
    loadingText: {
        marginTop: 20,
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary500,
        textAlign: 'center'
    }
})