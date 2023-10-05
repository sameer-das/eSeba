import { StyleSheet, Text, View, Alert, FlatList, Pressable } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { getAllTickets } from '../../API/services';
import colors from '../../constants/colors';


const MyTickets = () => {
    const { userData } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [tickets, setTickets] = useState<any[]>([]);

    const fetchTickets = async () => {
        try {
            const { data } = await getAllTickets(userData.user.user_EmailID);
            if (data.status === "Success" && data.code === 200) {
                setTickets(data.data)
                // console.log(data.data);
            } else {
                Alert.alert('Fail', 'Failed while fetching complains, please try after sometime!')
            }
        } catch (err) {
            console.log('Error while fetching complain list')
            console.log(err);
            Alert.alert('Error', 'Error while fetching complains!')
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }

    useEffect(() => {
        fetchTickets();
    }, [])

    const _renderItem = ({ item }: any) => {
        return <Pressable onPress={() => {
            if (item.replyByAdmin)
                Alert.alert(`Reply from Admin on ${item.repliedOn}`, item.replyByAdmin)
            else
                Alert.alert(`No Update`)
        }} style={{ marginBottom: 8, borderBottomColor: colors.grey, borderBottomWidth: 1, paddingBottom: 4 }}>
            <View>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.primary500 }}>Subject</Text>
                <Text style={{ fontSize: 14, color: colors.primary500 }}>{item.subject}</Text>
            </View>
            <View style={{ marginTop: 2 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.primary500 }}>Description</Text>
                <Text style={{ fontSize: 14, color: colors.primary500 }}>{item.description}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.primary500 }}>Created On: {item.createdOn}</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.primary500 }}>Status: {item.status}</Text>
            </View>
        </Pressable>
    }
    return (
        <View style={styles.container}>
            <Text style={{ textAlign: 'center', fontSize: 24, color: colors.primary500, marginBottom: 16 }}>My Tickets</Text>

            <FlatList
                data={tickets}
                renderItem={_renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    )
}

export default MyTickets

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: colors.white
    }
})