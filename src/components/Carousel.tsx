import { StyleSheet, Text, View, Dimensions, FlatList, Image, ImageBackground } from 'react-native'
import React, { useState, useRef, useEffect } from 'react';
import colors from '../constants/colors';
import { windowWidth } from '../utils/dimension';



const CarouselComponent = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const CAROUSEL_DURATION = 3000;
    const data = [{
        title: 'sameer',
        id: '1',
        bg: 'red',
        image: require('../../assets/carousel/carousel1.png')
    },
    {
        title: 'sameer',
        id: '2',
        bg: 'yellow',
        image: require('../../assets/carousel/carousel2.png')
    },
    {
        title: 'sameer',
        id: '3',
        bg: 'green',
        image: require('../../assets/carousel/carousel3.png')
    },
    {
        title: 'sameer',
        id: '4',
        bg: 'cyan',
        image: require('../../assets/carousel/carousel1.png')
    }];
    const handleScroll = ((event: any) => {
        const horizontalPosition = event.nativeEvent.contentOffset.x;
        setCurrentIndex(+(horizontalPosition / windowWidth).toFixed(0));
        console.log(+(horizontalPosition / windowWidth).toFixed(0))

    })
    const _renderItem = ({ item, index }: any) => {
        return (
            <View style={[{ height: '100%', width: windowWidth - 16 }]}>
                <ImageBackground source={item.image} style={{ width: windowWidth - 16, height: '100%', padding: 4, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: colors.white, fontSize: 18 }}>
                        Advertise {index + 1}
                    </Text>
                </ImageBackground>
            </View>
        );
    }


    const flatListRef = useRef<any>();

    useEffect(() => {
        // setTimeout(() => {
        //     if (currentIndex === data.length - 1) {
        //         flatListRef.current.scrollToIndex({ index: 0, animation: true })
        //     } else {
        //         flatListRef.current.scrollToIndex({ index: currentIndex + 1, animation: true })
        //     }
        // }, CAROUSEL_DURATION)

    })
    return (
        <>
            <FlatList
                data={data}
                ref={flatListRef}
                renderItem={_renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                keyExtractor={(item) => item.id}
                onScroll={handleScroll}
            // getItemLayout={(curr, index) => {
            //     return { length: windowWidth, offset: (windowWidth) * index, index }
            // }}
            />
            {/* Indicator */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: windowWidth, marginTop: 6 }}>
                {data.map((curr, index) => {
                    return <View style={{ width: index === currentIndex ? 20 : 8, height: 8, borderRadius: 4, backgroundColor: colors.grey, marginHorizontal: 4 }}></View>
                })}
            </View>
        </>
    );
}

export default CarouselComponent

const styles = StyleSheet.create({})
