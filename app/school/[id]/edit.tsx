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
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: "Edit School",
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
                School Name
              </Text>
              <TextInput
                className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-base text-slate-900"
                value={name}
                onChangeText={setName}
              />
              {!name && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                  School name is required
                </Text>
              )}
            </View>

            <View className="mb-8">
              <Text className="text-slate-500 text-sm font-bold uppercase mb-2">
                Address
              </Text>
              <TextInput
                className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-base text-slate-900"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={address}
                onChangeText={setAddress}
              />
              {!address && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                  Address is required
                </Text>
              )}
            </View>

            <TouchableOpacity
              className={`bg-blue-700 p-4 rounded-3xl flex-row items-center justify-center shadow-md ${
                (!name || !address || isSubmitting) && "opacity-50"
              }`}
              onPress={handleUpdate}
              disabled={!name || !address || isSubmitting}
            >
              <Save size={20} color="#fff" />
              <Text className="text-white font-bold text-lg ml-2">
                {isSubmitting ? "Updating..." : "Update School"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
