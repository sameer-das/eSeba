import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../../../src/constants/colors'

const BillDetails = () => {
    const payHandler = () => {
        console.log('Proceed to pay clicked')
    }
    return (
        <View style={{flex:1, justifyContent: 'space-between'}}>
            <View style={[styles.card]}>
                <View style={styles.header}>
                    <Text style={styles.biller_name}>TP Central Odisha Distribution Ltd</Text>
                    <Text style={styles.consumer_id}>102S7546891356</Text>
                </View>
                <View style={styles.bill_details_container}>
                    <Text style={styles.bill_details_header}>Bill Details</Text>
                    <View style={styles.bill_details}>
                        <View style={styles.left_col}>
                            <Text style={styles.bill_details_label}>Biller Name</Text>
                            <Text style={styles.bill_details_label}>Bill Date</Text>
                        </View>
                        <View style={styles.right_col}>
                            <Text style={styles.bill_details_value}>Mr Kumar Ojha</Text>
                            <Text style={styles.bill_details_value}>30-Apr-2023</Text>
                        </View>
                    </View>

                    <View style={styles.amount_container}>
                        <Text style={styles.amount_value}>₹ 536</Text>
                        <Text style={styles.amount_due_date}>Due Date: 7-Jun-2023</Text>
                    </View>
                </View>
            </View>

            <Pressable style={styles.confirm_cta} onPress={payHandler}>
                <Text style={styles.confirm_cta_text}>Proceed to pay</Text>
            </Pressable>
        </View>
    )
}

export default BillDetails

const styles = StyleSheet.create({
    card: {
        minHeight: 100,
        margin: 8,
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 16
    },
    card_center_vertical: {
        justifyContent: 'center'
    },
    header: {
        borderBottomColor: colors.primary100,
        borderBottomWidth: 2,
        paddingBottom: 18
    },
    biller_name: {
        fontSize: 18,
        color: colors.primary500
    },
    consumer_id: {
        fontSize: 16,
        color: colors.primary300
    },
    bill_details_container: {
        marginTop: 18

    },
    bill_details: {
        marginTop: 12,
        flexDirection: 'row',
    },
    left_col: { flex: 1 },
    right_col: { flex: 1 },
    bill_details_header: {
        fontSize: 18,
        color: colors.primary500,
        fontWeight: 'bold'
    },
    bill_details_label: {
        fontSize: 16,
        color: colors.primary300,
        fontWeight: 'bold'
    },
    bill_details_value: {
        fontSize: 16,
        color: colors.primary300,
    },
    amount_container: {
        marginTop: 12,
        padding: 18,
        backgroundColor: colors.primary50,
        borderRadius: 8
    },
    amount_value: {
        fontSize: 36,
        color:colors.primary500,
        fontWeight: 'bold'
    },
    amount_due_date:{
        marginTop:14,
        fontSize: 14,
        color:'red'
    },
    confirm_cta: {
        padding: 20,
        backgroundColor: colors.primary500,
        justifyContent: 'center',
        alignItems: 'center'
    },
    confirm_cta_text: {
        fontSize: 18,
        textTransform: 'uppercase',
        color: colors.white
    },
})