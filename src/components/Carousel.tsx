import React, { useEffect, useRef, useState } from 'react';
import { FlatList, ImageBackground, Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../constants/colors';
import { windowWidth } from '../utils/dimension';



const CarouselComponent = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const CAROUSEL_DURATION = 3000;
    const data = [{
        title: 'carousel1',
        id: '1',
        bg: 'red',
        image: require('../../assets/carousel/carousel1.jpg')
    },
    {
        title: 'carousel2',
        id: '2',
        bg: 'yellow',
        image: require('../../assets/carousel/carousel2.jpg')
    },
    {
        title: 'carousel3',
        id: '3',
        bg: 'green',
        image: require('../../assets/carousel/carousel3.jpg')
    }];
    const handleScroll = ((event: any) => {
        const horizontalPosition = event.nativeEvent.contentOffset.x;
        setCurrentIndex(+(horizontalPosition / windowWidth).toFixed(0));
    })

    const openWebsite = () => {
        Linking.openURL('https://esebakendra.com/esk/login')
    }
    const _renderItem = ({ item, index }: any) => {
        return (
            <Pressable onPress={openWebsite} style={[{ height: '100%', width: windowWidth - 16, alignItems: 'center' }]}>
                <Image source={item.image} style={{ width: windowWidth - 16, height: '100%', resizeMode: 'cover'}} />
            </Pressable>
        );
    }


    const flatListRef = useRef<any>();

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
                    return <View key={index} style={{ width: index === currentIndex ? 20 : 8, height: 8, borderRadius: 4, backgroundColor: colors.grey, marginHorizontal: 4 }}></View>
                })}
            </View>
        </>
    );
}

export default CarouselComponent

const styles = StyleSheet.create({})
