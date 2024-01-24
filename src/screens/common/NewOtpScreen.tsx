import { StyleSheet, Text, View, Appearance } from 'react-native'
import React, { useState } from 'react'
import { windowHeight, windowWidth } from '../../utils/dimension';
import colors from '../../constants/colors';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const colorScheme = Appearance.getColorScheme()
const NewOtpScreen = () => {
    // HDFC , OR02BA8022
    const [pin, setPin] = useState<string[]>([]);
    const route = useRoute();
    const navigation = useNavigation<any>();

    const onKeyPress = (key: string) => {
        if (key !== 'back' && key !== 'enter') {
            if (pin.length === 4)
                return;
            setPin([...pin, key])
        }

        if (key === 'back') {
            setPin(pin.slice(0, pin.length - 1))
        }

        if (key === 'enter') {
            const finalPin = pin.reduce((acc, curr) => acc + curr);
            navigation.navigate({
                name: (route.params as any).fromRouteName,
                params: { pin: finalPin },
                merge: true
            })
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.topSection}>
                {(route.params as any)?.purpose && <View style={styles.purpose}>
                    <Text style={styles.purposeText}>{(route.params as any).purpose}</Text>
                </View>}
                <Text style={styles.title}>Please enter your 4-digit wallet PIN</Text>

                <View style={styles.pinContainer}>
                    <View style={[styles.pin, { borderBottomColor: pin.length === 0 ? colors.primary300 : colors.primary100 }]}>{pin.length >= 1 && <MaterialIcon name='circle' size={20} color={colorScheme === 'light' ? colors.primary500 : colors.white} />}</View>
                    <View style={[styles.pin, { borderBottomColor: pin.length === 1 ? colors.primary300 : colors.primary100 }]}>{pin.length >= 2 && <MaterialIcon name='circle' size={20} color={colorScheme === 'light' ? colors.primary500 : colors.white} />}</View>
                    <View style={[styles.pin, { borderBottomColor: pin.length === 2 ? colors.primary300 : colors.primary100 }]}>{pin.length >= 3 && <MaterialIcon name='circle' size={20} color={colorScheme === 'light' ? colors.primary500 : colors.white} />}</View>
                    <View style={[styles.pin, { borderBottomColor: pin.length >= 3 ? colors.primary300 : colors.primary100 }]}>{pin.length == 4 && <MaterialIcon name='circle' size={20} color={colorScheme === 'light' ? colors.primary500 : colors.white} />}</View>
                </View>
            </View>

            <View style={styles.keypad}>
                <Pressable onPress={() => onKeyPress('1')} style={styles.key}><Text style={styles.keyText}>1</Text></Pressable>
                <Pressable onPress={() => onKeyPress('2')} style={styles.key}><Text style={styles.keyText}>2</Text></Pressable>
                <Pressable onPress={() => onKeyPress('3')} style={styles.key}><Text style={styles.keyText}>3</Text></Pressable>
                <Pressable onPress={() => onKeyPress('4')} style={styles.key}><Text style={styles.keyText}>4</Text></Pressable>
                <Pressable onPress={() => onKeyPress('5')} style={styles.key}><Text style={styles.keyText}>5</Text></Pressable>
                <Pressable onPress={() => onKeyPress('6')} style={styles.key}><Text style={styles.keyText}>6</Text></Pressable>
                <Pressable onPress={() => onKeyPress('7')} style={styles.key}><Text style={styles.keyText}>7</Text></Pressable>
                <Pressable onPress={() => onKeyPress('8')} style={styles.key}><Text style={styles.keyText}>8</Text></Pressable>
                <Pressable onPress={() => onKeyPress('9')} style={styles.key}><Text style={styles.keyText}>9</Text></Pressable>
                <Pressable onPress={() => onKeyPress('back')} style={styles.key}><Text><MaterialIcon name='backspace' size={28} color={colorScheme === 'light' ? colors.primary500 : colors.white} /></Text></Pressable>
                <Pressable onPress={() => onKeyPress('0')} style={styles.key}><Text style={styles.keyText}>0</Text></Pressable>
                <Pressable disabled={pin.length != 4} onPress={() => onKeyPress('enter')} style={styles.key}><Text><MaterialIcon name='check-circle-outline' size={28} color={ pin.length === 4 ? (colorScheme === 'light' ? colors.primary500 : colors.white) : colors.primary200} /></Text></Pressable>
            </View>
        </View>
    )
}

export default NewOtpScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colorScheme === 'light' ?  colors.white : colors.primary300
    },
    topSection: {
        flex: 2,
        backgroundColor: colorScheme === 'light' ?  colors.white : colors.black,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        color: colorScheme === 'light' ?  colors.primary500 : colors.white,
        marginBottom: 30
    },
    purpose: {
        width: '90%',
        borderRadius: 8,
        padding: 8,
        marginBottom: 32
    },
    purposeText: {
        color:  colorScheme === 'light' ?  colors.primary500 : colors.white,
        fontSize: 16,
        textAlign: 'center'
    },
    pinContainer: {
        width: '80%',
        marginHorizontal: 'auto',
        height: 50,
        flexDirection: 'row',
        gap: 12,
    },
    pin: {
        flex: 1,
        height: '100%',
        borderBottomWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },

    keypad: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderTopColor: colors.primary100,
        borderTopWidth: 1
    },
    key: {
        // flex: 1,
        width: '33.33%',
        height: (windowHeight / 3) / 4,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: colors.primary100,
        borderWidth: 1
    },
    keyText: {
        fontSize: 28,
        color: colorScheme === 'light' ?  colors.primary500 : colors.white
    },


})