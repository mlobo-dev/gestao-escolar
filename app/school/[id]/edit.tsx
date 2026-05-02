import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { useSchoolStore } from "../../../src/store/useSchoolStore";
import { Text } from "@gluestack-ui/nativewind";
import { ChevronLeft, Save } from "lucide-react-native";

export default function EditSchoolScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { schools, updateSchool } = useSchoolStore();
  const school = schools.find((s) => s.id === id);

  const [name, setName] = useState(school?.name || "");
  const [address, setAddress] = useState(school?.address || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async () => {
    if (!name || !address || !id) return;
    setIsSubmitting(true);
    await updateSchool(id, { name, address });
    setIsSubmitting(false);
    router.back();
  };

  if (!school) return null;

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: "Editar Unidade",
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
              onPress={handleUpdate}
              disabled={!name || !address || isSubmitting}
            >
              <Save size={22} color="#0f172a" />
              <Text className="text-[#0f172a] font-bold text-xl ml-3">
                {isSubmitting ? "Salvando..." : "Atualizar Escola"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>

  );
}
