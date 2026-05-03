import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, ScrollView, Text } from "react-native";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { useSchoolStore } from "../../../../src/store/useSchoolStore";
// import { Text } from "@gluestack-ui/nativewind";
import { ChevronLeft, Save } from "lucide-react-native";
import { Shift } from "../../../../src/types";
import { useColorScheme } from "nativewind";

const SHIFTS: Shift[] = ["Morning", "Afternoon", "Night", "Full-time"];

import { useTranslation } from "react-i18next";

export default function NewClassScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addClass } = useSchoolStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [name, setName] = useState("");
  const [shift, setShift] = useState<Shift>("Morning");
  const [year, setYear] = useState("2024");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!name || !shift || !year || !id) return;
    setIsSubmitting(true);
    await addClass({
      schoolId: id,
      name,
      shift,
      academicYear: year,
    });
    setIsSubmitting(false);
    router.back();
  };

  const labelColor = isDark ? "text-slate-400" : "text-slate-500";
  const inputBg = isDark ? "bg-card" : "bg-slate-50";
  const inputColor = isDark ? "text-white" : "text-slate-900";
  const borderColor = isDark ? "border-white/10" : "border-slate-200";

  return (
    <View className={`flex-1 bg-background ${isDark ? "dark" : ""}`}>
      <Stack.Screen
        options={{
          title: t("add_class"),
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
                className={`${inputBg} border ${borderColor} rounded-2xl px-5 py-4 text-lg ${inputColor}`}
                placeholder={t("class_name_placeholder")}
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

            <View className="mb-8">
              <Text className={`${labelColor} text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-1`}>
                {t("shift")}
              </Text>
              <View className="flex-row flex-wrap">
                {SHIFTS.map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setShift(s)}
                    className={`mr-3 mb-3 px-5 py-3 rounded-2xl border ${
                      shift === s
                        ? "bg-primary border-primary"
                        : `${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`
                    }`}
                  >
                    <Text
                      className={`font-bold text-sm tracking-tight ${
                        shift === s ? "text-[#020617]" : `${isDark ? "text-white" : "text-slate-600"}`
                      }`}
                    >
                      {t(s.toLowerCase().replace("-", "_"))}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-10">
              <Text className={`${labelColor} text-[10px] font-bold uppercase tracking-[2px] mb-3 ml-1`}>
                {t("academic_year")}
              </Text>
              <TextInput
                className={`${inputBg} border ${borderColor} rounded-2xl px-5 py-4 text-lg ${inputColor}`}
                placeholder={t("year_placeholder")}
                placeholderTextColor={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"}
                keyboardType="numeric"
                value={year}
                onChangeText={setYear}
              />

              {!year && (
                <Text className="text-destructive text-[10px] mt-2 ml-1 font-bold uppercase tracking-wider">
                  {t("required_field")}
                </Text>
              )}
            </View>

            <TouchableOpacity
              className={`bg-primary p-5 rounded-[24px] flex-row items-center justify-center shadow-xl shadow-primary/20 ${
                (!name || !year || isSubmitting) && "opacity-40"
              }`}
              onPress={handleSave}
              disabled={!name || !year || isSubmitting}
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


  );
}
