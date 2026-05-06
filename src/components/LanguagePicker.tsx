import React from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "@gluestack-ui/nativewind";
import { useTranslation } from "react-i18next";
import {
  withSpring,
  withSequence,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";

export const LanguagePicker = () => {
  const { i18n } = useTranslation();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const changeLanguage = (lng: string) => {
    if (i18n.language === lng) return;

    // Animation trigger
    scale.value = withSequence(withSpring(1.2), withSpring(1));

    opacity.value = withTiming(0.5, { duration: 100 }, () => {
      opacity.value = withTiming(1, { duration: 200 });
    });

    i18n.changeLanguage(lng);
  };

  return (
    <TouchableOpacity
      onPress={() => changeLanguage(i18n.language === "pt" ? "en" : "pt")}
      activeOpacity={0.7}
      className="w-10 h-10 bg-white/10 border border-white/10 rounded-xl items-center justify-center active:bg-white/20"
    >
      <Text className="text-2xl">{i18n.language === "pt" ? "🇧🇷" : "🇺🇸"}</Text>
    </TouchableOpacity>
  );
};
