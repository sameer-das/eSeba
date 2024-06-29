import { Alert, StyleSheet, Text, TextInput, View, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import colors from '../../constants/colors'
import { useIsFocused } from '@react-navigation/native';
import { getRetailerWiseUsers } from '../../API/services';
import { AuthContext } from '../../context/AuthContext';
import Loading from '../../components/Loading';

const MyTeams = () => {
    const { userData } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const focused = useIsFocused();



    useEffect(() => {
        if (focused) {
            setIsLoading(true);
            const getTeamDetails = async () => {
                try {
                    const { data: resp } = await getRetailerWiseUsers(userData.user.user_ID);

                    if (resp.status === 'Success' && resp.code === 200) {

                        if (resp.data) {
                            const formatted = resp.data?.map((curr: any) => {
                                return { ...curr, 'payment_Per_Amount': curr['payment_Per_Amount'].toFixed(2) }
                            });

                            setUsers(formatted);

                        } else {
                            setUsers([]);
                        }


                    } else {
                        Alert.alert('Fail', 'Failed to fetch team details!')
                    }
                } catch (error) {
                    Alert.alert('Error', 'Error while fetching team details!')
                } finally {
                    setIsLoading(false)
                }
            }

            getTeamDetails();

        }
    }, [focused]);


    // ********** Each Item of FlatList
    const _renderItem = ({ item, index }: any) => {
        return <View style={{ borderBottomColor: colors.grey, borderBottomWidth: 1, paddingBottom: 4, marginVertical: 4 }}>
            <Text style={{ color: colors.primary500, fontSize: 16, fontWeight: 'bold' }}> #{index + 1} {item.userName}</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text selectable selectionColor='orange' style={{ color: colors.primary500, fontSize: 14 }}>{item.login_Code}</Text>
                <Text selectable selectionColor='orange' style={{ color: colors.primary500, fontSize: 14 }}>Mobile No : {item.mobile_Number}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text selectable selectionColor='orange' style={{ color: colors.primary500, fontSize: 14 }}>Dist: {item.district_Name}</Text>
                <Text selectable selectionColor='orange' style={{ color: colors.primary500, fontSize: 16, fontWeight: 'bold' }}>₹ {item.payment_Per_Amount}</Text>
            </View>
        </View>
    }


    // ************* The Filter Input and FlatList

    const FilterSection = ({ data }: any) => {
        const [search, setSearch] = useState('');
        const [filteredUsers, setFilteredUsers] = useState(data);
        const [totalFilteredCount, setTotalFilteredCount] = useState(0);

        useEffect(() => {
            if (search === '') {
                setFilteredUsers(data);
                setTotalFilteredCount(data.length)
            } else {
                console.log(search)
                const filtered = data.filter((curr: any) => {
                    return curr.userName.toLowerCase().includes(search.toLowerCase()) ||
                        curr.login_Code.toLowerCase().includes(search.toLowerCase()) ||
                        curr.mobile_Number.toLowerCase().includes(search.toLowerCase()) ||
                        curr.district_Name.toLowerCase().includes(search.toLowerCase())
                })
                console.log(filtered)
                setFilteredUsers(filtered);
                setTotalFilteredCount(filtered.length);
            }
        }, [search, data]);


        // ********** JSX of The Filter Input and FlatList
        return <View style={{ flex: 1 }}>
            <View style={styles.mobileNoInput}>
                <TextInput style={styles.input}
                    placeholder='Search'
                    value={search}
                    onChangeText={(text: string) => { setSearch(text) }} />
            </View>
            <Text style={{ color: colors.success500, textAlign: 'right', marginBottom: 8 }}>Showing {totalFilteredCount} records</Text>

            <View style={{ flex: 1 }}>
                <FlatList showsVerticalScrollIndicator={true} data={filteredUsers} renderItem={_renderItem} />
            </View>
        </View>
    }


    // ************** Main JSX ******************* 

    if (isLoading)
        return <Loading />

    return (
        <View style={styles.rootContainer}>
            <Text style={{ fontSize: 24, color: colors.primary500, textAlign: 'center', fontWeight: 'bold' }}>My Teams</Text>
            {
                userData.user.user_Type_ID === 1 ?
                    <View>
                        <Text style={{ fontSize: 16, color: colors.primary500, textAlign: 'center' }}>This feature is not available for End User.</Text>
                        <Text style={{ fontSize: 16, color: colors.primary500, textAlign: 'center' }}>To use the service, please register as e-Sathi.</Text>
                    </View>
                    : (users.length === 0 ?
                        <Text style={{ fontSize: 16, color: colors.primary500, textAlign: 'center' }}>No members found!</Text>
                        : <FilterSection data={users} />
                    )
            }
        </View>
    )
}

export default MyTeams

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 8
    },
    mobileNoInput: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: colors.primary500,
        marginBottom: 4
        // alignItems: 'center',
        // paddingHorizontal: 8
    },
    input: {
        fontSize: 16,
        color: colors.primary500,
        width: '100%'
    },
})