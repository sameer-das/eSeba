import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import colors from '../constants/colors'

const MobilePlanCard = ({ item, handlePress }: any) => {

    return (<Pressable style={styles.planCard} onPress={() => handlePress(item)}>
        <Text style={styles.planName}>{item.planName}</Text>
        <View style={styles.planContainer}>
            <Text style={styles.planAmount}>₹ {item.amount}</Text>
            <View>
                <Text style={styles.validity}> Validy : {item.validity}</Text>
                <Text style={styles.validity}> Talktime : {item.talktime}</Text>
            </View>
        </View>
        <View>
            <Text style={styles.details} numberOfLines={5}>{item.description}</Text>
        </View>
    </Pressable>)
}

export default MobilePlanCard

const styles = StyleSheet.create({
    planCard: {
        marginTop: 12,
        borderColor: colors.primary500,
        borderWidth: 1,
        borderRadius: 4,
        borderLeftColor: colors.primary500,
        borderLeftWidth: 6,
        padding: 8

    },
    planName: {
        fontSize: 14,
        color: colors.primary500,
        fontWeight: 'bold',
    },
    planAmount: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary500,
        paddingRight: 18,
        borderRightColor: colors.primary500,
        borderRightWidth: 2
    },
    planContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8
    },
    validity: {
        fontSize: 14,
        fontWeight: 'bold',
        paddingLeft: 18,
        color: colors.primary500
    },
    details: {
        fontSize: 14,
        alignSelf: 'stretch',
        color: colors.primary500,
    },
})