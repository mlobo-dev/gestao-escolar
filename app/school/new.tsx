import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useSchoolStore } from "../../src/store/useSchoolStore";
import { Text } from "@gluestack-ui/nativewind";
import { ChevronLeft, Save } from "lucide-react-native";

import { useTranslation } from "react-i18next";

export default function NewSchoolScreen() {
  const { t } = useTranslation();
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
    router.replace("/");
  };

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: t("add_school"),
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
              <Text className="text-muted-foreground text-[10px] font-bold uppercase tracking-[2px] mb-3 ml-1">
                {t("name")}
              </Text>
              <TextInput
                testID="school-name-input"
                className="bg-card border border-white/10 rounded-2xl px-5 py-4 text-lg text-foreground"
                placeholder={t("name_placeholder")}

                placeholderTextColor="rgba(255,255,255,0.4)"
                value={name}
                onChangeText={setName}
              />

              {!name && (
                <Text className="text-destructive text-[10px] mt-2 ml-1 font-bold uppercase tracking-wider">
                  {t("required_field")}
                </Text>
              )}
            </View>

            <View className="mb-10">
              <Text className="text-muted-foreground text-[10px] font-bold uppercase tracking-[2px] mb-3 ml-1">
                {t("address")}
              </Text>
              <TextInput
                testID="school-address-input"
                className="bg-card border border-white/10 rounded-2xl px-5 py-4 text-lg text-foreground min-h-[120px]"
                placeholder={t("address_placeholder")}

                placeholderTextColor="rgba(255,255,255,0.4)"

                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={address}
                onChangeText={setAddress}
              />
              {!address && (
                <Text className="text-destructive text-[10px] mt-2 ml-1 font-bold uppercase tracking-wider">
                  {t("required_field")}
                </Text>
              )}
            </View>

            <TouchableOpacity
              testID="save-school-button"
              className={`bg-primary p-5 rounded-[24px] flex-row items-center justify-center shadow-xl shadow-primary/20 ${
                (!name || !address || isSubmitting) && "opacity-40"
              }`}
              onPress={handleSave}
              disabled={!name || !address || isSubmitting}
            >

              <Save size={22} color="#020617" />
              <Text className="text-[#020617] font-bold text-xl ml-3">
                {isSubmitting ? t("saving") : t("save")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
