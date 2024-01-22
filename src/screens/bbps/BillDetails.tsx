import React, { useEffect, useState } from 'react'
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import colors from '../../../src/constants/colors'
import { windowWidth } from '../../utils/dimension'
import AsyncStorage from '@react-native-async-storage/async-storage'

const BillDetails = ({ billerResponse, proceedToPay, inputParams, additionalInfo }: any) => {

    const payHandler = () => {
        console.log('Proceed to pay clicked');
        if(additionalInfo) {
            proceedToPay(+amount * 100);
        } else {
            proceedToPay(billerResponse.billAmount)
        }

    }

    // console.log(billerResponse);
    // console.log('-------------------------')
    // console.log(additionalInfo);

    const [amount, setAmount] = useState(+billerResponse.billAmount > 0 ? (billerResponse.billAmount / 100).toString() : '');
    const [disabled, setDisabled] = useState(true);
    const [currentServiceDetails, setCurrentServiceDetails] = useState<any>({});

    useEffect(() => {
        async function read() {
            const sd = await AsyncStorage.getItem('currentServiceDetails') as string;
            const serviceDetails = JSON.parse(sd);
            setCurrentServiceDetails(serviceDetails);
            // console.log(serviceDetails);
        }
        read();
    },[])

    useEffect(() => {
        if(amount) {
            if(+amount > 0) {
                setDisabled(false)
            } else {
                setDisabled(true)
            }
        } else {
            setDisabled(true)
        }
    }, [amount]);

    let additionalInfoRow;
    // For Fast tag dont show add biillerresponse amount to additionalinfo amount
    // add more conditions
    if(currentServiceDetails?.services_cat_id == 23 && currentServiceDetails?.services_id == 4) {
        additionalInfoRow = <Text style={styles.bill_details_value}>₹ {+additionalInfo?.info[0].infoValue}</Text>
    } else {
        additionalInfoRow = <Text style={styles.bill_details_value}>₹ {+additionalInfo?.info[0].infoValue + (+billerResponse?.billAmount / 100)}</Text>
    }

    return (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View>
                <View style={[styles.card]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.primary100 }}>
                        <View style={{ width: (windowWidth - 50) * 0.85 }}>
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
                                {additionalInfo && <Text style={styles.bill_details_label}>{additionalInfo?.info[0].infoName}</Text>}
                            </View>
                            <View style={styles.right_col}>
                                <Text style={styles.bill_details_value}>{billerResponse.customerName}</Text>
                                <Text style={styles.bill_details_value}>{billerResponse.billDate}</Text>
                                {additionalInfo && additionalInfoRow}
                            </View>
                        </View>

                        {/* If Additional Info is null value then show direct biller response - current month due */}
                        {!additionalInfo && <View style={styles.amount_container}>
                            <Text style={styles.amount_value}>₹ {billerResponse.billAmount / 100}</Text>
                            <Text style={styles.amount_due_date}>Due Date: {billerResponse.dueDate}</Text>
                        </View>}

                        {/* If Additional info is there then show the input filed with current biller response as prefilled value */}
                        {additionalInfo && <View style={styles.amount_container}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomColor: colors.primary100, borderBottomWidth: 2 }}>
                                <Text style={{ fontSize: 36, color: colors.primary500, marginRight: 8 }}>₹</Text>
                                <TextInput
                                    placeholder={+billerResponse.billAmount > 0 ? '' : 'Enter Amount'}
                                    style={{ flex: 1, fontSize: 32, color: colors.primary500 }}
                                    value={amount}
                                    onChangeText={(e) => setAmount(e)} />
                            </View>
                            {billerResponse.dueDate && <Text style={styles.amount_due_date}>Due Date: {billerResponse.dueDate}</Text>}
                        </View>}
                    </View>
                </View>
            </View>


            {additionalInfo
                ?
                <Pressable style={[styles.confirm_cta, disabled ? {backgroundColor:colors.primary100} : {}]} onPress={payHandler}  disabled={disabled}>
                    <Text style={styles.confirm_cta_text}>Proceed to pay</Text>
                </Pressable>
                :
                <Pressable style={styles.confirm_cta} onPress={payHandler}>
                    <Text style={styles.confirm_cta_text}>Proceed to pay normal</Text>
                </Pressable>
            }

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
        padding: 8,
        elevation: 5,
    
    },
    card_center_vertical: {
        justifyContent: 'center'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap:'wrap'
    },
    paramName: {
        fontSize: 14,
        color: colors.primary500,
        fontWeight: 'bold'
    },
    paramValue: {
        fontSize: 14,
        color: colors.primary500,
    },
    bill_details_container: {
        // paddingTop: 12,
        marginTop: 6,
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
        fontSize: 14,
        color: colors.primary300,
        fontWeight: 'bold'
    },
    bill_details_value: {
        fontSize: 14,
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
        fontSize: 14,
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