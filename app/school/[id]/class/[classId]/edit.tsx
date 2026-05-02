import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { useSchoolStore } from "../../../../../src/store/useSchoolStore";
import { Text } from "@gluestack-ui/nativewind";
import { ChevronLeft, Save } from "lucide-react-native";
import { Shift } from "../../../../../src/types";

const SHIFTS: Shift[] = ["Morning", "Afternoon", "Night", "Full-time"];

export default function EditClassScreen() {
  const router = useRouter();
  const { id, classId } = useLocalSearchParams<{ id: string; classId: string }>();
  const { classes, updateClass } = useSchoolStore();
  const schoolClass = classes.find((c) => c.id === classId);

  const [name, setName] = useState(schoolClass?.name || "");
  const [shift, setShift] = useState<Shift>(schoolClass?.shift || "Morning");
  const [year, setYear] = useState(schoolClass?.academicYear || "2024");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async () => {
    if (!name || !shift || !year || !classId) return;
    setIsSubmitting(true);
    await updateClass(classId, {
      name,
      shift,
      academicYear: year,
    });
    setIsSubmitting(false);
    router.back();
  };

  if (!schoolClass) return null;

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: "Editar Turma",
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
                Nome da Turma
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

            <View className="mb-8">
              <Text className="text-white/40 text-xs font-bold uppercase tracking-[2px] mb-4 ml-1">
                Turno
              </Text>
              <View className="flex-row flex-wrap">
                {SHIFTS.map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setShift(s)}
                    className={`mr-3 mb-3 px-5 py-3 rounded-2xl border ${
                      shift === s
                        ? "bg-primary border-primary"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <Text
                      className={`font-medium ${
                        shift === s ? "text-white" : "text-slate-600"
                      }`}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-8">
              <Text className="text-slate-500 text-sm font-bold uppercase mb-2">
                Academic Year
              </Text>
              <TextInput
                className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-base text-slate-900"
                keyboardType="numeric"
                value={year}
                onChangeText={setYear}
              />
              {!year && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                  Academic year is required
                </Text>
              )}
            </View>

            <TouchableOpacity
              className={`bg-blue-700 p-4 rounded-3xl flex-row items-center justify-center shadow-md ${
                (!name || !year || isSubmitting) && "opacity-50"
              }`}
              onPress={handleUpdate}
              disabled={!name || !year || isSubmitting}
            >
              <Save size={20} color="#fff" />
              <Text className="text-white font-bold text-lg ml-2">
                {isSubmitting ? "Updating..." : "Update Class"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
