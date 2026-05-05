import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, ScrollView, Text } from "react-native";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Save } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../../context/ThemeContext";
import { useSchools } from "../../../hooks/useSchools";

export const SchoolFormScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { allSchools, addSchool, updateSchool } = useSchools();
  const school = id ? allSchools.find((s) => s.id === id) : null;
  const isEditing = !!id;

  const { colorScheme } = useThemeContext();
  const isDark = colorScheme === "dark";

  const [name, setName] = useState(school?.name || "");
  const [address, setAddress] = useState(school?.address || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!name || !address) return;
    setIsSubmitting(true);
    if (isEditing && id) {
      await updateSchool(id, { name, address });
      setIsSubmitting(false);
      router.back();
    } else {
      await addSchool({ name, address });
      setIsSubmitting(false);
      router.replace("/");
    }
  };

  if (isEditing && !school) return null;

  const labelColor = isDark ? "text-slate-400" : "text-slate-500";
  const inputBg = isDark ? "bg-card" : "bg-slate-50";
  const inputColor = isDark ? "text-white" : "text-slate-900";
  const borderColor = isDark ? "border-white/10" : "border-slate-200";

  return (
    <View className={`flex-1 bg-background ${isDark ? "dark" : ""}`}>
      <Stack.Screen
        options={{
          title: isEditing ? t("edit_school") : t("add_school"),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
              className="mr-4"
            >
              <ChevronLeft size={24} color="#f8fafc" />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: "#020617" },
          headerTintColor: "#f8fafc",
          headerShadowVisible: false,
        }}
      />
      <ScrollView className="flex-1">
        <View className="items-center p-8">
          <View className="w-full max-w-2xl">
            <View className="mb-8">
              <Text className={`${labelColor} text-[10px] font-bold uppercase tracking-[2px] mb-3 ml-1`}>
                {t("name")}
              </Text>
              <TextInput
                testID="school-name-input"
                className={`${inputBg} border ${borderColor} rounded-2xl px-5 py-4 text-lg ${inputColor}`}
                placeholder={t("name_placeholder")}
                placeholderTextColor={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"}
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
              <Text className={`${labelColor} text-[10px] font-bold uppercase tracking-[2px] mb-3 ml-1`}>
                {t("address")}
              </Text>
              <TextInput
                testID="school-address-input"
                className={`${inputBg} border ${borderColor} rounded-2xl px-5 py-4 text-lg ${inputColor} min-h-[120px]`}
                placeholder={t("address_placeholder")}
                placeholderTextColor={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"}
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
                {isSubmitting ? (isEditing ? t("updating") : t("saving")) : (isEditing ? t("update") : t("save"))}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
