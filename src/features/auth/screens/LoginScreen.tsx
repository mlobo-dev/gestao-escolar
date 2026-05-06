import React from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { LogIn } from "lucide-react-native";
import LogoImg from "../../../../assets/images/logo.png";
import { LanguagePicker } from "../../../components/LanguagePicker";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { useThemeContext } from "../../../context/ThemeContext";
import { useTranslation } from "react-i18next";

export const LoginScreen = () => {
  const { signIn, isLoading } = useAuth();
  const { t } = useTranslation();
  const { colorScheme } = useThemeContext();
  const isDark = colorScheme === "dark";

  return (
    <View
      className={`flex-1 bg-background ${isDark ? "dark" : ""} justify-center items-center p-8`}
    >
      <View className="absolute top-12 right-6 flex-row items-center gap-3">
        <ThemeToggle />
        <LanguagePicker />
      </View>

      <View className="mb-4">
        <Image
          source={LogoImg}
          style={{
            width: 280,
            height: 100,
            tintColor: isDark ? "#f8fafc" : "#020617",
          }}
          resizeMode="contain"
        />
      </View>

      <View className="items-center mb-12">
        <Text
          className={`text-center text-sm font-medium tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          {t("login_desc")}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => !isLoading && signIn()}
        disabled={isLoading}
        className={`bg-primary w-64 h-14 rounded-2xl flex-row items-center justify-center shadow-xl shadow-primary/20 ${
          isLoading ? "opacity-50" : ""
        }`}
      >
        <LogIn size={20} color="#020617" />
        <Text className="text-[#020617] font-bold text-lg ml-2">
          {isLoading ? t("loading") : t("enter")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
