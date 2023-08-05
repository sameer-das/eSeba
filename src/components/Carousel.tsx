import Carousel from 'react-native-snap-carousel';

import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react';
import colors from '../constants/colors';



const CarouselComponent = () => {
    const width = Dimensions.get('screen').width;
    const data = [{
        title: 'sameer',
        id: '1',
        bg:'red'
    },
    {
        title: 'sameer',
        id: '2',
        bg:'yellow'
    },
    {
        title: 'sameer',
        id: '3',
        bg:'green'
    },
    {
        title: 'sameer',
        id: '4',
        bg:'cyan'
    }]
    const _renderItem = ({item, index}: any) => {
        // console.log(`car ${item} , ${index}`)
        return (
            <View style={[{borderColor: colors.primary100, borderWidth: 2, borderRadius:10, height: '100%'}, {backgroundColor: item.bg}]}>
                <Text style={{color: colors.black}}>{JSON.stringify(item)}</Text>
            </View>
        );
    }
    return (
        <Carousel
          ref={(c) => {  }}
          data={data}
          renderItem={_renderItem}
          sliderWidth={width -16}
          itemWidth={width - 16}
          loop={true}
          snapToAlignment='center'
        />
    );
}

export default CarouselComponent

const styles = StyleSheet.create({})
 