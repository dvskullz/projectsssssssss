import React, { useState, useEffect } from "react";
import { Pressable,Text,View,Animated,StyleSheet, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";


const Switch =({props}:any)=>{
    const{value,onValueChange} = props;
    const [animatedValue] = useState(new Animated.Value(value?1:0));

    const defaultStyles = {
	bgGradientColors: ['#C4C4C4', '#c4c4c4'],
	headGradientColors: ['#fff', '#fff'],
};

const activeStyles = {
	bgGradientColors: ['#dc143c', '#dc143c'],
	headGradientColors: ['#fff', '#fff'],
};

    useEffect (()=>{
        Animated.timing(animatedValue,{
            toValue:value?1:0,
            duration:300,
            useNativeDriver:false,
        }).start();
    },[value]);


    const translateX = animatedValue.interpolate({
        inputRange:[0,1],
        outputRange:[2,22],
    });

    const toggleSwitch=()=>{
        const newValue = !value;
        onValueChange(newValue);
    };

    const currentStyles = value ? activeStyles : defaultStyles;

    return(
        <View>
           <TouchableOpacity onPress={toggleSwitch} style={styles.pressable}>
      <LinearGradient
        colors={currentStyles.bgGradientColors}
        style={styles.backgroundGradient}
        start={{
          x: 0,
          y: 0.5,
        }}>
        <View style={styles.innerContainer}>
          <Animated.View
            style={{
              transform: [{ translateX }],
            }}>
            <LinearGradient
              colors={currentStyles.headGradientColors}
              style={styles.headGradient}
            />
          </Animated.View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
        </View>
    )
};
const styles = StyleSheet.create({
 pressable: {
   width: 43,
   height: 24,
   borderRadius: 16,
 },
 backgroundGradient: {
   borderRadius: 16,
   flex: 1,
 },
 innerContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   flex: 1,
   position: 'relative',
 },
 headGradient: {
   width: 18.11,
   height: 19.2,
   borderRadius: 100,
 },
});

export default Switch;