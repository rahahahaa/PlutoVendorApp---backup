import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Easing } from "react-native";
import { colors } from "../styles/theme";

const SIZE = 40;
const DOT_SIZE = SIZE * 0.25;
const ANIMATION_DURATION = 1000;

export default function LoaderMomentum() {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const wobbleLeftAnim = useRef(new Animated.Value(0)).current;
  const wobbleRightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(wobbleLeftAnim, {
          toValue: 1,
          duration: ANIMATION_DURATION * 1.25,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wobbleLeftAnim, {
          toValue: 0,
          duration: ANIMATION_DURATION * 1.25,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(wobbleRightAnim, {
          toValue: 0,
          duration: ANIMATION_DURATION * 1.25,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(wobbleRightAnim, {
          toValue: 1,
          duration: ANIMATION_DURATION * 1.25,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [rotateAnim, wobbleLeftAnim, wobbleRightAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const translateXLeft = wobbleLeftAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -SIZE * 0.2, 0],
  });

  const scaleLeft = wobbleLeftAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1],
  });

  const translateXRight = wobbleRightAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, SIZE * 0.2, 0],
  });

  const scaleRight = wobbleRightAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1],
  });

  return (
    <Animated.View style={[styles.container, { width: SIZE, height: SIZE, transform: [{ rotate }] }]}>
      <Animated.View
        style={[
          styles.dot,
          {
            marginRight: SIZE * 0.1,
            width: DOT_SIZE,
            height: DOT_SIZE,
            backgroundColor: colors.primary,
            borderRadius: DOT_SIZE / 2,
            transform: [{ translateX: translateXLeft }, { scale: scaleLeft }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            width: DOT_SIZE,
            height: DOT_SIZE,
            backgroundColor: colors.primary,
            borderRadius: DOT_SIZE / 2,
            transform: [{ translateX: translateXRight }, { scale: scaleRight }],
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {},
});
