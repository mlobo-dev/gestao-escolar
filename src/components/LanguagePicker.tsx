import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useTranslation } from "react-i18next";
import Animated, {
  withSpring,
  withSequence,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

export const LanguagePicker = ({ testID }: { testID?: string }) => {
  const { i18n } = useTranslation();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const changeLanguage = (lng: string) => {
    if (i18n.language === lng) return;

    // Animation trigger
    scale.value = withSequence(withSpring(1.2), withSpring(1));

    opacity.value = withTiming(0, { duration: 150 }, () => {
      opacity.value = withTiming(1, { duration: 150 });
    });

    i18n.changeLanguage(lng);
  };

  return (
    <TouchableOpacity
      testID={testID}
      onPress={() => changeLanguage(i18n.language === "pt" ? "en" : "pt")}
      activeOpacity={0.7}
    >
      <Animated.View
        style={animatedStyle}
        className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl items-center justify-center backdrop-blur-md"
      >
        <Text style={{ fontSize: 24 }}>{i18n.language === "pt" ? "🇧🇷" : "🇺🇸"}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};
