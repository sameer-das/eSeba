import React, { useEffect, useState, useRef } from "react";
import {
    View,
    StyleSheet,
    TextInput,
    Text,
    Animated,
    Pressable,
} from "react-native";
import colors from "../constants/colors";

const AnimatedInput = ({ value, onChangeText, errorMessage, inputLabel, style, ...props }: any) => {

    const moveText = useRef(new Animated.Value(0)).current;
    const inputRef = useRef<any>();

    useEffect(() => {
        if (value !== "") {
            moveTextTop();
        } else if (value === "") {
            // moveTextBottom();
        }
    }, [value])

    const onFocusHandler = () => {
        if (value === "") {
            moveTextTop();
        }
    };

    const onBlurHandler = () => {
        if (value === "") {
            moveTextBottom();
        }
    };

    const moveTextTop = () => {
        Animated.timing(moveText, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
        }).start();
    };

    const moveTextBottom = () => {
        Animated.timing(moveText, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start();
    };

    const yVal = moveText.interpolate({
        inputRange: [0, 1],
        outputRange: [12, -16],
    });
    const xVal = moveText.interpolate({
        inputRange: [0, 1],
        outputRange: [6, 4],
    });
    const opacity = moveText.interpolate({
        inputRange: [0, 1],
        outputRange: [0.5, 1],
    });

    const animStyle = {
        transform: [
            {
                translateY: yVal,
            },
            {
                translateX: xVal,
            },
        ],
    };


    return (
        <View style={styles.container}>
            <Animated.View style={[styles.animatedStyle, animStyle]}>
                <Pressable onPress={() => { onFocusHandler(); inputRef?.current?.focus(); }}>
                    <Animated.Text style={[styles.label]}>{inputLabel || 'Enter Value'}</Animated.Text>
                </Pressable>
            </Animated.View>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                ref={inputRef}
                style={[styles.input, style]}
                onFocus={onFocusHandler}
                onBlur={onBlurHandler}
                {...props}
            />
            <Text style={styles.textInputErrorLabel}>{errorMessage}</Text>
        </View>
    );
};
export default AnimatedInput;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginTop: 30
    },
    icon: {
        width: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: colors.grey,
        paddingVertical: 8,
        fontSize: 16,
        color: colors.primary500,
        width: '100%',
    },
    label: {
        color: colors.grey,
        fontSize: 16,
        fontWeight: 'bold',
    },
    animatedStyle: {
        position: 'absolute',
        borderRadius: 90,
        zIndex: 1,
    },
    textInputErrorLabel: {
        fontSize: 14,
        color: colors.secondary500,
        fontWeight: 'bold'
    },
});