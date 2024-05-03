import { StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native'
import React, { useState } from 'react'
import colors from '../constants/colors';

const DocumentImage = ({ imageUrl }: any) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!imageUrl) {
        return <View style={{ position: 'absolute' }}>
            <Text style={styles.imageLoadingText}>No Image Found</Text>
        </View>
    }

    // console.log('In Document image URL ' + imageUrl)

    return (<>
        {/* If ImageUrl is there and error is there show error message with image */}
        {imageUrl && error && <View style={{ position: 'absolute' }}>
            <Text style={styles.imageLoadingText}>Error Loading Image</Text>
        </View>}

        {/* If ImageUrl is there and loading is there show loading and image */}
        {imageUrl && loading && <View style={{ position: 'absolute' }}>
            {/* <ActivityIndicator size={40} color={colors.primary100} /> */}
            <Text style={styles.imageLoadingText}>Image Loading</Text>
        </View>}
        <Image source={
            {
                uri: `https://api.esebakendra.com/api/User/Download?fileName=${imageUrl}`,
            }}
            style={[{ height: '100%', width: '100%', resizeMode: 'contain' }]}
            onLoadStart={() => { setLoading(true); setError(false) }}
            onLoadEnd={() => { setError(false); setLoading(false); }}
            onError={() => { console.log('Error'); setError(true); setLoading(false); }} />
    </>

    )
}

export default DocumentImage

const styles = StyleSheet.create({
    imageLoadingText: {
        fontSize: 14,
        color: colors.primary100
    }
})