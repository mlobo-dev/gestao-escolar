import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "@gluestack-ui/nativewind";
import { useTranslation } from "react-i18next";
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withSequence, 
  withTiming,
  useSharedValue 
} from "react-native-reanimated";

export const LanguagePicker = () => {
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
    scale.value = withSequence(
      withSpring(1.2),
      withSpring(1)
    );
    
    opacity.value = withTiming(0.5, { duration: 100 }, () => {
      opacity.value = withTiming(1, { duration: 200 });
    });

    i18n.changeLanguage(lng);
  };

  return (
    <View className="flex-row items-center bg-white/5 border border-white/10 rounded-full px-2 py-1">
      <TouchableOpacity
        onPress={() => changeLanguage("pt")}
        className={`w-10 h-10 items-center justify-center rounded-full ${
          i18n.language === "pt" ? "bg-primary" : "bg-transparent"
        }`}
      >
        <Text className="text-xl">🇧🇷</Text>
      </TouchableOpacity>
      
      <View className="w-[1px] h-4 bg-white/10 mx-1" />

      <TouchableOpacity
        onPress={() => changeLanguage("en")}
        className={`w-10 h-10 items-center justify-center rounded-full ${
          i18n.language === "en" ? "bg-primary" : "bg-transparent"
        }`}
      >
        <Text className="text-xl">🇺🇸</Text>
      </TouchableOpacity>
    </View>
  );
};
