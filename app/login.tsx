import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Text } from "@gluestack-ui/nativewind";
import { useAuth } from "../src/context/AuthContext";
import { LogIn, School as SchoolIcon } from "lucide-react-native";
import { Stack } from "expo-router";

export default function LoginScreen() {
  const { signIn, isLoading } = useAuth();

  return (
    <View className="flex-1 bg-background justify-center items-center p-8">
      <Stack.Screen options={{ headerShown: false }} />
      
      <View className="w-24 h-24 bg-primary rounded-[32px] items-center justify-center shadow-2xl shadow-primary/40 mb-8">
        <SchoolIcon size={48} color="#0f172a" />
      </View>

      <Text className="text-white text-4xl font-bold tracking-tight text-center">
        Gestão Escolar
      </Text>
      <Text className="text-white/40 text-lg text-center mt-2 mb-12">
        Plataforma administrativa para unidades de ensino
      </Text>

      <TouchableOpacity
        onPress={signIn}
        disabled={isLoading}
        className="bg-primary w-full h-16 rounded-[24px] flex-row items-center justify-center shadow-xl shadow-primary/20"
      >
        <LogIn size={24} color="#0f172a" />
        <Text className="text-[#0f172a] font-bold text-xl ml-3">
          Entrar com Keycloak
        </Text>
      </TouchableOpacity>

      <Text className="text-white/20 text-xs mt-12 uppercase tracking-widest font-bold">
        Facilita Labs • v1.0.0
      </Text>
    </View>
  );
}
