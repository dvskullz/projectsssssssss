import { duration } from "moment";
import React,{useEffect,useRef} from "react";
import {View,Animated, StyleSheet} from 'react-native';

const TypingIndicator =() =>{
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;
    const dot4 = useRef(new Animated.Value(0)).current;
    
    const animate = (dot:Animated.Value, delay: number) =>{
        Animated.loop(
            Animated.sequence([
                Animated.timing(dot,{
                    toValue : -4.5,
                    duration:300,
                    delay,
                    useNativeDriver:true
                }),
                Animated.timing(dot,{
                    toValue:0,
                    duration:300,
                    useNativeDriver:true
                })
            ])
        ).start();
    };
    useEffect(()=>{
        animate(dot1,0);
        animate(dot2,150);
        animate(dot3, 300);
        animate(dot4,600);
    },[]);

    return(
        <View style={style.container}>
            <Animated.View style={[style.dot,{transform:[{translateY : dot1}]}]}/>
            <Animated.View style={[style.dot,{transform:[{translateY : dot2}]}]}/>
            <Animated.View style={[style.dot,{transform:[{translateY : dot3}]}]}/>
            <Animated.View style={[style.dot,{transform:[{translateY : dot4}]}]}/>


        </View>
    )
}
export default TypingIndicator;

const style=StyleSheet.create({
    container:{
        backgroundColor:'#ffffff',
        // paddingVertical:10,
        // paddingHorizontal:1,
        borderRadius:18,
        alignSelf:'center',
        justifyContent:'center',
        // marginLeft:10,
        marginTop:350,
        // flex:1,
        flexDirection:'row',
    },
    dot:{
        width:6,
        height:6,
        borderRadius:3,
        marginHorizontal:3,
        backgroundColor:'#dc143c'
    }
})


// import React, { useEffect, useRef } from 'react';
// import {View,Animated,Stylesheet} from "react-native";

// const TypingIndicator =()=>{
//     const dot1Opacity = useRef(new Animated.Value(0)).current;
//     const dot2Opacity = useRef(new Animated.Value(0)).current;
//     const dot3Opacity = useRef(new Animated.Value(0)).current;

//     useEffect(()=>{
//         const animateDot = (dot, delay) =>{
//             Animated.loop(
//                 Animated.sequence([
//                     Animated.timing(dot,{
//                         toValue:1,
//                         duration:300,
//                         useNativeDriver:true,
//                     }),
//                     Animated.timing(dot,{
//                         toValue:0,
//                         duration:300,
//                         useNativeDriver:true
//                     }),
//                 ]),
//                 {iterations: -1, delay},
//             ).start();
//         };
//         animateDot(dot1Opacity,10);
//         animateDot(dot2Opacity,800);
//         animateDot(dot3Opacity,2100);
//     },[dot1Opacity,dot2Opacity,dot3Opacity]);

//     return(
//         <View style={style.container}>
//             <Animated.View style={style.dot} />
//             <Animated.View  style={style.dot}/>
//             <Animated.View style={style.dot} />

//         </View>
//     )

// };

// const style=Stylesheet.create({
//     container:{
//         flexDirection:'row',
//         justifyContent:'center',
//         alignItems:'center',
//         height:20,
//         marginVertical:5,
//         borderRadius:8,
//         padding:5,
//     },
//     dot:{
//         width:6,
//         height:6,
//         borderRadius:3,
//         backgroundColor:'#d2d2d2',
//         marginVertical:3
//     },
// });

// export default TypingIndicator;
