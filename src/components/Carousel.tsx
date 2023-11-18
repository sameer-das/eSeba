import React, { useEffect, useRef, useState } from 'react';
import { FlatList, ImageBackground, Image, Linking, Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import colors from '../constants/colors';
import { windowWidth } from '../utils/dimension';
import { getCarouselData } from '../API/services';



const CarouselComponent = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [carouselData, setCarouselData] = useState([]);

    const CAROUSEL_DURATION = 3000;
    const data = [{
        title: 'carousel1',
        id: '1',
        bg: 'red',
        image: require('../../assets/carousel/car1.jpg')
    },
    {
        title: 'carousel2',
        id: '2',
        bg: 'yellow',
        image: require('../../assets/carousel/car2.jpg')
    },
    {
        title: 'carousel3',
        id: '3',
        bg: 'green',
        image: require('../../assets/carousel/car3.jpg')
    }];
    const handleScroll = ((event: any) => {
        const horizontalPosition = event.nativeEvent.contentOffset.x;
        setCurrentIndex(+(horizontalPosition / windowWidth).toFixed(0));
    })

    const openWebsite = () => {
        Linking.openURL('https://esebakendra.com/esk/login')
    }
    // const _renderItem = ({ item, index }: any) => {
    //     return (
    //         <Pressable onPress={openWebsite} style={[{ height: '100%', width: windowWidth - 16, alignItems: 'center', borderRadius: 8, overflow: 'hidden' }]}>
    //             <Image source={item.image} style={{ width: windowWidth - 16, height: '100%', resizeMode: 'cover' }} />
    //         </Pressable>
    //     );
    // }
    const _renderItem = ({ item, index }: any) => {
        const imageURI = item.file_content;
        return (
            <Pressable onPress={openWebsite} style={[{ height: '100%', width: windowWidth - 16, alignItems: 'center', borderRadius: 8, overflow: 'hidden' }]}>
                <Image source={{ uri: imageURI }} style={{ width: windowWidth - 16, height: '100%', resizeMode: 'cover' }} />
            </Pressable>
        );
    }


    const flatListRef = useRef<any>();

    const fetchCarouselFromDB = async () => {
        const { data } = await getCarouselData();
        // console.log(data)
        if (data.code === 200 && data.status === 'Success') {
            console.log(data.data.length)
            setCarouselData(data.data)
        } else {
            setCarouselData([]);
        }
    }

    useEffect(() => {
        console.log('Inside carousel fetcing data')
        fetchCarouselFromDB()
    }, [])

    useEffect(() => {
        // const t = setTimeout(() => {
        //     console.log(currentIndex);
        //     if (currentIndex === data.length - 1) {
        //         flatListRef.current.scrollToIndex({ index: 0, animation: true })
        //     } else {
        //         flatListRef.current.scrollToIndex({ index: currentIndex + 1, animation: true })
        //     }
        // }, CAROUSEL_DURATION);

        // return () => clearTimeout(t);

    }, []);

    if (carouselData.length === 0) {
        return <View style={{ height: 160, backgroundColor: colors.primary500, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={30} color={colors.white} />
            <Text style={{ color: colors.white, fontSize: 14 }}>Fetching Latest Deals</Text>
        </View>
    }

    return (
        <>
            <FlatList
                data={carouselData}
                ref={flatListRef}
                renderItem={_renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                keyExtractor={(item: any) => item.id}
                onScroll={handleScroll}
            // getItemLayout={(curr, index) => {
            //     return { length: windowWidth, offset: (windowWidth) * index, index }
            // }}
            />
            {/* Indicator */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: windowWidth, marginTop: 6 }}>
                {data.map((curr, index) => {
                    return <View key={index} style={{ width: index === currentIndex ? 20 : 8, height: 8, borderRadius: 4, backgroundColor: colors.grey, marginHorizontal: 4 }}></View>
                })}
            </View>
        </>
    );
}

export default CarouselComponent

const styles = StyleSheet.create({})
