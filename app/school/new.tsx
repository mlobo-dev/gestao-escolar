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
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: "Add New School",
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
                placeholder="e.g. Central High School"
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
                placeholder="e.g. 123 Education St, City"
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
              onPress={handleSave}
              disabled={!name || !address || isSubmitting}
            >
              <Save size={20} color="#fff" />
              <Text className="text-white font-bold text-lg ml-2">
                {isSubmitting ? "Saving..." : "Save School"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
