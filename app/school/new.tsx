import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useSchoolStore } from "../../src/store/useSchoolStore";
import { Text } from "@gluestack-ui/nativewind";
import { ChevronLeft, Save } from "lucide-react-native";

export default function NewSchoolScreen() {
  const router = useRouter();
  const { addSchool } = useSchoolStore();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!name || !address) return;
    setIsSubmitting(true);
    await addSchool({ name, address });
    setIsSubmitting(false);
    router.back();
  };

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: "Nova Unidade",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
              className="mr-4"
            >
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: "#0f172a" },
          headerTintColor: "#fff",
          headerShadowVisible: false,
        }}
      />
      <ScrollView className="flex-1">
        <View className="items-center p-8">
          <View className="w-full max-w-2xl">
            <View className="mb-8">
              <Text className="text-white/40 text-xs font-bold uppercase tracking-[2px] mb-3 ml-1">
                Nome da Escola
              </Text>
              <TextInput
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-lg text-white"
                placeholder="Ex: Escola Municipal Central"
                placeholderTextColor="rgba(255,255,255,0.2)"
                value={name}
                onChangeText={setName}
              />
              {!name && (
                <Text className="text-destructive text-[10px] mt-2 ml-1 font-bold uppercase tracking-wider">
                  O nome é obrigatório
                </Text>
              )}
            </View>

            <View className="mb-10">
              <Text className="text-white/40 text-xs font-bold uppercase tracking-[2px] mb-3 ml-1">
                Endereço Completo
              </Text>
              <TextInput
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-lg text-white min-h-[120px]"
                placeholder="Rua, Número, Bairro..."
                placeholderTextColor="rgba(255,255,255,0.2)"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={address}
                onChangeText={setAddress}
              />
              {!address && (
                <Text className="text-destructive text-[10px] mt-2 ml-1 font-bold uppercase tracking-wider">
                  O endereço é obrigatório
                </Text>
              )}
            </View>

            <TouchableOpacity
              className={`bg-primary p-5 rounded-[24px] flex-row items-center justify-center shadow-xl shadow-primary/20 ${
                (!name || !address || isSubmitting) && "opacity-40"
              }`}
              onPress={handleSave}
              disabled={!name || !address || isSubmitting}
            >
              <Save size={22} color="#0f172a" />
              <Text className="text-[#0f172a] font-bold text-xl ml-3">
                {isSubmitting ? "Salvando..." : "Salvar Escola"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>

  );
}
