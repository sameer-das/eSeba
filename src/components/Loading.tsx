import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'
import colors from '../constants/colors'

const Loading = ({label}: any) => {

  return (
    <View style={styles.loaderWrapper}>
            <ActivityIndicator size={50}  color={colors.primary500}/>
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
        fontSize: 20,
        fontWeight: '600',
        color: colors.primary500,
        textAlign: 'center'
    }
})