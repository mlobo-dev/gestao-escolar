import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Text } from "@gluestack-ui/nativewind";
import { useAuth } from "../src/context/AuthContext";
import { LogIn, School as SchoolIcon } from "lucide-react-native";
import { Stack } from "expo-router";
import LogoImg from "../assets/images/logo.png";
import { LanguagePicker } from "../src/components/LanguagePicker";
import { useTranslation } from "react-i18next";


function LoginScreen() {

  const { signIn, isLoading } = useAuth();
  const { t } = useTranslation();


  return (
    <View className="flex-1 bg-background justify-center items-center p-8">
      <Stack.Screen options={{ headerShown: false }} />
      
      <View className="absolute top-12 right-6">
        <LanguagePicker />
      </View>

      
      <View className="mb-4">
        <Image 
          source={LogoImg} 
          style={{ width: 280, height: 100, tintColor: "#f8fafc" }}
          resizeMode="contain"
        />
      </View>


      <View className="items-center mb-12">
        <Text className="text-muted-foreground text-center text-sm font-medium tracking-wide">
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
}

export default LoginScreen;
