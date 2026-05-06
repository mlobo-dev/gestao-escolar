import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Text,
} from "react-native";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Save } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../../../context/ThemeContext";
import { useClasses } from "../../../hooks/useClasses";
import { Shift } from "../../../types";

const SHIFTS: Shift[] = ["Morning", "Afternoon", "Night", "Full-time"];

export const ClassFormScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id: schoolId, classId } = useLocalSearchParams<{
    id: string;
    classId: string;
  }>();
  const { allClasses, addClass, updateClass } = useClasses(schoolId!);

  const classData = classId ? allClasses.find((c) => c.id === classId) : null;
  const isEditing = !!classId;

  const { colorScheme } = useThemeContext();
  const isDark = colorScheme === "dark";

  const [name, setName] = useState(classData?.name || "");
  const [shift, setShift] = useState<Shift>(classData?.shift || "Morning");
  const [year, setYear] = useState(
    classData?.academicYear || new Date().getFullYear().toString()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!name || !shift || !year) return;
    setIsSubmitting(true);

    if (isEditing && classId) {
      await updateClass(classId, {
        name,
        shift,
        academicYear: year,
      });
      setIsSubmitting(false);
      router.back();
    } else {
      await addSchoolClass();
    }
  };

  const addSchoolClass = async () => {
    await addClass({
      schoolId: schoolId!,
      name,
      shift,
      academicYear: year,
    });
    setIsSubmitting(false);
    router.back();
  };

  if (isEditing && !classData) return null;

  const labelColor = isDark ? "text-slate-400" : "text-slate-500";
  const inputBg = isDark ? "bg-card" : "bg-slate-50";
  const inputColor = isDark ? "text-white" : "text-slate-900";
  const borderColor = isDark ? "border-white/10" : "border-slate-200";

  const getButtonText = () => {
    if (isSubmitting) {
      return isEditing ? t("updating") : t("saving");
    }
    return isEditing ? t("update") : t("save");
  };

  return (
    <View className={`flex-1 bg-background ${isDark ? "dark" : ""}`}>
      <Stack.Screen
        options={{
          title: isEditing ? t("edit_class") : t("add_class"),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() =>
                router.canGoBack() ? router.back() : router.replace("/")
              }
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
              <Text
                className={`${labelColor} text-[10px] font-bold uppercase tracking-[2px] mb-3 ml-1`}
              >
                {t("name")}
              </Text>
              <TextInput
                testID="class-name-input"
                className={`${inputBg} border ${borderColor} rounded-2xl px-5 py-4 text-lg ${inputColor}`}
                placeholder={t("class_name_placeholder")}
                placeholderTextColor={
                  isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"
                }
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
              <Text
                className={`${labelColor} text-[10px] font-bold uppercase tracking-[2px] mb-4 ml-1`}
              >
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
                        shift === s
                          ? "text-[#020617]"
                          : `${isDark ? "text-white" : "text-slate-600"}`
                      }`}
                    >
                      {t(s.toLowerCase().replace("-", "_"))}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-10">
              <Text
                className={`${labelColor} text-[10px] font-bold uppercase tracking-[2px] mb-3 ml-1`}
              >
                {t("academic_year")}
              </Text>
              <TextInput
                testID="class-year-input"
                className={`${inputBg} border ${borderColor} rounded-2xl px-5 py-4 text-lg ${inputColor}`}
                placeholder={t("year_placeholder")}
                placeholderTextColor={
                  isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"
                }
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
              testID="save-class-button"
              className={`bg-primary p-5 rounded-[24px] flex-row items-center justify-center shadow-xl shadow-primary/20 ${
                (!name || !year || isSubmitting) && "opacity-40"
              }`}
              onPress={handleSave}
              disabled={!name || !year || isSubmitting}
            >
              <Save size={22} color="#020617" />
              <Text className="text-[#020617] font-bold text-xl ml-3">
                {getButtonText()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
