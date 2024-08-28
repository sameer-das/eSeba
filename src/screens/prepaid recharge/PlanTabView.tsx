import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import MobilePlanCard from '../../components/MobilePlanCard';
import colors from '../../constants/colors';


const TabPanel = ({ plan, handlePress }: any) => {
    return (<ScrollView style={{ flex: 1 }} scrollEnabled showsVerticalScrollIndicator={false} >
        {plan?.plans.map((curr: any) => {
            return <View key={curr.planName + curr.amount + curr.validity}>
                <MobilePlanCard item={curr} handlePress={handlePress} />
            </View>
        })}
    </ScrollView>)
}



const PlanTabView = ({ plans, handlePress }: any) => {

    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);
    const [routes, setRoute] = React.useState([]);

    // Set the route at initial load, dont rerun it on swipe
    useEffect(() => {
        // console.log('Plans changed')
        const routes = plans?.map((curr: any) => {
            return { key: curr.planName, title: curr.planName }
        });
        setRoute(routes);
    }, [plans]);


    const renderScene = ({ route, jumpTo }: any) => {
        const currentplans = plans?.filter((curr: any) => curr.planName === route.key);
        return <TabPanel plan={currentplans[0]} handlePress={handlePress} />
    };

    const renderTabBar = (props: any) => {
        return <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: colors.white, height: 4 }}
            style={{ backgroundColor: colors.primary500 }}
            scrollEnabled={true}
            tabStyle={{ width: 150 }}
            activeColor={colors.white}
            inactiveColor={colors.primary100}
            getLabelText={({ route }) => route.title}
            renderLabel={({ route, focused, color }) => (
                <Text style={{ color, fontSize: 14 }}>
                    {route.title}
                </Text>
            )}
        />
    }

    return (
        <TabView
            renderTabBar={renderTabBar}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            style={{ borderRadius: 8, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        />
    );
}

export default PlanTabView

const styles = StyleSheet.create({
    rootContainer: { flex: 1 },
})