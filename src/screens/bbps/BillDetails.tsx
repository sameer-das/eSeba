import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import colors from '../../../src/constants/colors'
import { windowWidth } from '../../utils/dimension'

const BillDetails = ({ billerResponse, proceedToPay, inputParams }: any) => {

    const payHandler = () => {
        console.log('Proceed to pay clicked');
        proceedToPay();
    }

    return (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View>
                <View style={[styles.card]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ width: (windowWidth - 50) * 0.75 }}>
                            {inputParams.map((curr: any) => {
                                return (<View key={curr.paramName} style={styles.header}>
                                    <Text style={styles.paramName}>{curr.paramName}</Text>
                                    <Text style={styles.paramValue}>{curr.paramValue}</Text>
                                </View>)
                            })}                                 
                        </View>
                        <Image source={require('../../../assets/logos/BharatBillPay.png')} />

                    </View>
                    <View style={styles.bill_details_container}>
                        <View style={styles.bbpsLogoContainer}>
                            <Text style={styles.bill_details_header}>Bill Details</Text>
                        </View>
                        <View style={styles.bill_details}>
                            <View style={styles.left_col}>
                                <Text style={styles.bill_details_label}>Name</Text>
                                <Text style={styles.bill_details_label}>Bill Date</Text>
                            </View>
                            <View style={styles.right_col}>
                                <Text style={styles.bill_details_value}>{billerResponse.customerName}</Text>
                                <Text style={styles.bill_details_value}>{billerResponse.billDate}</Text>
                            </View>
                        </View>

                        <View style={styles.amount_container}>
                            <Text style={styles.amount_value}>₹ {billerResponse.billAmount / 100}</Text>
                            <Text style={styles.amount_due_date}>{billerResponse.dueDate}</Text>
                        </View>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paramName: {
        fontSize: 16,
        color: colors.primary500,
        fontWeight: 'bold'
    },
    paramValue: {
        fontSize: 14,
        color: colors.primary500
    },
    bill_details_container: {
        // paddingTop: 12,
        marginTop:12,
    },
    bill_details: {
        marginTop: 12,
        flexDirection: 'row',
    },
    left_col: { flex: 1 },
    right_col: { flex: 1 },
    bill_details_header: {
        fontSize: 22,
        color: colors.primary500,
        fontWeight: 'bold'
    },
    bill_details_label: {
        fontSize: 18,
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
        color: colors.primary500,
        fontWeight: 'bold'
    },
    amount_due_date: {
        marginTop: 14,
        fontSize: 16,
        color: 'red'
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

    bbpsLogoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    }
})