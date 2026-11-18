import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 54;
const STROKE_WIDTH = 4;
const INNER_SIZER = 34;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Props = {
  progress: number; // 0 → 1
  onPress: () => void;
};

const NextProgressButton = ({ progress, onPress }: Props) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 1,],
    outputRange: [CIRCUMFERENCE, 0],
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Svg width={SIZE} height={SIZE}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke="#c0bbbb"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
    <AnimatedCircle
      cx={SIZE / 2}
      cy={SIZE / 2}
      r={RADIUS}
      stroke="#D63A3A"
      strokeWidth={STROKE_WIDTH}
      fill="none"
      strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
      strokeDashoffset={strokeDashoffset}
      strokeLinecap="round"
    />
  </Svg>
  <Animated.View style={styles.centerButton}>
    <Animated.Text style={styles.arrow}>{'>'}</Animated.Text>
  </Animated.View>
</TouchableOpacity>

  );
};

const styles = StyleSheet.create({
  centerButton: {
    position: 'absolute',
    width: INNER_SIZER,
    height: INNER_SIZER,
    borderRadius: INNER_SIZER / 2,
    backgroundColor: '#D63A3A',
    alignItems: 'center',
    justifyContent: 'center',
    top: INNER_SIZER / 2,
    left: INNER_SIZER / 2,
  },
  arrow: {
    color: '#fff',
    fontSize: 16,
    marginLeft:1,
    fontWeight: '700',
  },
});

export default NextProgressButton;