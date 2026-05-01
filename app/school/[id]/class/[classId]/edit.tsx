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
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: "Edit Class",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
              className="mr-4"
            >
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView className="flex-1">
        <View className="items-center p-6">
          <View className="w-full max-w-2xl">
            <View className="mb-6">
              <Text className="text-slate-500 text-sm font-bold uppercase mb-2">
                Class Name
              </Text>
              <TextInput
                className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-base text-slate-900"
                value={name}
                onChangeText={setName}
              />
              {!name && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                  Class name is required
                </Text>
              )}
            </View>

            <View className="mb-6">
              <Text className="text-slate-500 text-sm font-bold uppercase mb-2">
                Shift
              </Text>
              <View className="flex-row flex-wrap">
                {SHIFTS.map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setShift(s)}
                    className={`mr-2 mb-2 px-4 py-2 rounded-xl border ${
                      shift === s
                        ? "bg-blue-700 border-blue-700"
                        : "bg-white border-slate-200"
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
