import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import colors from '../constants/colors'

const MobilePlanCard = ({ item, handlePress }: any) => {


    return (<Pressable style={styles.planCard} onPress={() => handlePress(item)}>
        <Text style={styles.planName}>{item.planName}</Text>
        <View style={styles.planContainer}>
            <Text style={styles.planAmount}>{item.amount}</Text>
            <Text style={styles.validity}> Validy : {item.validity}</Text>
        </View>
        <View>
            <Text style={styles.details} numberOfLines={5}>{item.description}</Text>
        </View>
    </Pressable>)
}

export default MobilePlanCard

const styles = StyleSheet.create({
    planCard: {
        marginVertical: 6,
        // shadowColor: '#ccc',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.5,
        // shadowRadius: 4,
        // elevation: 2,
        borderColor: colors.primary500,
        borderWidth: 1,
        borderRadius: 4,
        // borderLeftColor: colors.primary500,
        borderLeftWidth: 12,
        paddingLeft: 16,
        paddingVertical: 8,
        paddingRight: 8,

    },
    planName: {
        fontSize: 18,
        color: colors.primary500,
        fontWeight: 'bold',
    },
    planAmount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.primary500,
        paddingRight: 18,
        borderRightColor: colors.primary300,
        borderRightWidth: 2
    },
    planContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8
    },
    validity: {
        fontSize: 14,
        paddingLeft: 18,
        color: colors.primary400
    },
    details: {
        fontSize: 14,
        alignSelf: 'stretch',
        color: colors.primary500,
    },
})