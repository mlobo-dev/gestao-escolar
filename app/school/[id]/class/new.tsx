import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { useSchoolStore } from "../../../../src/store/useSchoolStore";
import { Text } from "@gluestack-ui/nativewind";
import { ChevronLeft, Save } from "lucide-react-native";
import { Shift } from "../../../../src/types";

const SHIFTS: Shift[] = ["Morning", "Afternoon", "Night", "Full-time"];

export default function NewClassScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addClass } = useSchoolStore();

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

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: "Nova Turma",
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
                placeholder="Ex: 1º Ano A"
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
                      className={`font-bold text-sm tracking-tight ${
                        shift === s ? "text-[#0f172a]" : "text-white/60"
                      }`}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-10">
              <Text className="text-white/40 text-xs font-bold uppercase tracking-[2px] mb-3 ml-1">
                Ano Letivo
              </Text>
              <TextInput
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-lg text-white"
                placeholder="Ex: 2024"
                placeholderTextColor="rgba(255,255,255,0.2)"
                keyboardType="numeric"
                value={year}
                onChangeText={setYear}
              />
              {!year && (
                <Text className="text-destructive text-[10px] mt-2 ml-1 font-bold uppercase tracking-wider">
                  O ano letivo é obrigatório
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
              <Save size={22} color="#0f172a" />
              <Text className="text-[#0f172a] font-bold text-xl ml-3">
                {isSubmitting ? "Salvando..." : "Salvar Turma"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>

  );
}
