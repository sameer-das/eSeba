import React, { useEffect, useRef, useState } from 'react';
import { FlatList, ImageBackground, Animated, Image, Linking, Pressable, StyleSheet, Text, View, ActivityIndicator, Button } from 'react-native';
import colors from '../constants/colors';
import { windowWidth } from '../utils/dimension';
import { getCarouselData } from '../API/services';




const CarouselComponent = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [carouselData, setCarouselData] = useState([]);
    const [startAutoScroll, setStartAutoScroll] = useState(false);


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
        // console.log(currentIndex)
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
            console.log('carousel data fetched, length ' + data.data.length)
            setCarouselData(data.data);
            setStartAutoScroll(true);
        } else {
            setCarouselData([]);
        }
    }


    useEffect(() => {
        console.log('Inside carousel fetcing data')
        fetchCarouselFromDB();
    }, [])


    // For Auto Scroll ---- START
    let timer: number;
    const autoScroll = () => {
        timer = setInterval(() => {
            if (currentIndex === data.length - 1) {
                setCurrentIndex(0);
                flatListRef?.current?.scrollToIndex({ animated: true, index: 0 })
            } else {
                setCurrentIndex(x => x + 1)
                if (currentIndex < data.length)
                    flatListRef?.current?.scrollToIndex({ animated: true, index: +currentIndex + 1 })
            }
        }, CAROUSEL_DURATION)
    }

    useEffect(() => {
        autoScroll();
        return () => clearInterval(timer)
    }, [currentIndex])
    // For Auto Scroll ---- END


    if (carouselData.length === 0) {
        return <View style={{ height: '100%', backgroundColor: colors.primary500, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={30} color={colors.white} />
            <Text style={{ color: colors.white, fontSize: 14 }}>Fetching Latest Deals</Text>
        </View>
    }

    return (
        <>
            <Animated.FlatList
                data={carouselData}
                ref={flatListRef}
                renderItem={_renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                keyExtractor={(item: any) => item.id}
                onScroll={handleScroll}
                initialScrollIndex={0}
            // getItemLayout={(curr, index) => {
            //     return { length: windowWidth, offset: (windowWidth) * index, index }
            // }}

            />
            {/* Indicator */}
            <Animated.View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: windowWidth, marginTop: 6 }}>
                {data.map((curr, index) => {
                    return <View key={index} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: index === currentIndex ? colors.primary500 : colors.grey, marginHorizontal: 4 }}></View>
                })}
            </Animated.View>
        </>
    );
}

export default CarouselComponent

const styles = StyleSheet.create({})
