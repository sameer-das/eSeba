import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { getNotifications } from '../../API/services';

const Notification = () => {

    const [refreshing, setRefreshing] = useState(false);

    const [notifications, setNotifications] = useState([]);

    const navigation = useNavigation<any>();



    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            console.log('on focus notifications');
            const x = async () => {
                try {
                    const { data } = await getNotifications();
                    // console.log(data);
                    if (data.code === 200) setNotifications(data.data);
                } catch (e) {
                    console.log('Notification error ', e)
                }
            }
            x();
        });

        return unsubscribe;
    }, []);

    const onPullRefresh = async () => {

        try {
            console.log('On refresh')
            setRefreshing(true);
            const { data } = await getNotifications();
            // console.log(data);
            if (data.code === 200) setNotifications(data.data);
        } catch (e) {
            console.log('Notification error ', e)
        } finally {
            setRefreshing(false);
        }

    }
    return (
        <View style={styles.container}>
            {notifications.length > 0 ? <FlatList data={notifications}
                onRefresh={onPullRefresh}
                refreshing={refreshing}
                progressViewOffset={0}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item }: any) => {
                    return (<View style={{ borderBottomColor: colors.grey, borderBottomWidth: 0.2, paddingVertical: 8 }}>
                        <Text style={{
                            color: colors.primary500, fontSize: 16
                        }}>{item.notificationTxt}</Text>
                    </View>)

                }} /> : <View>
                    <Text style={{
                            color: colors.primary500, fontSize: 16, textAlign:'center',
                            marginTop: 16
                        }}>No new notifications found</Text>
            </View>}
        </View>
    )
}

export default Notification

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8
    }
})