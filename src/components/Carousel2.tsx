import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Carousel from "react-native-reanimated-carousel";
import { Dimensions } from 'react-native';
import type { ICarouselInstance } from "react-native-reanimated-carousel";
const windowWidth = Dimensions.get('window').width;
const baseOptions = {
    vertical: false,
    width: windowWidth,
    height: windowWidth / 2,
}

const Carousel2 = () => {
    const ref = React.useRef<ICarouselInstance>(null);
    // const [data, setData] = React.useState([...new Array(4).keys()]);
    const openWebsite = () => {
        Linking.openURL('https://esebakendra.com/esk/login')
    }

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

    return (
        <View>
            <Carousel
                {...baseOptions}
                loop
                ref={ref}   
                style={{ width: "100%" }}
                autoPlay={true}
                autoPlayInterval={1000}
                data={data}
                pagingEnabled={true}
                // onSnapToItem={index => console.log("current index:", index)}
                renderItem={({ item, index }) => {
                    return <View style={{ height: 160 }}>
                        <Pressable onPress={openWebsite} style={[{ height: '100%', width: windowWidth - 16, alignItems: 'center', borderRadius: 8, overflow: 'hidden' }]}>
                            <Image source={item.image} style={{ width: windowWidth - 16, height: '100%', resizeMode: 'cover' }} />
                        </Pressable>
                    </View>
                }}
            />
        </View>
    )
}

export default Carousel2

const styles = StyleSheet.create({})