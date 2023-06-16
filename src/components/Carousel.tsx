import Carousel from 'react-native-snap-carousel';

import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react';



const CarouselComponent = () => {
    const width = Dimensions.get('screen').width;
    const data = [{
        title: 'sameer',
        id: '1'
    },
    {
        title: 'sameer',
        id: '2'
    },
    {
        title: 'sameer',
        id: '3'
    },
    {
        title: 'sameer',
        id: '4'
    }]
    const _renderItem = ({item, index}) => {
        // console.log(`car ${item} , ${index}`)
        return (
            <View style={{borderColor: 'red', borderWidth: 2, height: 100}}>
                <Text style={{}}>{JSON.stringify(item)}</Text>
            </View>
        );
    }
    return (
        <Carousel
          ref={(c) => {  }}
          data={data}
          renderItem={_renderItem}
          sliderWidth={width - 40}
          itemWidth={width - 40}
          loop={true}
        />
    );
}

export default CarouselComponent

const styles = StyleSheet.create({})
 